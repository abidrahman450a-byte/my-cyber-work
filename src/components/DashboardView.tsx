import React from "react";
import { AppState } from "../types";
import { 
  Zap, Shield, Flame, Award, Clock, BookOpen, 
  Folder, CheckSquare, Target, Activity, Cpu, Calendar, ChevronRight 
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  state: AppState;
  addXP: (amount: number, reason: string) => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({ state, addXP, setActiveTab }) => {
  const currentLevelXPMax = state.level * 1000;
  const levelProgressPercentage = Math.min(100, Math.floor((state.xp / currentLevelXPMax) * 100));

  const totalCompletedLabs = state.completedLabs.length;
  const activeProject = state.projects[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Top Banner with Rank and Current Level */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-xl border border-cyber-green/30 bg-cyber-card p-6 md:p-8 shadow-sm"
      >
        <div className="absolute top-0 right-0 h-40 w-40 bg-cyber-green/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-cyber-blue/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div>
            <span className="font-mono text-xs text-cyber-green tracking-widest uppercase font-bold">System Initialization Complete</span>
            <h1 className="font-display text-2xl md:text-4xl font-extrabold text-cyber-text mt-1 tracking-tight">
              WELCOME BACK, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-cyber-blue">SEC-OPERATOR</span>
            </h1>
            <p className="font-mono text-xs text-cyber-text-muted mt-2 max-w-xl">
              Node ID: <span className="text-[#00ff66] font-semibold">cyber-os-node-2026</span> | Integrity: <span className="text-[#00e5ff] font-semibold">100% SECURE</span> | Network Authority: Local Shell Access
            </p>
          </div>

          <div className="flex items-center gap-4 bg-cyber-input-bg border border-cyber-border p-4 rounded-lg shadow-inner">
            <div className="relative flex items-center justify-center h-14 w-14 rounded-full border-2 border-cyber-green bg-cyber-green/5 shadow-[0_0_15px_rgba(0,255,102,0.15)]">
              <span className="font-display text-xl font-black text-cyber-green">{state.level}</span>
            </div>
            <div>
              <div className="font-mono text-[11.5px] text-cyber-text-muted uppercase tracking-wider font-semibold">Current Clearance</div>
              <div className="font-display text-lg font-bold text-cyber-text tracking-wide">{state.rank}</div>
              <div className="flex items-center gap-1 font-mono text-[11.5px] text-[#00ff66] font-bold">
                <Zap size={12} className="animate-pulse" /> {state.xp} / {currentLevelXPMax} XP
              </div>
            </div>
          </div>
        </div>

        {/* Level progress bar */}
        <div className="mt-6">
          <div className="flex justify-between font-mono text-[11px] text-cyber-text-muted mb-1.5 font-semibold tracking-wider">
            <span>LEVEL PROGRESS ({levelProgressPercentage}%)</span>
            <span>NEXT LEVEL RECRUIT CLASSIFICATION</span>
          </div>
          <div className="h-2 w-full bg-cyber-input-bg rounded-full overflow-hidden border border-cyber-border">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${levelProgressPercentage}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-cyber-green to-cyber-blue rounded-full shadow-[0_0_8px_rgba(0,255,102,0.5)]"
            />
          </div>
        </div>
      </motion.div>

      {/* Grid of Interactive Bento-style Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Study Streak */}
        <motion.div 
          variants={itemVariants}
          className="bg-cyber-card border border-cyber-orange/20 hover:border-cyber-orange/60 transition-all rounded-xl p-5 relative overflow-hidden shadow-sm"
          whileHover={{ y: -2 }}
        >
          <div className="absolute right-3 top-3 h-10 w-10 text-cyber-orange/10">
            <Flame className="w-10 h-10" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyber-orange/10 border border-cyber-orange/20 text-cyber-orange">
              <Flame size={20} className="animate-bounce" />
            </div>
            <div>
              <span className="font-mono text-[11.5px] text-cyber-text-muted block uppercase tracking-wider font-semibold">Study Streak</span>
              <span className="font-display text-2xl font-black text-cyber-orange">{state.streak} Days</span>
            </div>
          </div>
          <div className="mt-4 font-mono text-[11px] text-cyber-text-muted leading-relaxed">
            Keep practicing daily terminal commands to secure your chain multipliers!
          </div>
        </motion.div>

        {/* Labs Completed */}
        <motion.div 
          variants={itemVariants}
          className="bg-cyber-card border border-cyber-green/20 hover:border-cyber-green/60 transition-all rounded-xl p-5 relative overflow-hidden shadow-sm"
          whileHover={{ y: -2 }}
        >
          <div className="absolute right-3 top-3 h-10 w-10 text-cyber-green/10">
            <Shield className="w-10 h-10" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyber-green/10 border border-cyber-green/20 text-cyber-green">
              <Shield size={20} />
            </div>
            <div>
              <span className="font-mono text-[11.5px] text-cyber-text-muted block uppercase tracking-wider font-semibold">Labs Defeated</span>
              <span className="font-display text-2xl font-black text-cyber-green">{totalCompletedLabs} Completed</span>
            </div>
          </div>
          <div className="mt-4 font-mono text-[11px] text-cyber-text-muted flex items-center justify-between leading-relaxed">
            <span>Ready for training?</span>
            <button onClick={() => setActiveTab("labs")} className="text-cyber-green hover:underline cursor-pointer font-bold">Start Labs →</button>
          </div>
        </motion.div>

        {/* Commands practiced */}
        <motion.div 
          variants={itemVariants}
          className="bg-cyber-card border border-cyber-blue/20 hover:border-cyber-blue/60 transition-all rounded-xl p-5 relative overflow-hidden shadow-sm"
          whileHover={{ y: -2 }}
        >
          <div className="absolute right-3 top-3 h-10 w-10 text-cyber-blue/10">
            <Cpu className="w-10 h-10" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyber-blue/10 border border-cyber-blue/20 text-cyber-blue">
              <Cpu size={20} />
            </div>
            <div>
              <span className="font-mono text-[11.5px] text-cyber-text-muted block uppercase tracking-wider font-semibold">Shell Practice</span>
              <span className="font-display text-2xl font-black text-cyber-blue">{state.commandsPracticedCount} Cmds</span>
            </div>
          </div>
          <div className="mt-4 font-mono text-[11px] text-cyber-text-muted flex items-center justify-between leading-relaxed">
            <span>Terminal Sandbox active</span>
            <button onClick={() => setActiveTab("terminal")} className="text-cyber-blue hover:underline cursor-pointer font-bold">Launch Shell →</button>
          </div>
        </motion.div>

        {/* Study Hours */}
        <motion.div 
          variants={itemVariants}
          className="bg-cyber-card border border-cyber-purple/20 hover:border-cyber-purple/60 transition-all rounded-xl p-5 relative overflow-hidden shadow-sm"
          whileHover={{ y: -2 }}
        >
          <div className="absolute right-3 top-3 h-10 w-10 text-cyber-purple/10">
            <Clock className="w-10 h-10" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple">
              <Clock size={20} />
            </div>
            <div>
              <span className="font-mono text-[11.5px] text-cyber-text-muted block uppercase tracking-wider font-semibold">Time Invested</span>
              <span className="font-display text-2xl font-black text-[#a78bfa]">{state.hoursStudied} Hours</span>
            </div>
          </div>
          <div className="mt-4 font-mono text-[11px] text-cyber-text-muted leading-relaxed">
            Study logs synchronized automatically across active planner.
          </div>
        </motion.div>
      </div>

      {/* Two Columns: Goals progress vs Active Project overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Goals Progress Card */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 bg-cyber-card border border-cyber-border rounded-xl p-6 relative shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-cyber-green" size={18} />
            <h3 className="font-display text-base font-bold text-cyber-text">Study Targets & Goals</h3>
          </div>

          <div className="space-y-4">
            {/* Daily Goal */}
            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-cyber-text-muted">TODAY'S GOAL ({state.todayGoal} HOURS)</span>
                <span className="text-cyber-green font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 bg-cyber-input-bg rounded-full overflow-hidden border border-cyber-border">
                  <div className="h-full bg-cyber-green rounded-full" style={{ width: `${Math.min(100, (state.hoursStudied / 18.5) * 10)}%` }} />
                </div>
                <span className="font-mono text-xs text-cyber-green font-semibold">100%</span>
              </div>
            </div>

            {/* Weekly Goal */}
            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-cyber-text-muted">WEEKLY GOAL ({state.weeklyGoal} HOURS)</span>
                <span className="text-cyber-blue font-bold">123% COMPLETED</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 bg-cyber-input-bg rounded-full overflow-hidden border border-cyber-border">
                  <div className="h-full bg-cyber-blue rounded-full" style={{ width: "100%" }} />
                </div>
                <span className="font-mono text-xs text-cyber-blue font-semibold">18.5 / {state.weeklyGoal}h</span>
              </div>
            </div>

            {/* Monthly Goal */}
            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-cyber-text-muted">MONTHLY GOAL ({state.monthlyGoal} HOURS)</span>
                <span className="text-cyber-purple font-bold">30.8%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 bg-cyber-input-bg rounded-full overflow-hidden border border-cyber-border">
                  <div className="h-full bg-cyber-purple rounded-full" style={{ width: "30.8%" }} />
                </div>
                <span className="font-mono text-xs text-[#a78bfa] font-semibold">18.5 / {state.monthlyGoal}h</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-cyber-border pt-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyber-text-muted">Daily Study Streak Status</span>
              <span className="text-cyber-orange flex items-center gap-1 font-bold">
                <Flame size={12} /> SECURE
              </span>
            </div>
          </div>
        </motion.div>

        {/* Active Project Overview Card */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-7 bg-cyber-card border border-cyber-border rounded-xl p-6 relative flex flex-col justify-between shadow-sm"
        >
          {activeProject ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Folder className="text-cyber-blue" size={18} />
                    <h3 className="font-display text-base font-bold text-cyber-text">Active Core Project</h3>
                  </div>
                  <span className="font-mono text-[10px] bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 px-2 py-0.5 rounded font-bold">
                    ACTIVE MONITORING
                  </span>
                </div>

                <h4 className="font-display text-lg font-bold text-cyber-text">{activeProject.title}</h4>
                <p className="font-sans text-xs text-cyber-text-muted mt-1">{activeProject.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-cyber-input-bg border border-cyber-border rounded p-2.5">
                    <span className="font-mono text-[10px] text-cyber-text-muted block font-semibold uppercase">Stack & Tech</span>
                    <span className="font-mono text-xs text-cyber-text block truncate mt-0.5 font-bold">{activeProject.technology}</span>
                  </div>
                  <div className="bg-cyber-input-bg border border-cyber-border rounded p-2.5">
                    <span className="font-mono text-[10px] text-cyber-text-muted block font-semibold uppercase">Repository Link</span>
                    <span className="font-mono text-xs text-cyber-blue block truncate mt-0.5 font-bold hover:underline cursor-pointer">{activeProject.githubRepo}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between font-mono text-[10px] text-cyber-text-muted mb-1">
                    <span>BUILD COMPLETION PROGRESS</span>
                    <span className="text-cyber-blue font-bold">{activeProject.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-cyber-input-bg rounded-full overflow-hidden border border-cyber-border">
                    <div className="h-full bg-cyber-blue" style={{ width: `${activeProject.progress}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-cyber-border pt-4 flex items-center justify-between">
                <span className="font-mono text-[10px] text-cyber-text-muted">
                  Tasks: <span className="text-cyber-green font-bold">{activeProject.tasks.filter(t => t.status === "completed").length}</span> / <span className="text-cyber-text font-semibold">{activeProject.tasks.length}</span> Done
                </span>
                <button 
                  onClick={() => setActiveTab("projects")} 
                  className="font-mono text-xs text-cyber-blue hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  Configure Kanban Board <ChevronRight size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <Folder className="text-cyber-text-muted mb-2" size={32} />
              <p className="font-mono text-xs text-cyber-text-muted">No active projects loaded.</p>
              <button 
                onClick={() => setActiveTab("projects")} 
                className="mt-4 px-4 py-2 bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30 rounded font-mono text-xs cursor-pointer font-bold"
              >
                Launch Project Workspace
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Cyber System Diagnostic Footer Section */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-cyber-border bg-cyber-input-bg rounded-xl p-4 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Activity size={16} className="text-cyber-green animate-pulse" />
          <div className="font-mono text-[10px]">
            <span className="text-cyber-text-muted block font-semibold">COGNITIVE SENSOR MATRIX</span>
            <span className="text-cyber-text font-bold">SPECTRE AI Engine Online</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-cyber-blue" />
          <div className="font-mono text-[10px]">
            <span className="text-cyber-text-muted block font-semibold">CURRENT SESSION TIME</span>
            <span className="text-cyber-text font-bold">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Award size={16} className="text-cyber-purple" />
          <div className="font-mono text-[10px]">
            <span className="text-cyber-text-muted block font-semibold">CYBER BADGES UNLOCKED</span>
            <span className="text-cyber-text font-bold">{state.unlockedBadges.length} Achieved</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
