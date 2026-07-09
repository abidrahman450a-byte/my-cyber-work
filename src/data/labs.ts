import { Lab } from "../types";

export const CYBER_LABS: Lab[] = [
  {
    id: "lab-linux-basics",
    title: "Linux Command Line Mastery",
    category: "Linux",
    difficulty: "Easy",
    duration: 30,
    xpReward: 100,
    completed: false,
    description: "Learn the foundational file system traversal and text manipulation utilities used by cybersecurity professionals inside Kali Linux.",
    files: ["user_credentials.csv", "system_status.log", "confidential.txt"],
    resources: ["https://linuxjourney.com/", "https://cheatsheet.kali.org/"],
    instructions: "Traverse the virtual directory tree. Run 'cat confidential.txt' to extract the secret password. Use 'grep' on 'user_credentials.csv' to find the system admin credentials.",
    quiz: [
      {
        id: "q-lin-1",
        question: "Which Linux command displays the current absolute working directory path?",
        options: ["ls", "pwd", "cd", "whereami"],
        correctAnswer: 1,
        explanation: "The 'pwd' (print working directory) command prints the absolute path of the current working directory to standard output."
      },
      {
        id: "q-lin-2",
        question: "How do you search for a specific text string within a log file in Linux?",
        options: ["search", "find", "grep", "cat"],
        correctAnswer: 2,
        explanation: "'grep' (global regular expression print) is the standard utility used to search files for specific patterns or strings."
      },
      {
        id: "q-lin-3",
        question: "Which command alters file read/write/execute permissions?",
        options: ["chmod", "chown", "permit", "ls -l"],
        correctAnswer: 0,
        explanation: "The 'chmod' (change mode) command modifies permissions (such as chmod +x to make a script executable)."
      }
    ]
  },
  {
    id: "lab-networking-recon",
    title: "Network Fundamentals & Traffic Infiltration",
    category: "Networking",
    difficulty: "Easy",
    duration: 45,
    xpReward: 150,
    completed: false,
    description: "Understand subnets, CIDR notation, and network protocol headers. Inspect custom packet headers and network routes.",
    files: ["packet_stream.pcap", "routes.conf"],
    resources: ["https://www.wireshark.org/docs/", "RFC 791 (IPv4 Spec)"],
    instructions: "Examine the route table. Ping 192.168.1.1 to confirm default gateway route integrity. Check packet headers in packet_stream.pcap.",
    quiz: [
      {
        id: "q-net-1",
        question: "What is the primary function of the Address Resolution Protocol (ARP)?",
        options: [
          "Translate domain names to IP addresses",
          "Map dynamic IP addresses on a network",
          "Resolve IP addresses to physical MAC addresses",
          "Secure TCP connections via handshake"
        ],
        correctAnswer: 2,
        explanation: "ARP maps IP network addresses (Layer 3) to hardware MAC addresses (Layer 2) on local subnets."
      },
      {
        id: "q-net-2",
        question: "Which port does secure SSH terminal connection run on by default?",
        options: ["21", "22", "23", "80"],
        correctAnswer: 1,
        explanation: "Secure Shell (SSH) defaults to TCP Port 22, whereas Telnet is Port 23 and FTP is Port 21."
      }
    ]
  },
  {
    id: "lab-nmap-recon",
    title: "Nmap Host Discovery & Service Scanning",
    category: "Nmap",
    difficulty: "Medium",
    duration: 40,
    xpReward: 200,
    completed: false,
    description: "Perform active network mapping. Practice SYN scans, service version detection, and vulnerability scanning with Nmap scripts (NSE).",
    files: ["nmap_targets.txt", "common_ports.json"],
    resources: ["https://nmap.org/book/man.html", "NSE Script Reference Portal"],
    instructions: "Run 'nmap -sS -sV 192.168.1.100' inside the Terminal Simulator to probe the laboratory machine. Identify the vulnerable FTP service running on Port 21.",
    quiz: [
      {
        id: "q-nm-1",
        question: "What does the -sS parameter in Nmap stand for?",
        options: ["TCP Connect Scan", "SYN Stealth Scan", "UDP Scan", "Service Version Scan"],
        correctAnswer: 1,
        explanation: "'-sS' executes a TCP SYN stealth scan (half-open scanning) which is relatively stealthy because it never completes full TCP 3-way handshakes."
      },
      {
        id: "q-nm-2",
        question: "How do you request Nmap to scan all 65535 available ports instead of the top 1000?",
        options: ["-p all", "-p-", "-p 1-65535", "Both B and C"],
        correctAnswer: 3,
        explanation: "Both '-p-' and '-p 1-65535' are valid syntax for telling Nmap to scan every possible port from 1 to 65535."
      },
      {
        id: "q-nm-3",
        question: "Which switch enables Nmap OS detection, service version detection, script scanning, and traceroute simultaneously?",
        options: ["-sC", "-O", "-A", "-T4"],
        correctAnswer: 2,
        explanation: "'-A' enables aggressive scanning which aggregates OS detection, version scanning, script scanning, and traceroute."
      }
    ]
  },
  {
    id: "lab-sqli-web",
    title: "SQL Injection (SQLi) Vulnerability Lab",
    category: "Web",
    difficulty: "Medium",
    duration: 50,
    xpReward: 250,
    completed: false,
    description: "Understand union-based and boolean-based SQL injections. Bypass auth forms and extract database tables manually.",
    files: ["db_schema.sql", "vulnerable_endpoint.py"],
    resources: ["OWASP SQL Injection Guide", "PortSwigger SQLi Web Security Academy"],
    instructions: "Simulate a SQL Injection bypass payload in the terminal. Bypass standard authentications by injecting the classic quote-or-one-equals-one payload.",
    quiz: [
      {
        id: "q-sql-1",
        question: "Why does the payload ' OR '1'='1' bypass standard SQL authentication queries?",
        options: [
          "It crashes the SQL database server",
          "It forces the query condition to always evaluate to true, bypassing password checks",
          "It encrypts the incoming database passwords",
          "It drops the entire users database table"
        ],
        correctAnswer: 1,
        explanation: "Because '1'='1' is always true, prepending it with OR causes the entire WHERE clause to evaluate to TRUE, ignoring any password validation."
      },
      {
        id: "q-sql-2",
        question: "What is the primary countermeasure against SQL Injection vulnerabilities?",
        options: [
          "MD5 password encryption",
          "Using SSL certificates (HTTPS)",
          "Implementing parameterized queries (Prepared Statements)",
          "Blocking all incoming apostrophe characters using JavaScript"
        ],
        correctAnswer: 2,
        explanation: "Prepared statements (parameterized queries) ensure the SQL engine treats user input strictly as data parameters, never as executable SQL commands."
      }
    ]
  },
  {
    id: "lab-xss-web",
    title: "Cross-Site Scripting (XSS) Mitigation",
    category: "Web",
    difficulty: "Medium",
    duration: 40,
    xpReward: 180,
    completed: false,
    description: "Explore Stored, Reflected, and DOM-based XSS. Build proof-of-concept alert cookie stealers and sanitize DOM nodes.",
    files: ["comments_module.jsx", "xss_payloads.txt"],
    resources: ["OWASP XSS Prevention Cheat Sheet", "Google XSS Game portal"],
    instructions: "Analyze comments_module.jsx. Identify the lack of HTML escaping. Run a custom script script alert('XSS') block bypass simulation.",
    quiz: [
      {
        id: "q-xss-1",
        question: "Which type of XSS occurs when a malicious script is permanently stored in a database and subsequently served to multiple visitors?",
        options: ["Reflected XSS", "Stored (Persistent) XSS", "DOM-based XSS", "Blind XSS"],
        correctAnswer: 1,
        explanation: "Stored or Persistent XSS occurs when the script payload is saved directly into the target database (e.g. comment section) and served to subsequent users."
      },
      {
        id: "q-xss-2",
        question: "How can XSS be prevented in modern web applications?",
        options: [
          "HTML entity encoding of untrusted input prior to rendering",
          "Strict Content Security Policy (CSP) headers",
          "Using robust frameworks that auto-escape state nodes (like React standard JSX)",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "A robust defense against XSS includes combining context-aware output encoding, strict CSP rules, and framework-level auto-escaping."
      }
    ]
  },
  {
    id: "lab-python-exploit",
    title: "Python Exploit Development & Automation",
    category: "Python",
    difficulty: "Medium",
    duration: 60,
    xpReward: 300,
    completed: false,
    description: "Write automated socket wrappers, scan remote network interfaces, and automate password brute-forcing with Python.",
    files: ["ssh_bruter.py", "port_scanner.py", "wordlist.txt"],
    resources: ["https://docs.python.org/3/library/socket.html", "Violent Python book references"],
    instructions: "Review ssh_bruter.py. Run 'python3 ssh_bruter.py' in the terminal to execute a brute-force test against the local mock host.",
    quiz: [
      {
        id: "q-py-1",
        question: "Which Python standard library module is used to establish raw TCP and UDP connections?",
        options: ["requests", "socket", "urllib", "sys"],
        correctAnswer: 1,
        explanation: "The 'socket' module provides access to the underlying BSD socket interface for raw TCP/IP communications."
      },
      {
        id: "q-py-2",
        question: "What is the purpose of the 'paramiko' third-party Python library?",
        options: [
          "Automate web browser testing",
          "Construct and parse raw network packets",
          "Implement SSHv2 protocol client and server connections",
          "Compile binary files to assembly bytecode"
        ],
        correctAnswer: 2,
        explanation: "Paramiko is a pure-Python library implementing the SSHv2 protocol, widely used to automate remote server admin commands securely."
      }
    ]
  },
  {
    id: "lab-metasploit-pentest",
    title: "Metasploit Framework Exploitation",
    category: "Exploitation",
    difficulty: "Hard",
    duration: 50,
    xpReward: 350,
    completed: false,
    description: "Launch msfconsole, locate appropriate exploit modules, configure payloads, and execute reverse TCP handlers to secure meterpreter sessions.",
    files: ["exploit_notes.md", "payload_builder.sh"],
    resources: ["https://docs.metasploit.com/", "Offensive Security Metasploit Unleashed"],
    instructions: "Trigger the mock Metasploit prompt using the CLI. Execute standard instructions to gain a root meterpreter console on host 192.168.1.100.",
    quiz: [
      {
        id: "q-meta-1",
        question: "What is a 'Meterpreter' payload in the Metasploit Framework?",
        options: [
          "An exploit module that triggers buffers overflows",
          "An advanced, dynamic post-exploitation payload that runs in-memory to prevent disk footprints",
          "A service scanner used to find open ports",
          "A firewall rule bypass utility"
        ],
        correctAnswer: 1,
        explanation: "Meterpreter is an advanced, dynamically extensible post-exploitation payload that resides entirely in memory, facilitating extensive remote control without raising file-integrity alarms."
      },
      {
        id: "q-meta-2",
        question: "Which command is used to assign targets or setting configuration values in Metasploit (msfconsole)?",
        options: ["assign", "set", "configure", "let"],
        correctAnswer: 1,
        explanation: "The 'set' command is standard in msfconsole (e.g. 'set RHOSTS 10.10.10.10') to configure exploit attributes."
      }
    ]
  },
  {
    id: "lab-privesc-linux",
    title: "Linux Privilege Escalation Pathways",
    category: "Exploitation",
    difficulty: "Hard",
    duration: 60,
    xpReward: 400,
    completed: false,
    description: "Identify privilege escalations via misconfigured SUID bits, writable cronjobs, and sudo permissions (GTFOBins).",
    files: ["suid_finder.sh", "etc_passwd.bak"],
    resources: ["https://gtfobins.github.io/", "LinPEAS Suite Guide"],
    instructions: "Search for files with incorrect SUID permissions. Discover the vulnerable binary 'find' with SUID bit set and execute root shells.",
    quiz: [
      {
        id: "q-pe-1",
        question: "What occurs when a binary has its SUID (Set Owner User ID) bit enabled in Linux?",
        options: [
          "It can only be executed by root users",
          "It runs with the permissions of the file's owner rather than the user executing it",
          "It encrypts its system contents on startup",
          "It automatically runs in the background as a daemon"
        ],
        correctAnswer: 1,
        explanation: "SUID tells the OS to run the executable with the privileges of the file owner (e.g., if owned by root, it runs as root, regardless of who invokes it)."
      },
      {
        id: "q-pe-2",
        question: "Where should you search to discover if a binary can be abused to bypass security restrictions or escalate local privileges?",
        options: ["OWASP Top 10", "GTFOBins", "CVE Database", "ExploitDB"],
        correctAnswer: 1,
        explanation: "GTFOBins is a curated list of Unix binaries that can be abused to bypass local security restrictions and escalate privileges if misconfigured."
      }
    ]
  },
  {
    id: "lab-forensics-traffic",
    title: "Digital Forensics & Traffic Capture Analysis",
    category: "Defensive",
    difficulty: "Hard",
    duration: 55,
    xpReward: 320,
    completed: false,
    description: "Analyze packet capture histories to trace lateral hacker movements, reconstruct downloaded malware files, and isolate security leaks.",
    files: ["compromised_host.pcap", "log_dump.txt"],
    resources: ["Wireshark Filters Guide", "SANS Digital Forensics Blog"],
    instructions: "Filter traffic using specific Wireshark query syntax. Locate the rogue HTTP transfer that pushed malicious executables to the client.",
    quiz: [
      {
        id: "q-for-1",
        question: "Which Wireshark filter syntax shows only HTTP POST requests?",
        options: ["http.request.method == \"POST\"", "http.post", "port 80.post", "tcp.flags.push == 1"],
        correctAnswer: 0,
        explanation: "'http.request.method == \"POST\"' is the exact Wireshark display filter filter string for identifying HTTP POST submissions."
      }
    ]
  }
];
