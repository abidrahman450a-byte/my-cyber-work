import React, { useState } from "react";
import { Project, Task, Bug, Milestone, DailyLog } from "../types";
import { 
  Folder, Plus, Trash, CheckSquare, Bug as BugIcon, 
  BookOpen, Terminal, Sparkles, AlertTriangle, ShieldCheck, 
  ExternalLink, Github, Calendar, Activity, Cpu 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectWorkspaceProps {
  projects: Project[];
  updateProjects: (projects: Project[]) => void;
  addXP: (amount: number, reason: string) => void;
  setActiveTab: (tab: string) => void;
}

export const ProjectWorkspaceView: React.FC<ProjectWorkspaceProps> = ({ 
  projects, 
  updateProjects,
  addXP,
  setActiveTab
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");
  const [activeSubTab, setActiveSubTab] = useState<"kanban" | "milestones" | "bugs" | "logs">("kanban");
  
  // Input states
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [newBugText, setNewBugText] = useState<string>("");
  const [newBugSeverity, setNewBugSeverity] = useState<"low" | "medium" | "high">("medium");
  const [newLogText, setNewLogText] = useState<string>("");
  const [newMilestoneText, setNewMilestoneText] = useState<string>("");

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const triggerProjectSave = (updated: Project) => {
    // Recalculate total progress percentage based on completed milestones
    const totalMilestones = updated.milestones.length;
    const completedMilestones = updated.milestones.filter(m => m.done).length;
    updated.progress = totalMilestones > 0 ? Math.floor((completedMilestones / totalMilestones) * 100) : 0;

    const nextProjects = projects.map(p => p.id === updated.id ? updated : p);
    updateProjects(nextProjects);
  };

  // Kanban tasks modifier
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || !activeProject) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      text: newTaskText,
      status: "todo"
    };

    const updatedProject = {
      ...activeProject,
      tasks: [...activeProject.tasks, newTask]
    };

    triggerProjectSave(updatedProject);
    setNewTaskText("");
    addXP(15, `Logged new developer task: ${newTask.text}`);
  };

  const moveTask = (taskId: string, newStatus: "todo" | "in-progress" | "completed") => {
    if (!activeProject) return;
    
    const updatedTasks = activeProject.tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );

    const updatedProject = {
      ...activeProject,
      tasks: updatedTasks
    };

    triggerProjectSave(updatedProject);
    if (newStatus === "completed") {
      addXP(20, "Secured progress by completing core project task!");
    }
  };

  const deleteTask = (taskId: string) => {
    if (!activeProject) return;
    const updatedTasks = activeProject.tasks.filter(t => t.id !== taskId);
    triggerProjectSave({ ...activeProject, tasks: updatedTasks });
  };

  // Milestones modifier
  const addMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneText.trim() || !activeProject) return;

    const newM: Milestone = {
      id: `m-${Date.now()}`,
      title: newMilestoneText,
      done: false
    };

    const updatedProject = {
      ...activeProject,
      milestones: [...activeProject.milestones, newM]
    };

    triggerProjectSave(updatedProject);
    setNewMilestoneText("");
  };

  const toggleMilestone = (mId: string) => {
    if (!activeProject) return;
    const updatedMilestones = activeProject.milestones.map(m => 
      m.id === mId ? { ...m, done: !m.done } : m
    );

    const updatedProject = {
      ...activeProject,
      milestones: updatedMilestones
    };

    triggerProjectSave(updatedProject);
    const m = updatedMilestones.find(mil => mil.id === mId);
    if (m?.done) {
      addXP(40, `Achieved project milestone: ${m.title}`);
    }
  };

  // Bug reporting
  const addBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBugText.trim() || !activeProject) return;

    const newB: Bug = {
      id: `BUG-${100 + activeProject.bugs.length}`,
      text: newBugText,
      severity: newBugSeverity,
      status: "open"
    };

    const updatedProject = {
      ...activeProject,
      bugs: [...activeProject.bugs, newB]
    };

    triggerProjectSave(updatedProject);
    setNewBugText("");
    addXP(10, `Discovered and filed exploit bug: ${newB.id}`);
  };

  const toggleResolveBug = (bugId: string) => {
    if (!activeProject) return;
    const updatedBugs = activeProject.bugs.map(b => {
      if (b.id === bugId) {
        const nextStatus = b.status === "resolved" ? "open" : "resolved";
        return { ...b, status: nextStatus as any };
      }
      return b;
    });

    triggerProjectSave({ ...activeProject, bugs: updatedBugs });
    const targetBug = updatedBugs.find(b => b.id === bugId);
    if (targetBug?.status === "resolved") {
      addXP(50, `Patched security bug loop: ${targetBug.id}`);
    }
  };

  // Daily logs
  const addLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim() || !activeProject) return;

    const newLog: DailyLog = {
      date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      note: newLogText
    };

    const updatedProject = {
      ...activeProject,
      dailyLogs: [newLog, ...activeProject.dailyLogs]
    };

    triggerProjectSave(updatedProject);
    setNewLogText("");
    addXP(30, "Archived daily operator logs writeup");
  };

  // Calculate project metrics
  const getHealthMetrics = () => {
    if (!activeProject) return { score: 100, label: "SECURE", color: "text-cyber-green" };
    
    // Each unresolved bug decreases health. High: -25%, Med: -15%, Low: -5%
    let penalty = 0;
    activeProject.bugs.forEach(bug => {
      if (bug.status === "unresolved") {
        if (bug.severity === "high") penalty += 25;
        else if (bug.severity === "medium") penalty += 15;
        else penalty += 5;
      }
    });

    const score = Math.max(0, 100 - penalty);
    if (score >= 90) return { score, label: "SECURE & RIGID", color: "text-cyber-green" };
    if (score >= 70) return { score, label: "DEGRADED BUFFER", color: "text-cyber-orange" };
    return { score, label: "CRITICAL VULNERABILITY", color: "text-cyber-red" };
  };

  const health = getHealthMetrics();

  return (
    <div className="space-y-6">
      {activeProject ? (
        <>
          {/* Top Project Dashboard Card */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden shadow-sm">
            <div className="absolute right-0 top-0 h-32 w-32 bg-cyber-blue/5 blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Folder className="text-cyber-blue" size={20} />
                  <span className="font-mono text-xs text-cyber-text-muted font-bold">PROJECT CORE MONITOR</span>
                </div>
                <h2 className="font-display text-2xl font-black text-cyber-text">{activeProject.title}</h2>
                <p className="text-xs text-cyber-text-muted max-w-2xl leading-relaxed">{activeProject.description}</p>
                
                <div className="flex flex-wrap gap-4 pt-2 text-[11px] font-mono">
                  <span className="text-cyber-text-muted">STACK: <span className="text-cyber-text font-bold">{activeProject.technology}</span></span>
                  <span className="text-cyber-text-muted">REPO: <a href={`https://${activeProject.githubRepo}`} target="_blank" rel="noreferrer" className="text-cyber-blue hover:underline inline-flex items-center gap-0.5 font-bold"><Github size={10} /> {activeProject.githubRepo}</a></span>
                  <span className="text-cyber-text-muted">LOCAL GATEWAY: <span className="text-cyber-green font-bold">{activeProject.demoUrl}</span></span>
                </div>
              </div>

              {/* Progress and Health gages */}
              <div className="flex flex-col sm:flex-row gap-6 bg-cyber-input-bg border border-cyber-border p-4 rounded-xl min-w-[240px]">
                <div className="flex-1 text-center">
                  <span className="font-mono text-[10px] text-cyber-text-muted uppercase font-bold">Build Progress</span>
                  <div className="font-display text-2xl font-black text-cyber-blue mt-1">{activeProject.progress}%</div>
                  <div className="h-1.5 w-16 bg-cyber-card border border-cyber-border rounded-full mx-auto mt-2 overflow-hidden">
                    <div className="h-full bg-cyber-blue animate-pulse" style={{ width: `${activeProject.progress}%` }} />
                  </div>
                </div>

                <div className="w-px bg-cyber-border hidden sm:block" />

                <div className="flex-1 text-center">
                  <span className="font-mono text-[10px] text-cyber-text-muted uppercase font-bold">System Health</span>
                  <div className={`font-display text-2xl font-black ${health.color} mt-1`}>{health.score}%</div>
                  <span className={`font-mono text-[9px] uppercase font-black ${health.color}`}>{health.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Advisor widget and shell trigger */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* AI Advisor */}
            <div className="md:col-span-8 bg-cyber-input-bg border border-cyber-border rounded-xl p-4 flex items-start gap-3.5 shadow-sm">
              <div className="p-2 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple shrink-0">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-cyber-purple uppercase block font-bold">SPECTRE AI Core Suggestions</span>
                <p className="text-xs text-cyber-text-muted">
                  {health.score < 90 ? (
                    <span>Warning: System health degraded due to unresolved security bug. Re-verify Scapy network capture buffers. Integrate defensive ring bounds in Python exploits.</span>
                  ) : (
                    <span>Project health is outstanding. To optimize intrusion alerts, prepare your Express WebSocket telemetry layer. Test credentials logs using 'python3 ssh_bruter.py' in Terminal.</span>
                  )}
                </p>
              </div>
            </div>

            {/* Launch shell helper */}
            <div 
              onClick={() => setActiveTab("terminal")}
              className="md:col-span-4 bg-cyber-card hover:bg-cyber-input-bg border border-cyber-green/20 hover:border-cyber-green/60 transition-all rounded-xl p-4 flex items-center justify-between cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyber-green/10 text-cyber-green">
                  <Terminal size={18} />
                </div>
                <div>
                  <span className="font-mono text-xs text-cyber-text block font-bold">SANDBOX TERMINAL</span>
                  <span className="font-mono text-[9px] text-cyber-text-muted block font-semibold">Deploy project scripts</span>
                </div>
              </div>
              <span className="text-cyber-green font-bold">→</span>
            </div>

          </div>

          {/* Navigation sub-tabs for Workspace modules */}
          <div className="border-b border-cyber-border flex items-center gap-2 overflow-x-auto">
            {(["kanban", "milestones", "bugs", "logs"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider relative cursor-pointer ${
                  activeSubTab === tab ? "text-cyber-blue" : "text-cyber-text-muted hover:text-cyber-text"
                }`}
              >
                <span>{tab === "logs" ? "Daily log logs" : tab}</span>
                {activeSubTab === tab && (
                  <motion.div 
                    layoutId="subTabBorder"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-blue shadow-[0_0_8px_rgba(0,229,255,0.5)]" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Sub-tab viewport panels */}
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              
              {/* KANBAN BOARD */}
              {activeSubTab === "kanban" && (
                <motion.div
                  key="kanban"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-6"
                >
                  {/* Task creation field */}
                  <form onSubmit={addTask} className="flex gap-2 max-w-lg bg-cyber-card border border-cyber-border p-2 rounded-lg shadow-sm">
                    <input
                      type="text"
                      required
                      placeholder="Add task to board... (e.g. Write firewall rule script)"
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-cyber-text pl-2"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-cyber-blue/15 hover:bg-cyber-blue/25 border border-cyber-blue/40 text-cyber-blue text-xs font-mono rounded cursor-pointer font-bold"
                    >
                      ADD TASK
                    </button>
                  </form>

                  {/* 3 Columns grids */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* TODO COLUMN */}
                    <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center border-b border-cyber-border pb-2">
                        <span className="font-mono text-xs text-cyber-text-muted font-bold uppercase">To-Do Queue</span>
                        <span className="font-mono text-[10px] bg-cyber-input-bg text-cyber-text-muted border border-cyber-border px-1.5 py-0.5 rounded font-bold">{activeProject.tasks.filter(t => t.status === "todo").length}</span>
                      </div>
                      <div className="space-y-2">
                        {activeProject.tasks.filter(t => t.status === "todo").map(task => (
                          <div key={task.id} className="bg-cyber-input-bg border border-cyber-border p-3 rounded-lg flex items-center justify-between group">
                            <span className="font-mono text-xs text-cyber-text font-semibold">{task.text}</span>
                            <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => moveTask(task.id, "in-progress")} 
                                className="text-[10px] font-mono text-cyber-blue hover:underline cursor-pointer font-bold"
                              >
                                START
                              </button>
                              <button onClick={() => deleteTask(task.id)} className="text-cyber-red p-0.5 cursor-pointer"><Trash size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* IN PROGRESS COLUMN */}
                    <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center border-b border-cyber-border pb-2">
                        <span className="font-mono text-xs text-cyber-blue font-bold uppercase">In Execution</span>
                        <span className="font-mono text-[10px] bg-cyber-blue/10 text-cyber-blue px-1.5 py-0.5 rounded font-bold">{activeProject.tasks.filter(t => t.status === "in-progress").length}</span>
                      </div>
                      <div className="space-y-2">
                        {activeProject.tasks.filter(t => t.status === "in-progress").map(task => (
                          <div key={task.id} className="bg-cyber-input-bg border border-cyber-blue/20 p-3 rounded-lg flex items-center justify-between group">
                            <span className="font-mono text-xs text-cyber-text font-bold">{task.text}</span>
                            <div className="flex gap-1.5">
                              <button 
                                onClick={() => moveTask(task.id, "completed")} 
                                className="text-[10px] font-mono text-cyber-green hover:underline cursor-pointer font-bold"
                              >
                                COMPLETED
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* COMPLETED COLUMN */}
                    <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center border-b border-cyber-border pb-2">
                        <span className="font-mono text-xs text-cyber-green font-bold uppercase">Merged / Verified</span>
                        <span className="font-mono text-[10px] bg-cyber-green/10 text-cyber-green px-1.5 py-0.5 rounded font-bold">{activeProject.tasks.filter(t => t.status === "completed").length}</span>
                      </div>
                      <div className="space-y-2">
                        {activeProject.tasks.filter(t => t.status === "completed").map(task => (
                          <div key={task.id} className="bg-cyber-input-bg border border-cyber-green/20 p-3 rounded-lg flex items-center justify-between group">
                            <span className="font-mono text-xs text-cyber-text-muted line-through">{task.text}</span>
                            <button onClick={() => deleteTask(task.id)} className="text-cyber-red opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Trash size={12} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ROADMAP MILESTONES */}
              {activeSubTab === "milestones" && (
                <motion.div
                  key="milestones"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 max-w-xl"
                >
                  <form onSubmit={addMilestone} className="flex gap-2 bg-cyber-card border border-cyber-border p-2 rounded-lg shadow-sm">
                    <input
                      type="text"
                      required
                      placeholder="Add milestone roadmap goal..."
                      value={newMilestoneText}
                      onChange={(e) => setNewMilestoneText(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-cyber-text pl-2"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-cyber-blue/15 hover:bg-cyber-blue/25 border border-cyber-blue/40 text-cyber-blue text-xs font-mono rounded cursor-pointer font-bold"
                    >
                      ADD ROADMAP
                    </button>
                  </form>

                  <div className="space-y-2 bg-cyber-card border border-cyber-border p-4 rounded-xl shadow-sm">
                    {activeProject.milestones.map(m => (
                      <div 
                        key={m.id} 
                        onClick={() => toggleMilestone(m.id)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                          m.done 
                            ? "bg-cyber-green/5 border-cyber-green/20 text-cyber-green" 
                            : "bg-cyber-input-bg border-cyber-border text-cyber-text hover:border-cyber-text-muted"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CheckSquare size={16} className={m.done ? "text-cyber-green" : "text-cyber-text-muted"} />
                          <span className="font-mono text-xs font-bold">{m.title}</span>
                        </div>
                        <span className="font-mono text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-cyber-card border border-cyber-border">
                          {m.done ? "VERIFIED COMPLETED" : "INCOMPLETE"}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* BUG TRACKER */}
              {activeSubTab === "bugs" && (
                <motion.div
                  key="bugs"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <form onSubmit={addBug} className="flex flex-wrap gap-2 bg-cyber-card border border-cyber-border p-3 rounded-lg items-center justify-between shadow-sm">
                    <input
                      type="text"
                      required
                      placeholder="Log new exploit or codebase error... (e.g. SSH Auth timeout handling fail)"
                      value={newBugText}
                      onChange={(e) => setNewBugText(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-cyber-text min-w-[260px] pl-2"
                    />
                    
                    <div className="flex items-center gap-3">
                      <select 
                        value={newBugSeverity}
                        onChange={(e) => setNewBugSeverity(e.target.value as any)}
                        className="bg-cyber-input-bg border border-cyber-border text-xs font-mono text-cyber-text rounded p-1.5 outline-none font-bold"
                      >
                        <option value="low">LOW SEVERITY</option>
                        <option value="medium">MEDIUM SEVERITY</option>
                        <option value="high">HIGH SEVERITY</option>
                      </select>
                      
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-cyber-red/10 hover:bg-cyber-red/20 border border-cyber-red/40 text-cyber-red text-xs font-mono rounded cursor-pointer transition-all font-bold"
                      >
                        REPORT BUG
                      </button>
                    </div>
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeProject.bugs.map(bug => (
                      <div 
                        key={bug.id} 
                        className={`p-4 rounded-xl border flex flex-col justify-between shadow-sm ${
                          bug.status === "resolved"
                            ? "bg-cyber-green/5 border-cyber-green/20 opacity-70"
                            : "bg-cyber-card border-cyber-border"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-cyber-input-bg border border-cyber-border text-cyber-text-muted font-bold">
                              ID: {bug.id}
                            </span>
                            
                            <span className={`font-mono text-[9px] uppercase font-black ${
                              bug.severity === "high" ? "text-cyber-red" :
                              bug.severity === "medium" ? "text-cyber-orange" : "text-cyber-blue"
                            }`}>
                              {bug.severity} Severity
                            </span>
                          </div>
                          
                          <p className={`font-mono text-xs font-semibold ${bug.status === "resolved" ? "line-through text-cyber-text-muted" : "text-cyber-text"}`}>
                            {bug.text}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-cyber-border flex justify-between items-center">
                          <span className={`font-mono text-[9px] uppercase font-black ${bug.status === "resolved" ? "text-cyber-green" : "text-cyber-orange"}`}>
                            STATUS: {bug.status}
                          </span>
                          
                          <button
                            onClick={() => toggleResolveBug(bug.id)}
                            className={`px-2.5 py-1 text-[10px] font-mono border rounded cursor-pointer transition-all font-bold ${
                              bug.status === "resolved"
                                ? "border-cyber-border text-cyber-text-muted hover:border-cyber-text-muted"
                                : "border-cyber-green/40 text-cyber-green hover:bg-cyber-green/10"
                            }`}
                          >
                            {bug.status === "resolved" ? "RE-OPEN BUG" : "RESOLVE & PATCH"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* DAILY LOG WRITEUPS */}
              {activeSubTab === "logs" && (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 max-w-xl"
                >
                  <form onSubmit={addLog} className="space-y-2 bg-cyber-card border border-cyber-border p-4 rounded-xl shadow-sm">
                    <label className="font-mono text-xs text-cyber-text-muted uppercase block font-semibold">Add today's security lab log / developer notes:</label>
                    <textarea
                      required
                      placeholder="e.g. Successfully patched SSH dictionary loops. Improved multi-threaded connections bounds..."
                      value={newLogText}
                      onChange={(e) => setNewLogText(e.target.value)}
                      className="w-full h-20 bg-cyber-input-bg border border-cyber-border focus:border-cyber-blue/40 rounded-lg p-3 text-xs font-mono text-cyber-text outline-none resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-cyber-blue/15 hover:bg-cyber-blue/25 border border-cyber-blue/40 text-cyber-blue text-xs font-mono rounded cursor-pointer font-bold"
                      >
                        LOG ENTRY
                      </button>
                    </div>
                  </form>

                  <div className="space-y-4">
                    {activeProject.dailyLogs.map((log, idx) => (
                      <div key={idx} className="bg-cyber-card border border-cyber-border p-4 rounded-xl relative shadow-sm">
                        <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-cyber-blue font-bold">
                          <Calendar size={12} />
                          <span>{log.date}</span>
                        </div>
                        <p className="font-mono text-xs text-cyber-text-muted leading-relaxed">
                          {log.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </>
      ) : (
        <div className="text-center p-12 bg-cyber-card border border-cyber-border rounded-xl">
          <Folder className="text-cyber-text-muted mx-auto mb-2" size={40} />
          <p className="font-mono text-xs text-cyber-text-muted">No projects loaded. Launch system restart or load config.</p>
        </div>
      )}
    </div>
  );
};
