import { useState, useEffect } from "react";
import { AppState, Project, PlannerItem, TryHackMeData } from "./types";
import { 
  Terminal as TermIcon, ShieldAlert, Cpu, Activity, Sparkles, 
  Flame, Award, Calendar, ChevronRight, Menu, X, Zap, 
  TrendingUp, Layers, UserCheck, ShieldCheck, PlayCircle,
  Sun, Moon, LogOut, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Import custom views
import { MatrixRain } from "./components/MatrixRain";
import { DashboardView } from "./components/DashboardView";
import { TerminalView } from "./components/TerminalView";
import { LabsView } from "./components/LabsView";
import { TryHackMeView } from "./components/TryHackMeView";
import { ProjectWorkspaceView } from "./components/ProjectWorkspaceView";
import { StudyPlannerView } from "./components/StudyPlannerView";
import { ProgressView } from "./components/ProgressView";
import { AIMentorView } from "./components/AIMentorView";
import { AchievementsView } from "./components/AchievementsView";
import { LoginView } from "./components/LoginView";
import { PDFWorkspaceView } from "./components/PDFWorkspaceView";

const RANKS = ["Script Kiddie", "Junior Operator", "Ethical Hacker Pro", "Cyber Operations Lead", "Root Overlord"];

export default function App() {
  const [state, setState] = useState<AppState>({
    xp: 250,
    level: 2,
    streak: 5,
    rank: "Script Kiddie",
    completedLabs: [],
    hoursStudied: 18.5,
    todayGoal: 2,
    weeklyGoal: 15,
    monthlyGoal: 60,
    commandsPracticedCount: 42,
    projects: [],
    planner: [],
    tryhackme: {
      username: "",
      linked: false,
      rank: 0,
      xp: 0,
      streak: 0,
      completedRooms: [],
      inProgressRooms: [],
      badges: []
    },
    heatmapLogs: [],
    unlockedBadges: ["First Steps", "Command Line Jockey"]
  });

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [liveTime, setLiveTime] = useState<string>(new Date().toLocaleTimeString());
  
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("cyberos-theme");
    return saved === "light" ? "light" : "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light-theme");
    } else {
      root.classList.remove("light-theme");
    }
    localStorage.setItem("cyberos-theme", theme);
  }, [theme]);

  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return localStorage.getItem("cyberos-authorized") === "true";
  });

  const handleLoginSuccess = () => {
    setIsAuthorized(true);
    localStorage.setItem("cyberos-authorized", "true");
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    localStorage.setItem("cyberos-authorized", "false");
  };
  
  // Custom interactive level up modal & toasts states
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(0);
  const [activeToasts, setActiveToasts] = useState<{ id: string; text: string; xp: number }[]>([]);

  // Fetch state on mount
  useEffect(() => {
    fetch("/api/state")
      .then(res => {
        if (!res.ok) throw new Error("API Offline");
        return res.json();
      })
      .then(data => {
        setState(data);
      })
      .catch(err => {
        console.warn("Could not load backend state. Running on persistent client-side memory.", err);
      });
  }, []);

  // Update backend state
  const syncStateToBackend = (nextState: AppState) => {
    setState(nextState);
    fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextState)
    }).catch(err => console.error("Error saving to backend", err));
  };

  // Clock ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Toast notifier triggers
  const triggerNotificationToast = (text: string, xpAmount: number) => {
    const id = `toast-${Date.now()}`;
    setActiveToasts(prev => [...prev, { id, text, xp: xpAmount }]);
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Dynamic Rank & XP modifications
  const addXP = (amount: number, reason: string) => {
    let nextXP = state.xp + amount;
    let nextLevel = state.level;
    let levelMax = nextLevel * 1000;
    let leveledUp = false;

    if (nextXP >= levelMax) {
      nextXP = nextXP - levelMax;
      nextLevel += 1;
      leveledUp = true;
    }

    // Determine current title/rank based on level
    const rankIndex = Math.min(RANKS.length - 1, Math.floor(nextLevel / 2));
    const nextRank = RANKS[rankIndex];

    // Badge triggers based on milestone accomplishments
    const nextBadges = [...state.unlockedBadges];
    if (state.commandsPracticedCount >= 50 && !nextBadges.includes("Command Line Jockey")) {
      nextBadges.push("Command Line Jockey");
      triggerNotificationToast("ACHIEVEMENT UNLOCKED: Command Line Jockey Badge!", 150);
    }

    const nextState: AppState = {
      ...state,
      xp: nextXP,
      level: nextLevel,
      rank: nextRank,
      unlockedBadges: nextBadges
    };

    if (leveledUp) {
      setUnlockedLevel(nextLevel);
      setShowLevelUpModal(true);
    }

    triggerNotificationToast(`XP GAINED: +${amount} XP (${reason})`, amount);
    syncStateToBackend(nextState);
  };

  // Lab completed handler
  const completeLabInState = (labId: string, xpReward: number) => {
    if (state.completedLabs.includes(labId)) return;

    const nextLabs = [...state.completedLabs, labId];
    
    // Add appropriate Nmap Badge
    const nextBadges = [...state.unlockedBadges];
    if (labId === "lab-nmap-recon" && !nextBadges.includes("Nmap Infiltrator")) {
      nextBadges.push("Nmap Infiltrator");
    }
    if (labId === "lab-sqli-web" && !nextBadges.includes("SQLi Buster")) {
      nextBadges.push("SQLi Buster");
    }

    const nextState = {
      ...state,
      completedLabs: nextLabs,
      unlockedBadges: nextBadges
    };

    syncStateToBackend(nextState);
  };

  const updateProjects = (nextProjects: Project[]) => {
    syncStateToBackend({ ...state, projects: nextProjects });
  };

  const updatePlanner = (nextPlanner: PlannerItem[]) => {
    syncStateToBackend({ ...state, planner: nextPlanner });
  };

  const updateTryHackMeState = (nextTHM: TryHackMeData) => {
    syncStateToBackend({ ...state, tryhackme: nextTHM });
  };

  const incrementCommandsPracticed = () => {
    const nextCount = state.commandsPracticedCount + 1;
    const nextBadges = [...state.unlockedBadges];
    
    if (nextCount >= 50 && !nextBadges.includes("Command Line Jockey")) {
      nextBadges.push("Command Line Jockey");
    }

    syncStateToBackend({
      ...state,
      commandsPracticedCount: nextCount,
      unlockedBadges: nextBadges
    });
  };

  const updateHoursStudied = (hours: number) => {
    const rounded = parseFloat(hours.toFixed(2));
    syncStateToBackend({ ...state, hoursStudied: rounded });
  };

  // Nav menus links
  const NAV_ITEMS = [
    { id: "dashboard", label: "Operations Dashboard", icon: <Layers size={16} /> },
    { id: "pdf-vault", label: "PDF Vault & Manuals", icon: <BookOpen size={16} /> },
    { id: "terminal", label: "Linux Terminal Simulator", icon: <TermIcon size={16} /> },
    { id: "labs", label: "Hacking Practice Labs", icon: <ShieldCheck size={16} /> },
    { id: "tryhackme", label: "TryHackMe Link", icon: <PlayCircle size={16} /> },
    { id: "projects", label: "Project Workspace", icon: <Activity size={16} /> },
    { id: "planner", label: "Study Planner & Focus", icon: <Calendar size={16} /> },
    { id: "progress", label: "Track Progress & Heatmap", icon: <TrendingUp size={16} /> },
    { id: "mentor", label: "SPECTRE AI Mentor", icon: <Sparkles size={16} /> },
    { id: "achievements", label: "Operator Achievements", icon: <Award size={16} /> }
  ];

  if (!isAuthorized) {
    return (
      <LoginView 
        onLoginSuccess={handleLoginSuccess} 
        theme={theme} 
        setTheme={setTheme} 
      />
    );
  }

  return (
    <div className={`min-h-screen bg-cyber-bg text-cyber-text flex flex-col font-sans selection:bg-cyber-green/30 relative overflow-x-hidden ${theme === "light" ? "light-theme" : ""}`}>
      
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0 opacity-40" />
      {theme === "dark" && <MatrixRain />}

      {/* Top Banner operations bar */}
      <header className="border-b border-cyber-border bg-cyber-nav-bg backdrop-blur-md sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-cyber-card border border-cyber-border md:hidden hover:bg-cyber-border-muted"
          >
            {sidebarOpen ? <X size={18} className="text-cyber-text" /> : <Menu size={18} className="text-cyber-text" />}
          </button>
          
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-cyber-green animate-pulse" />
            <span className="font-display font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyber-text via-cyber-text-muted to-cyber-green">
              CyberOS
            </span>
          </div>
        </div>

        {/* Live dynamic metrics strip */}
        <div className="hidden md:flex items-center gap-6 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyber-green animate-ping" />
            <span className="text-cyber-text-muted">SESSION TIME:</span>
            <span className="text-cyber-green font-bold">{liveTime}</span>
          </div>

          <div className="h-4 w-px bg-cyber-border" />

          <div>
            <span className="text-cyber-text-muted">CLEARANCE:</span>
            <span className="text-cyber-blue font-bold ml-1">{state.rank}</span>
          </div>

          <div className="h-4 w-px bg-cyber-border" />

          <div className="flex items-center gap-1">
            <Zap size={14} className="text-cyber-orange animate-bounce" />
            <span className="text-cyber-text-muted">STREAK:</span>
            <span className="text-cyber-orange font-bold">{state.streak} DAYS</span>
          </div>
        </div>

        {/* Level stats Badge & Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-cyber-card border border-cyber-border hover:bg-cyber-border-muted text-cyber-text transition-all cursor-pointer flex items-center justify-center shadow-sm"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {theme === "dark" ? (
              <Sun size={14} className="text-cyber-orange" />
            ) : (
              <Moon size={14} className="text-cyber-blue" />
            )}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-cyber-card border border-cyber-border hover:bg-cyber-red/10 hover:border-cyber-red/40 text-cyber-red transition-all cursor-pointer flex items-center justify-center shadow-sm"
            title="Disconnect Operator Session (Logout)"
          >
            <LogOut size={14} />
          </button>

          <div className="flex items-center gap-2 bg-cyber-green/5 border border-cyber-green/30 px-3 py-1.5 rounded-lg">
            <Award size={14} className="text-cyber-green" />
            <span className="font-mono text-xs text-cyber-green uppercase font-bold">LEVEL {state.level}</span>
          </div>
        </div>
      </header>

      {/* Main viewport area layout */}
      <div className="flex-1 flex z-10">
        
        {/* Sidebar Nav menu (Desktop and mobile drawers combined) */}
        <nav className={`
          fixed inset-y-0 left-0 top-[53px] z-30 w-64 bg-cyber-nav-bg border-r border-cyber-border p-4 space-y-2 transform transition-transform duration-300 md:relative md:transform-none md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="font-mono text-[11.5px] text-cyber-text-muted uppercase px-3 mb-4 tracking-widest font-bold">
            OPERATION CONTROL SYSTEMS
          </div>

          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between font-mono text-xs transition-all cursor-pointer ${
                  activeTab === item.id 
                    ? "bg-cyber-green/10 border border-cyber-green/30 text-cyber-text font-bold shadow-[0_0_15px_var(--cyber-shadow)]" 
                    : "text-cyber-text-muted hover:text-cyber-text hover:bg-cyber-border-muted border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={activeTab === item.id ? "text-cyber-green" : "text-cyber-text-muted"}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight size={12} className="text-cyber-green animate-pulse" />}
              </button>
            ))}
          </div>

          {/* Hacking logs footer metrics inside sidebar */}
          <div className="pt-8 mt-8 border-t border-cyber-border space-y-3 font-mono text-[11px] text-cyber-text-muted px-3 font-semibold">
            <div>
              <span>INTEGRITY MATRIX:</span>
              <span className="text-cyber-blue block font-bold">SECURE_DOCKER_V1</span>
            </div>
            <div>
              <span>CONNECTED SENSORS:</span>
              <span className="text-cyber-green block font-bold">9 NODES ALIVE</span>
            </div>
          </div>
        </nav>

        {/* Sidebar backdrop overlay on mobile */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-[53px] bg-black/60 backdrop-blur-sm z-20 md:hidden" 
          />
        )}

        {/* View contents wrapper */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "dashboard" && (
                <DashboardView state={state} addXP={addXP} setActiveTab={setActiveTab} />
              )}
              {activeTab === "pdf-vault" && (
                <PDFWorkspaceView state={state} addXP={addXP} />
              )}
              {activeTab === "terminal" && (
                <TerminalView 
                  commandsPracticedCount={state.commandsPracticedCount} 
                  incrementCommandsPracticed={incrementCommandsPracticed} 
                  addXP={addXP}
                />
              )}
              {activeTab === "labs" && (
                <LabsView 
                  completedLabs={state.completedLabs} 
                  completeLabInState={completeLabInState}
                  addXP={addXP}
                />
              )}
              {activeTab === "tryhackme" && (
                <TryHackMeView 
                  tryhackme={state.tryhackme} 
                  updateTryHackMeState={updateTryHackMeState}
                  addXP={addXP}
                />
              )}
              {activeTab === "projects" && (
                <ProjectWorkspaceView 
                  projects={state.projects} 
                  updateProjects={updateProjects}
                  addXP={addXP}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === "planner" && (
                <StudyPlannerView 
                  planner={state.planner} 
                  updatePlanner={updatePlanner}
                  addXP={addXP}
                  hoursStudied={state.hoursStudied}
                  updateHoursStudied={updateHoursStudied}
                />
              )}
              {activeTab === "progress" && (
                <ProgressView state={state} />
              )}
              {activeTab === "mentor" && (
                <AIMentorView addXP={addXP} />
              )}
              {activeTab === "achievements" && (
                <AchievementsView 
                  xp={state.xp} 
                  level={state.level} 
                  streak={state.streak} 
                  rank={state.rank} 
                  unlockedBadges={state.unlockedBadges}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating success notifications toasts layer */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none max-w-sm">
        <AnimatePresence>
          {activeToasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="bg-black/90 border border-cyber-green/50 shadow-[0_0_15px_rgba(0,255,102,0.15)] rounded-xl p-4 flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center text-cyber-green shrink-0">
                <Sparkles size={16} className="animate-spin-slow" />
              </div>
              <div>
                <p className="font-mono text-xs font-bold text-white">{toast.text}</p>
                <span className="font-mono text-[9px] text-cyber-green uppercase">SECURITY CREDIT MERGED</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fully animated high-tech level up overlay modal */}
      <AnimatePresence>
        {showLevelUpModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-cyber-card border-2 border-cyber-green/40 shadow-[0_0_35px_rgba(0,255,102,0.15)] rounded-2xl max-w-md w-full p-8 text-center space-y-6"
            >
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-cyber-green/10 border-2 border-cyber-green text-cyber-green shadow-[0_0_20px_rgba(0,255,102,0.2)]">
                <Award size={40} className="animate-pulse" />
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[10px] text-cyber-green tracking-widest uppercase block">CONGRATULATIONS OPERATOR</span>
                <h3 className="font-display text-2xl font-black text-cyber-text">CLEARANCE UPGRADED!</h3>
                <span className="font-mono text-sm text-cyber-blue block font-semibold">LEVEL {unlockedLevel} SUCCESSFULLY MET</span>
              </div>

              <p className="text-xs text-cyber-text-muted font-sans leading-relaxed max-w-xs mx-auto">
                You have merged continuous security lessons, defeated labs, and proved core command executions. Your rank is successfully updated.
              </p>

              <button
                onClick={() => setShowLevelUpModal(false)}
                className="px-6 py-2.5 bg-cyber-green/10 hover:bg-cyber-green/25 border border-cyber-green/40 text-cyber-green font-mono text-xs rounded-lg transition-all cursor-pointer"
              >
                PROCEED TO THE ARENA
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
