import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, Send, HelpCircle, Terminal, Shield, 
  BrainCircuit, BookOpen, MessageSquare, Award, AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  sender: "user" | "spectre";
  text: string;
}

interface AIMentorViewProps {
  addXP: (amount: number, reason: string) => void;
}

const PRESET_PROMPTS = [
  { 
    label: "Explain Buffer Overflow", 
    icon: <Shield size={12} className="text-cyber-red" />,
    prompt: "Can you explain buffer overflow vulnerability in detail with a simple C code example and how to mitigate it?"
  },
  { 
    label: "Next Study Topic", 
    icon: <BrainCircuit size={12} className="text-cyber-green" />,
    prompt: "I am Level 2 and my rank is Script Kiddie. Analyze my profile and suggest a customized next study plan."
  },
  { 
    label: "Web Vulnerabilities Quiz", 
    icon: <HelpCircle size={12} className="text-cyber-blue" />,
    prompt: "Create an interactive 3-question quiz on OWASP Top 10 web vulnerabilities. Include multiple choices and complete explanations."
  },
  { 
    label: "Exploit scripting in Python", 
    icon: <Terminal size={12} className="text-cyber-purple" />,
    prompt: "Can you provide a simple Python script outline to scan for open ports on a local subnet securely?"
  }
];

