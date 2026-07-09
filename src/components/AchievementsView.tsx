import React from "react";
import { 
  Award, Star, Zap, Flame, ShieldAlert, 
  Terminal, ShieldCheck, CheckCircle 
} from "lucide-react";
import { motion } from "motion/react";

interface AchievementsViewProps {
  xp: number;
  level: number;
  streak: number;
  rank: string;
  unlockedBadges: string[];
}

interface BadgeDetails {
  id: string;
  title: string;
  description: string;
  requirement: string;
  xpReward: number;
  icon: React.ReactNode;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  xp,
  level,
  streak,
  rank,
  unlockedBadges
}) => {
  
  const ALL_BADGES: BadgeDetails[] = [
    {
      id: "First Steps",
      title: "First Steps Initiated",
      description: "Successfully spawned the CyberOS kernel node and initialized learning metrics.",
      requirement: "Granted on system boot up.",
      xpReward: 100,
      icon: <CheckCircle className="text-cyber-green" size={20} />
    },
    {
      id: "Command Line Jockey",
      title: "Command Line Jockey",
      description: "Practiced file system traversal and text grep utilities inside the terminal.",
      requirement: "Type multiple commands in the Linux Terminal Simulator.",
      xpReward: 150,
      icon: <Terminal className="text-cyber-blue" size={20} />
    },
    {
      id: "Nmap Infiltrator",
      title: "Nmap Infiltrator",
      description: "Configured SYN stealth versions and aggression ports profiling targeting subnets.",
      requirement: "Complete the Nmap Host Discovery Lab Quiz.",
      xpReward: 200,
      icon: <Star className="text-cyber-purple" size={20} />
    },
    {
      id: "SQLi Buster",
      title: "SQLi Bypass Architect",
      description: "Successfully bypassed login authentications using quote parameter injections.",
      requirement: "Achieve 100% correct answers on Web SQLi Lab Quiz.",
      xpReward: 250,
      icon: <ShieldAlert className="text-cyber-orange" size={20} />
    },
    {
      id: "Buffer Defeater",
      title: "Buffer Overflow Defeater",
      description: "Discovered stack corruption mechanics and implemented DEP/ASLR canaries mitigations.",
      requirement: "Read Buffer Overflow specifications and consult SPECTRE AI Mentor.",
      xpReward: 300,
      icon: <Award className="text-cyber-red" size={20} />
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Level Clearance Certificate */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden text-center max-w-xl mx-auto shadow-sm">
        <div className="absolute right-0 top-0 h-24 w-24 bg-cyber-purple/5 blur-xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 h-24 w-24 bg-cyber-green/5 blur-xl pointer-events-none" />

        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple mb-4 shadow-[0_0_20px_rgba(139,92,246,0.15)] animate-pulse">
          <Award size={32} />
        </div>

        <span className="font-mono text-[9px] text-cyber-purple tracking-widest uppercase block mb-1 font-bold">
          CERTIFICATE OF CLEARANCE AUTHORITY
        </span>
        
        <h2 className="font-display text-2xl font-black text-cyber-text">{rank}</h2>
        <div className="font-mono text-xs text-cyber-green font-bold mt-1">OPERATOR CLASSIFICATION LEVEL {level}</div>

        <div className="mt-6 flex justify-around border-t border-cyber-border pt-4 text-center font-mono">
          <div>
            <span className="text-[10px] text-cyber-text-muted uppercase block font-semibold">Total XP</span>
            <span className="text-sm font-black text-cyber-text flex items-center justify-center gap-1 mt-0.5">
              <Zap size={12} className="text-cyber-green" /> {xp}
            </span>
          </div>

          <div className="w-px bg-cyber-border" />

          <div>
            <span className="text-[10px] text-cyber-text-muted uppercase block font-semibold">Active Badges</span>
            <span className="text-sm font-black text-[#a78bfa] flex items-center justify-center gap-1 mt-0.5">
              <Award size={12} className="text-cyber-purple" /> {unlockedBadges.length} / {ALL_BADGES.length}
            </span>
          </div>

          <div className="w-px bg-cyber-border" />

          <div>
            <span className="text-[10px] text-cyber-text-muted uppercase block font-semibold">Daily Streak</span>
            <span className="text-sm font-black text-cyber-orange flex items-center justify-center gap-1 mt-0.5">
              <Flame size={12} className="text-cyber-orange" /> {streak} Days
            </span>
          </div>
        </div>
      </div>

      {/* Badges shelves list */}
      <div className="space-y-4">
        <div className="border-b border-cyber-border pb-2">
          <h3 className="font-display text-base font-bold text-cyber-text">Security Badge Achievements</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_BADGES.map(badge => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={`bg-cyber-card border rounded-xl p-5 flex flex-col justify-between transition-all duration-300 shadow-sm ${
                  isUnlocked 
                    ? "border-cyber-green/40 shadow-[0_0_15px_var(--cyber-shadow)]" 
                    : "border-cyber-border opacity-50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-cyber-input-bg border ${isUnlocked ? "border-cyber-green/20" : "border-cyber-border"}`}>
                      {badge.icon}
                    </div>
                    
                    <span className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      isUnlocked ? "bg-cyber-green/10 text-cyber-green" : "bg-cyber-input-bg text-cyber-text-muted border border-cyber-border"
                    }`}>
                      {isUnlocked ? "ACHIEVED" : "SECURED LEVEL LOCK"}
                    </span>
                  </div>

                  <h4 className="font-display text-base font-bold text-cyber-text mb-1">{badge.title}</h4>
                  <p className="font-sans text-xs text-cyber-text-muted leading-normal">{badge.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-cyber-border flex flex-col gap-1.5 text-[10px] font-mono">
                  <div className="text-cyber-text-muted">
                    REQ: <span className="text-cyber-text font-semibold">{badge.requirement}</span>
                  </div>
                  <div className="text-cyber-green flex items-center gap-1 mt-1 font-bold">
                    <Zap size={10} /> +{badge.xpReward} XP Reward Claimed
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
