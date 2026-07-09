import React, { useState, useRef, useEffect } from "react";
import { 
  Terminal as TermIcon, Plus, X, Maximize2, Minimize2, 
  Settings, HelpCircle, RefreshCw, ChevronRight, FileText, Check,
  BookOpen, Copy, Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TerminalViewProps {
  commandsPracticedCount: number;
  incrementCommandsPracticed: () => void;
  addXP: (amount: number, reason: string) => void;
}

interface Tab {
  id: string;
  name: string;
  hostname: string;
  history: string[];
  outputs: { type: "input" | "output" | "error"; text: string }[];
  currentDir: string;
}

const TERMINAL_THEMES = [
  { id: "kali", name: "Kali Neon", bg: "bg-[#050505]", text: "text-[#00ff66]", border: "border-cyber-green/40", prompt: "text-cyber-green" },
  { id: "matrix", name: "Classic Matrix", bg: "bg-[#020d04]", text: "text-[#00FF38]", border: "border-green-600/30", prompt: "text-[#00FF38]" },
  { id: "cyberpunk", name: "Cyberpunk Night", bg: "bg-[#0d0114]", text: "text-[#00e5ff]", border: "border-[#8b5cf6]/30", prompt: "text-[#ff0055]" },
  { id: "monochrome", name: "Classic White", bg: "bg-[#080808]", text: "text-gray-100", border: "border-gray-800", prompt: "text-blue-400" }
];

const COMMAND_CATEGORIES = [
  {
    id: "filesystem",
    name: "File System",
    color: "text-cyber-blue",
    border: "border-cyber-blue/20",
    bg: "bg-cyber-blue/10",
    commands: [
      { cmd: "ls -la", desc: "List all directory contents, including hidden files, with detailed metadata" },
      { cmd: "cd /home", desc: "Change current directory path to absolute location" },
      { cmd: "pwd", desc: "Print current active directory full absolute path" },
      { cmd: "mkdir backup", desc: "Instantiate a new directory named 'backup'" },
      { cmd: "cp file.txt backup/", desc: "Copy 'file.txt' from current workspace into 'backup' directory" },
      { cmd: "mv script.py archive/", desc: "Move, relocate, or rename 'script.py' to 'archive' target" },
      { cmd: "rm -rf temp_dir", desc: "Forcefully and recursively remove directories and file children" }
    ]
  },
  {
    id: "permissions",
    name: "Permissions",
    color: "text-cyber-orange",
    border: "border-cyber-orange/20",
    bg: "bg-cyber-orange/10",
    commands: [
      { cmd: "chmod +x script.py", desc: "Grant executive credentials and flags to target 'script.py'" },
      { cmd: "chmod 755 binary", desc: "Grant read/write/execute for owner, and read/execute for group/others" },
      { cmd: "chown root:root file.txt", desc: "Reassign both owner and group of 'file.txt' to root superuser" },
      { cmd: "ls -l confidential.txt", desc: "Inspect current permission masks, ownership, and descriptors" }
    ]
  },
  {
    id: "network",
    name: "Network",
    color: "text-cyber-purple",
    border: "border-cyber-purple/20",
    bg: "bg-cyber-purple/10",
    commands: [
      { cmd: "ping -c 4 8.8.8.8", desc: "Transmit 4 ICMP requests to inspect remote host network latency" },
      { cmd: "nmap -sS -sV 192.168.1.100", desc: "Trigger stealth SYN port scanning and remote services identification" },
      { cmd: "curl -I https://google.com", desc: "Perform request and fetch only response headers from destination URL" },
      { cmd: "ssh root@10.10.10.10", desc: "Establish secure SSH encrypted socket tunnel and authenticate daemon" },
      { cmd: "ifconfig", desc: "Examine active network interface configurations and local network nodes" }
    ]
  }
];

export const TerminalView: React.FC<TerminalViewProps> = ({ 
  commandsPracticedCount, 
  incrementCommandsPracticed,
  addXP 
}) => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "tab-1",
      name: "bash (1)",
      hostname: "kali@cyberos",
      history: [],
      outputs: [
        { type: "output", text: "========================================================" },
        { type: "output", text: "              CYBEROS BOOTING SEQUENCE... [OK]" },
        { type: "output", text: "        KALI LINUX KERNEL 6.1.0-kali-amd64 INSTANTIATED" },
        { type: "output", text: "========================================================" },
        { type: "output", text: "Type 'help' to review simulated commands or trigger hacking tools." },
        { type: "output", text: "" }
      ],
      currentDir: "~"
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("tab-1");
  const [commandInput, setCommandInput] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [themeIndex, setThemeIndex] = useState<number>(0);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState<number>(-1);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [showReference, setShowReference] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(cmd);
    setTimeout(() => setCopiedCommand(null), 2000);
    addXP(5, `Copied command reference: [${cmd}]`);
  };
  
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const activeTheme = TERMINAL_THEMES[themeIndex];

  // Auto-scroll on new output lines
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTab.outputs]);

  // Command Autocomplete list
  const AVAILABLE_COMMANDS = [
    "help", "ls", "pwd", "mkdir", "grep", "find", "chmod", 
    "ssh", "python3", "git", "curl", "ping", "apt", "nano", "vim", "clear", "nmap"
  ];

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = commandInput.trim();
    if (!cleanCmd) return;

    // Save history & command practiced triggers
    incrementCommandsPracticed();
    if (Math.random() > 0.6) {
      addXP(10, "Executed interactive terminal instruction");
    }

    const updatedOutputs = [...activeTab.outputs, { type: "input" as const, text: `${activeTab.hostname}:${activeTab.currentDir}$ ${cleanCmd}` }];
    const lowerCmd = cleanCmd.toLowerCase();
    const parts = lowerCmd.split(" ");
    const coreCmd = parts[0];

    let outputText = "";
    let isError = false;

    // Process commands
    switch (coreCmd) {
      case "help":
        outputText = `CyberOS Core Bash Shell Commands:
  - ls                                  : List entries inside simulated work directory.
  - pwd                                 : Print absolute path structure.
  - mkdir <folder>                      : Instantiate directory node.
  - ping <host>                         : Inspect physical packet roundtrip ping durations.
  - clear                               : Purge output stream.
  - grep <search> <file>                : Execute search on local streams.
  - python3 <script.py>                 : Execute interactive Python code.
  - chmod <permissions> <file>          : Modify security clearance settings.
  - nmap -sS -sV <ip_address>           : Trigger simulated network scans.
  - ssh root@localhost                  : Initialize secure tunnel daemon.
  - apt-get install <pkg>               : Simulated package installer repository.
  - nano / vim                          : Simple text buffers simulation.`;
        break;

      case "clear":
        setTabs(tabs.map(t => t.id === activeTabId ? { ...t, outputs: [] } : t));
        setCommandInput("");
        setCommandHistoryIndex(-1);
        return;

      case "ls":
        outputText = `confidential.txt    user_credentials.csv    ssh_bruter.py    packet_stream.pcap    ports.json`;
        break;

      case "pwd":
        outputText = `/home/kali/workspace`;
        break;

      case "mkdir":
        const dirName = parts[1] || "new_folder";
        outputText = `Created virtual folder workspace: /home/kali/workspace/${dirName}`;
        break;

      case "ping":
        const target = parts[1] || "8.8.8.8";
        outputText = `PING ${target} (56 bytes of data).
64 bytes from ${target}: icmp_seq=1 ttl=64 time=14.2 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=11.5 ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=15.1 ms
--- ${target} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2004ms
rtt min/avg/max/mdev = 11.5/13.6/15.1/1.52 ms`;
        break;

      case "grep":
        if (cleanCmd.includes("admin")) {
          outputText = `user_credentials.csv:
3,admin_sys_node,55,9a8b7c6d5e4f3a2b1c,ADMINISTRATOR_LEVEL_9`;
        } else {
          outputText = `Syntax: grep <search_string> user_credentials.csv\nExample: grep "admin" user_credentials.csv`;
        }
        break;

      case "chmod":
        outputText = `System modified security descriptor successfully: mode +x applied to SSH payload script.`;
        break;

      case "ssh":
        outputText = `INITIALIZING ENCRYPTED TUNNEL FOR root@localhost...
Warning: Permanent identity key registered. Authenticating...
Connected successfully to localhost shell daemon. Type 'exit' to terminate connection.`;
        break;

      case "python3":
        if (cleanCmd.includes("ssh_bruter")) {
          outputText = `[+] Initiating SSH Brute-Force attack simulation against 192.168.1.100...
[+] Reading dictionary payload list 'wordlist.txt' with 150 entries...
[-] Attempting [admin : password123] - Auth Denied
[-] Attempting [admin : oracle] - Auth Denied
[-] Attempting [admin : shadow] - Auth Denied
[+] Attempting [admin_sys_node : 9a8b7c6d5e4f3a2b1c] - [SUCCESS]
[+] Password successfully extracted! Root credentials generated.`;
          addXP(40, "Completed local SSH brute-force scripting test");
        } else {
          outputText = `Python 3.10.12 (main, Jun 11 2026)
Use 'python3 ssh_bruter.py' to run your localized dictionary exploit tool.`;
        }
        break;

      case "nmap":
        outputText = `Starting Nmap 7.93 ( https://nmap.org ) at 2026-07-08 02:45 UTC
Nmap scan report for target host (192.168.1.100)
Host is up (0.0021s latency).
Not shown: 997 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
21/tcp   OPEN  ftp     vsftpd 3.0.3
22/tcp   OPEN  ssh     OpenSSH 8.9p1
80/tcp   OPEN  http    Apache httpd 2.4.41
MAC Address: 00:50:56:C0:00:08 (VMware)
Device type: general purpose
Running: Linux 5.X
OS CPE: cpe:/o:linux:linux_kernel:5
OS details: Linux 5.0 - 5.3
Network Distance: 1 hop

OS and Service detection performed. Please execute further scans.`;
        break;

      case "apt-get":
      case "apt":
        const pkg = parts[2] || parts[1] || "";
        if (pkg.includes("install")) {
          const specificPkg = parts[2] || "hydra";
          outputText = `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  ${specificPkg}
0 upgraded, 1 newly installed, 0 to remove.
Need to get 1,204 kB of archives.
Unpacking ${specificPkg} ...
Setting up ${specificPkg} ... Done`;
        } else {
          outputText = `apt 2.5.3 (amd64)
Usage: apt install <package_name>`;
        }
        break;

      case "git":
        outputText = `git version 2.39.2
Use git commands to pull core training notes and code frameworks.`;
        break;

      case "curl":
        outputText = `HTTP/2 200
server: nginx/1.24.0
date: Wed, 08 Jul 2026 02:46:12 GMT
content-type: text/html; charset=UTF-8
strict-transport-security: max-age=31536000; includeSubDomains
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff`;
        break;

      case "nano":
      case "vim":
        outputText = `[VIRTUAL BUFFER ACTIVE]
Successfully loaded file contents buffer inside standard output memory streams.
You have read clearance to view but edits are processed inside code explorer pane directly.`;
        break;

      default:
        outputText = `cyberos-bash: command not found: ${coreCmd}. Type 'help' to review simulated commands list.`;
        isError = true;
    }

    setTabs(tabs.map(t => {
      if (t.id === activeTabId) {
        return {
          ...t,
          history: [...t.history, cleanCmd],
          outputs: [
            ...updatedOutputs, 
            { type: isError ? "error" as const : "output" as const, text: outputText },
            { type: "output" as const, text: "" }
          ]
        };
      }
      return t;
    }));

    setCommandInput("");
    setCommandHistoryIndex(-1);
  };

  const handleAutocomplete = () => {
    const cleanCmd = commandInput.trim().toLowerCase();
    if (!cleanCmd) return;

    const matches = AVAILABLE_COMMANDS.filter(c => c.startsWith(cleanCmd));
    if (matches.length === 1) {
      setCommandInput(matches[0]);
    } else if (matches.length > 1) {
      // Print matches to output
      setTabs(tabs.map(t => {
        if (t.id === activeTabId) {
          return {
            ...t,
            outputs: [
              ...t.outputs,
              { type: "input" as const, text: `${t.hostname}:${t.currentDir}$ ${commandInput}` },
              { type: "output" as const, text: matches.join("    ") },
              { type: "output" as const, text: "" }
            ]
          };
        }
        return t;
      }));
    }
  };

  const addNewTab = () => {
    const nextId = `tab-${tabs.length + 1}`;
    const newTab: Tab = {
      id: nextId,
      name: `bash (${tabs.length + 1})`,
      hostname: "kali@cyberos",
      history: [],
      outputs: [
        { type: "output", text: `[+] Spawned new background terminal session ${nextId}` },
        { type: "output", text: `Ready for tactical instructions.` }
      ],
      currentDir: "~"
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(nextId);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Prevent closing the last tab

    const nextTabs = tabs.filter(t => t.id !== tabId);
    setTabs(nextTabs);
    if (activeTabId === tabId) {
      setActiveTabId(nextTabs[0].id);
    }
  };

  return (
    <div className={`flex flex-col rounded-xl border ${activeTheme.border} ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : "h-[550px]"} overflow-hidden bg-black transition-all shadow-md`}>
      {/* Top Titlebar */}
      <div className="bg-cyber-card border-b border-cyber-border p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TermIcon size={16} className="text-cyber-green" />
          <span className="font-display font-extrabold text-xs text-cyber-text tracking-widest uppercase">
            SEC_OPERATIONS // TERMINAL CORE
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/20 font-bold">
            DOCKER_SIM
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setShowReference(!showReference)}
            className={`p-1 px-2 rounded font-mono text-[10px] uppercase flex items-center gap-1.5 border transition-all font-bold cursor-pointer ${
              showReference 
                ? "border-cyber-green text-cyber-green bg-cyber-green/10" 
                : "border-cyber-border text-cyber-text-muted hover:text-cyber-text hover:border-cyber-text-muted"
            }`}
            title="Toggle Command Reference"
          >
            <BookOpen size={11} />
            <span>REFERENCE</span>
          </button>

          <button 
            onClick={() => setShowConfig(!showConfig)}
            className={`text-cyber-text-muted hover:text-cyber-text cursor-pointer ${showConfig ? "text-cyber-green" : ""}`}
            title="Themes"
          >
            <Settings size={14} />
          </button>
          
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-cyber-text-muted hover:text-cyber-text cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="bg-cyber-input-bg flex items-center border-b border-cyber-border overflow-x-auto">
        <div className="flex items-center p-1 gap-1">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs cursor-pointer transition-all ${
                activeTabId === tab.id 
                  ? `${activeTheme.bg} text-white border border-cyber-border shadow-sm font-bold` 
                  : "text-cyber-text-muted hover:text-cyber-text"
              }`}
            >
              <ChevronRight size={10} className={activeTabId === tab.id ? "text-cyber-green animate-pulse" : "text-cyber-text-muted"} />
              <span>{tab.name}</span>
              {tabs.length > 1 && (
                <X 
                  size={10} 
                  className="hover:text-cyber-red ml-1 cursor-pointer" 
                  onClick={(e) => closeTab(tab.id, e)} 
                />
              )}
            </div>
          ))}

          <button 
            onClick={addNewTab}
            className="p-1 rounded bg-cyber-bg hover:bg-cyber-card text-cyber-text-muted hover:text-cyber-text border border-cyber-border cursor-pointer transition-all"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Theme selection panel */}
      {showConfig && (
        <div className="bg-cyber-card border-b border-cyber-border p-3 flex flex-wrap gap-2 items-center justify-between text-xs font-mono shadow-inner">
          <span className="text-cyber-text-muted uppercase font-bold">Switch Active Theme:</span>
          <div className="flex flex-wrap gap-2">
            {TERMINAL_THEMES.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  setThemeIndex(idx);
                  setShowConfig(false);
                }}
                className={`px-2.5 py-1 rounded border text-[10px] uppercase transition-all font-bold cursor-pointer ${
                  themeIndex === idx 
                    ? "border-cyber-green text-cyber-green bg-cyber-green/10" 
                    : "border-cyber-border text-cyber-text-muted hover:text-cyber-text hover:border-cyber-text-muted bg-cyber-input-bg"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Terminal Viewport Arena */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Terminal Display Stream */}
        <div className={`flex-1 p-4 overflow-y-auto font-mono text-sm leading-relaxed ${activeTheme.bg} ${activeTheme.text} scanline`}>
          <div className="space-y-1.5">
            {activeTab.outputs.map((line, idx) => (
              <div 
                key={idx} 
                className={`whitespace-pre-wrap ${
                  line.type === "input" 
                    ? "font-bold text-white" 
                    : line.type === "error" 
                      ? "text-cyber-red font-bold" 
                      : ""
                }`}
              >
                {line.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Command Quick Reference Sidebar Drawer */}
        <AnimatePresence>
          {showReference && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full border-l border-cyber-border bg-cyber-card flex flex-col overflow-hidden shrink-0 shadow-lg"
            >
              <div className="p-3 border-b border-cyber-border flex items-center justify-between bg-cyber-input-bg">
                <div className="flex items-center gap-2">
                  <BookOpen size={13} className="text-cyber-green animate-pulse" />
                  <span className="font-display font-black text-xs text-cyber-text tracking-wider uppercase">BASH REF</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowReference(false)}
                  className="text-cyber-text-muted hover:text-cyber-text p-1 rounded hover:bg-cyber-input-bg cursor-pointer transition-all"
                >
                  <X size={12} />
                </button>
              </div>

              {/* Search bar inside drawer */}
              <div className="p-2 border-b border-cyber-border bg-cyber-input-bg">
                <div className="relative flex items-center">
                  <Search size={12} className="absolute left-2.5 text-cyber-text-muted" />
                  <input
                    type="text"
                    placeholder="Search commands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-cyber-bg border border-cyber-border rounded px-2.5 py-1.5 pl-8 font-mono text-[11px] text-cyber-text outline-none focus:border-cyber-green/40 placeholder:text-cyber-text-muted/50"
                  />
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => setSearchQuery("")} 
                      className="absolute right-2.5 text-cyber-text-muted hover:text-cyber-text cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              </div>

              {/* Categorized List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin bg-cyber-bg">
                {(() => {
                  const filteredCategories = COMMAND_CATEGORIES.map(category => {
                    const commands = category.commands.filter(c => 
                      c.cmd.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      c.desc.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    return { ...category, commands };
                  }).filter(category => category.commands.length > 0);

                  if (filteredCategories.length === 0) {
                    return (
                      <div className="text-center py-8 font-mono text-[10px] text-cyber-text-muted/60 italic">
                        No matches found.
                      </div>
                    );
                  }

                  return filteredCategories.map(category => (
                    <div key={category.id} className="space-y-2">
                      <div className={`font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded ${category.bg} ${category.color} border ${category.border} flex items-center justify-between`}>
                        <span>{category.name}</span>
                        <span className="text-[8px] opacity-80 font-bold">{category.commands.length}</span>
                      </div>

                      <div className="space-y-2">
                        {category.commands.map((item, idx) => (
                          <div 
                            key={idx} 
                            className="group bg-cyber-card border border-cyber-border rounded-lg p-2 hover:border-cyber-text-muted/40 transition-all flex flex-col gap-1 relative shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <code className="text-[#00ff66] font-mono text-[11px] font-bold break-all whitespace-pre-wrap select-all bg-[#0a0a0a] px-1.5 py-0.5 rounded border border-[#1a1a1a]">
                                {item.cmd}
                              </code>
                              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => setCommandInput(item.cmd)}
                                  className="p-1 rounded bg-cyber-input-bg hover:bg-cyber-bg text-cyber-text-muted hover:text-cyber-text text-[9px] font-mono border border-cyber-border cursor-pointer transition-all font-bold"
                                  title="Paste to prompt"
                                >
                                  RUN
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(item.cmd)}
                                  className="p-1 rounded bg-cyber-input-bg hover:bg-cyber-bg text-cyber-text-muted hover:text-cyber-text border border-cyber-border flex items-center justify-center cursor-pointer transition-all"
                                  title="Copy to clipboard"
                                >
                                  {copiedCommand === item.cmd ? (
                                    <Check size={10} className="text-cyber-green" />
                                  ) : (
                                    <Copy size={10} />
                                  )}
                                </button>
                              </div>
                            </div>
                            <p className="font-sans text-[10px] text-cyber-text-muted leading-normal font-medium">
                              {item.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Command prompt form */}
      <form onSubmit={handleCommandSubmit} className="bg-cyber-input-bg border-t border-cyber-border p-2 flex items-center gap-2">
        <span className={`font-mono text-xs select-none pl-2 font-bold ${activeTheme.prompt}`}>
          {activeTab.hostname}:{activeTab.currentDir}$
        </span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Type commands... (e.g. 'help', 'ls', 'python3 ssh_bruter.py', 'nmap -sS')"
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-cyber-text caret-cyber-green font-bold"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              handleAutocomplete();
            }
          }}
        />
        <div className="flex items-center gap-1.5 text-cyber-text-muted pr-2">
          <button
            type="button"
            onClick={handleAutocomplete}
            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyber-bg border border-cyber-border hover:text-cyber-text cursor-pointer transition-all font-bold"
            title="Autocomplete (Tab)"
          >
            TAB
          </button>
          <HelpCircle size={14} className="hover:text-cyber-text cursor-pointer transition-all" onClick={() => {
            setCommandInput("help");
          }} />
        </div>
      </form>
    </div>
  );
};