export const AIMentorView: React.FC<AIMentorViewProps> = ({ addXP }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "spectre",
      text: `Greetings, Operator. I am SPECTRE, your secure AI Cognitive Mentor.
I analyze network security vectors, review vulnerabilities, draft roadmap study plans, and explain deep ethical hacking concepts. 

How can I assist you in your tactical learning curriculum today? Select a template below or write custom payloads directly.`
    }
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (promptText: string) => {
    const cleanPrompt = promptText.trim();
    if (!cleanPrompt) return;

    setMessages(prev => [...prev, { sender: "user", text: cleanPrompt }]);
    setInputText("");
    setIsLoading(true);
    setApiKeyError(null);

    try {
      const response = await fetch("/api/ai-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: cleanPrompt,
          chatHistory: messages.slice(-10) // pass last 10 messages for context
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { sender: "spectre", text: data.text }]);
        addXP(50, "Engaged with SPECTRE AI Mentor to master secure concepts");
      } else {
        // API key missing or backend error - provide standard fallback
        let fallbackResponse = "";
        
        if (cleanPrompt.toLowerCase().includes("buffer overflow")) {
          fallbackResponse = `### [OFFLINE INTEGRITY RESPONDER] Buffer Overflow Explanations

A **Buffer Overflow** occurs when a program writes more data to a block of memory (a buffer) than the buffer is allocated to hold. This overflows the boundary and overwrites adjacent memory addresses.

#### Classic C Code Vulnerability Example:
\`\`\`c
#include <string.h>
void vuln_func(char *input) {
    char buffer[8]; // Allocated space is only 8 bytes
    strcpy(buffer, input); // strcpy performs NO bounds checking!
}
\`\`\`

#### Exploitation Mechanics:
If the user passes 16 bytes of input, the stack is corrupted. Specifically, the **Saved Frame Pointer (EBP)** and the **Return Address (EIP)** are overwritten. An attacker can hijack EIP to point to malicious shellcode!

#### Mitigation Strategies:
1. **Bounds Checking**: Use safe buffer alternatives like \`strncpy\` instead of \`strcpy\`.
2. **ASLR**: Address Space Layout Randomization scrambles memory locations.
3. **DEP/NX**: Data Execution Prevention marks the stack as non-executable.
4. **Stack Canaries**: Place security tokens before return addresses to check stack integrity before returns.`;
        } else if (cleanPrompt.toLowerCase().includes("quiz") || cleanPrompt.toLowerCase().includes("web")) {
          fallbackResponse = `### [OFFLINE INTEGRITY RESPONDER] OWASP Top 10 Web Security Quiz

#### Q1: What vulnerability occurs when unvalidated user input is executed directly in database query interpreters?
- **A)** Cross-Site Scripting (XSS)
- **B)** SQL Injection (SQLi)
- **C)** CSRF
- *Explanation: SQLi occurs when data injection triggers query executions.*

#### Q2: What is the primary difference between Stored XSS and Reflected XSS?
- **A)** Stored XSS is saved directly inside server-side databases.
- **B)** Reflected XSS requires database interactions.
- *Explanation: Stored XSS resides permanently on target databases (e.g. comment systems).*`;
        } else {
          fallbackResponse = `### [SPECTRE LOCAL SECURE COMPILE] Response Fallback

**Warning: GEMINI_API_KEY is not configured in the workspace secrets panel.** To enable full intelligent queries, configure the key in **Settings > Secrets**.

#### Quick Concept Review [Local cache]:
1. **SQL Injection**: Bypassed using parameterizations.
2. **Nmap Scanning**: stealth SYN \`nmap -sS -sV <target>\` identifies version mappings.
3. **Privilege Escalation**: Leverage writable cron jobs or misconfigured SUID binaries listed in GTFOBins.

Keep reading cybersecurity labs and executing command codes to raise your clearance level!`;
        }

        setMessages(prev => [...prev, { sender: "spectre", text: fallbackResponse }]);
        
        if (data.error && data.error.includes("GEMINI_API_KEY")) {
          setApiKeyError("GEMINI_API_KEY missing in Secrets panel. Running SPECTRE on localized safe fallback templates.");
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: "spectre", text: "Error connecting to AI mentor daemon. Please make sure the server is fully running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[550px]">
      
      {/* Left panel: Quick Prompt selection templates */}
      <div className="lg:col-span-4 bg-cyber-card border border-cyber-border rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-cyber-border pb-3">
            <BrainCircuit className="text-cyber-purple animate-pulse" size={18} />
            <h3 className="font-display text-base font-bold text-cyber-text">Tac-Intelligence Core</h3>
          </div>

          <p className="text-xs text-cyber-text-muted leading-relaxed">
            Choose a pre-compiled inquiry structure to trigger instant cybersecurity reviews. SPECTRE compiles solutions, payload guidelines, and code review.
          </p>

          <div className="space-y-2">
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset.prompt)}
                disabled={isLoading}
                className="w-full text-left p-3 rounded-lg bg-cyber-input-bg border border-cyber-border hover:border-cyber-purple/50 transition-all flex items-center gap-2.5 text-xs font-mono text-cyber-text disabled:opacity-40 cursor-pointer font-bold"
              >
                {preset.icon}
                <span className="truncate">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {apiKeyError && (
          <div className="bg-cyber-orange/10 border border-cyber-orange/30 p-3 rounded-lg flex gap-2 items-start text-[10px] font-mono text-cyber-orange font-bold">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>{apiKeyError}</span>
          </div>
        )}
      </div>

      {/* Right panel: Live chatbot streams viewport */}
      <div className="lg:col-span-8 flex flex-col rounded-xl border border-cyber-purple/20 bg-cyber-card overflow-hidden shadow-sm">
        {/* Header bar */}
        <div className="bg-cyber-input-bg border-b border-cyber-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-cyber-purple" />
            <span className="font-display text-xs font-bold text-cyber-text uppercase tracking-widest">
              SPECTRE MENTOR SHELL (SEC-AI-9)
            </span>
          </div>
          <span className="font-mono text-[9px] text-cyber-purple uppercase bg-cyber-purple/10 border border-cyber-purple/20 px-2 py-0.5 rounded font-bold">
            ACTIVE ENCRYPTED CONNECTION
          </span>
        </div>

        {/* Chat Stream scroll window */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-cyber-bg">
          {messages.map((msg, idx) => (
            <div 
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-xl p-4 rounded-xl border leading-relaxed text-xs font-mono whitespace-pre-line ${
                msg.sender === "user" 
                  ? "bg-cyber-purple/10 border-cyber-purple/30 text-cyber-text font-bold shadow-[0_0_8px_rgba(139,92,246,0.05)]" 
                  : "bg-cyber-card border-cyber-border text-cyber-text"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xl p-4 rounded-xl border border-cyber-border bg-cyber-card text-cyber-text-muted font-mono text-xs flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyber-purple animate-ping" />
                <span className="font-bold">SPECTRE compiles answer tree... [PENDING]</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat input form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="bg-cyber-input-bg border-t border-cyber-border p-2 flex gap-2"
        >
          <input
            type="text"
            required
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Ask SPECTRE concepts, payloads, note reviews, or study roadmap..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-cyber-text pl-2 py-2"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 rounded-lg bg-cyber-purple/15 hover:bg-cyber-purple/25 border border-cyber-purple/40 disabled:opacity-40 text-cyber-purple cursor-pointer transition-all shrink-0 font-bold"
          >
            <Send size={14} />
          </button>
        </form>
      </div>

    </div>
  );
};
