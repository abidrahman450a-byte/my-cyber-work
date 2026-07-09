import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Initialize DB
  const DB_DIR = path.join(process.cwd(), "data");
  const DB_FILE = path.join(DB_DIR, "db.json");

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const defaultState = {
    xp: 250,
    level: 2,
    streak: 5,
    rank: "Script Kiddie",
    completedLabs: [] as string[],
    hoursStudied: 18.5,
    todayGoal: 2, // hours
    weeklyGoal: 15,
    monthlyGoal: 60,
    commandsPracticedCount: 42,
    projects: [
      {
        id: "proj-1",
        title: "Intrusion Detection System Dashboard",
        description: "Developing a localized IDS sensor dashboard to monitor home network packet capture logs in real-time.",
        technology: "Python, Scapy, React, Recharts",
        progress: 65,
        githubRepo: "github.com/hacker/ids-dashboard",
        demoUrl: "demo.cyberos.local/ids",
        milestones: [
          { id: "m1", title: "Setup packet sniffer script", done: true },
          { id: "m2", title: "Build Express websocket broker", done: true },
          { id: "m3", title: "Design frontend charts in Recharts", done: false },
          { id: "m4", title: "Implement notifications for alert triggers", done: false }
        ],
        tasks: [
          { id: "t1", text: "Parse TCP headers with Scapy", status: "completed" },
          { id: "t2", text: "Design circular gauge for bandwidth", status: "in-progress" },
          { id: "t3", text: "Write systemd service installer", status: "todo" }
        ],
        bugs: [
          { id: "b1", text: "High memory utilization on long pcap sessions", status: "open", severity: "high" }
        ],
        dailyLogs: [
          { date: "2026-07-07", note: "Successfully optimized packet queue length using ring buffers." }
        ],
        notes: "Remember to run sniffer as root or adjust setcap CAP_NET_RAW+eip."
      }
    ],
    planner: [
      { id: "pl-1", title: "Network Scanning Lab", day: "Monday", time: "19:00", duration: 60 },
      { id: "pl-2", title: "SQLi Hands-on Lab", day: "Wednesday", time: "20:00", duration: 90 },
      { id: "pl-3", title: "Python Exploit Dev session", day: "Saturday", time: "14:00", duration: 120 }
    ],
    tryhackme: {
      username: "",
      linked: false,
      rank: 21530,
      xp: 8450,
      streak: 12,
      completedRooms: ["Linux Fundamentals", "Intro to Web Hacking", "Nmap Deep Dive", "Burp Suite Basics"],
      inProgressRooms: ["Wireshark Traffic Analysis", "SQL Injection Challenge"],
      badges: ["Adventurer", "First Blood", "Network Ninja", "Bug Bounty Novice"]
    },
    heatmapLogs: [
      { date: "2026-07-01", count: 3 },
      { date: "2026-07-02", count: 5 },
      { date: "2026-07-03", count: 2 },
      { date: "2026-07-05", count: 8 },
      { date: "2026-07-07", count: 4 },
      { date: "2026-07-08", count: 6 }
    ],
    unlockedBadges: ["First Steps", "Command Line Jockey", "Nmap Infiltrator"]
  };

  let state = { ...defaultState };
  if (fs.existsSync(DB_FILE)) {
    try {
      state = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    } catch (e) {
      console.error("Error reading db file, reverting to default state", e);
    }
  } else {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2));
  }

  // API - Get State
  app.get("/api/state", (req, res) => {
    res.json(state);
  });

  // API - Update State
  app.post("/api/state", (req, res) => {
    state = { ...state, ...req.body };
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
    } catch (e) {
      console.error("Error saving state to DB file", e);
    }
    res.json(state);
  });

  // API - AI Mentor (Gemini API)
  app.post("/api/ai-mentor", async (req, res) => {
    const { prompt, chatHistory } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured in the workspace secrets. Please add it to Settings > Secrets."
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      const systemInstruction = `You are "SPECTRE", an ultra-premium tactical Cybersecurity AI Mentor built directly into CyberOS.
Your personality is highly technical, cyber-intelligent, supportive, and sharp—similar to an expert security operations lead, ethical hacker, and technical mentor.
You speak in a clean, professional, scannable format, frequently using mono-spaced terms and cybersecurity references (e.g. CLI commands, security terminology).
You can:
1. Explain cybersecurity concepts, vulnerabilities (OWASP Top 10, binary exploitation, network protocols, privilege escalation) with actual command or code snippets.
2. Formulate customized learning routes, study plans, or quiz challenges.
3. Review and debug scripts (Python exploits, bash automation, payload payloads) or note logs.
4. Give concise suggestions on how to complete lab rooms or fix vulnerable projects.
Keep your responses engaging, highly informative, and extremely polished. Avoid generic chat intro fluff; get straight to the technical tactical insight. Give examples of terminal commands where helpful. Make sure your output is clean Markdown.`;

      let promptWithHistory = `${systemInstruction}\n\n`;
      if (chatHistory && chatHistory.length > 0) {
        promptWithHistory += "--- Chat History ---\n";
        chatHistory.forEach((msg: { sender: string; text: string }) => {
          promptWithHistory += `${msg.sender === "user" ? "USER" : "SPECTRE"}: ${msg.text}\n`;
        });
        promptWithHistory += "--------------------\n\n";
      }
      promptWithHistory += `USER: ${prompt}\n\nSPECTRE:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptWithHistory
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ error: err.message || "Failed to generate content from Gemini API." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
