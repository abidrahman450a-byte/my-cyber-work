import React, { useState } from "react";
import { TryHackMeData } from "../types";
import { 
  Wifi, ShieldAlert, Award, Star, BookOpen, ExternalLink, 
  RefreshCw, User, CheckCircle, Zap, Activity 
} from "lucide-react";
import { motion } from "motion/react";

interface TryHackMeProps {
  tryhackme: TryHackMeData;
  updateTryHackMeState: (data: TryHackMeData) => void;
  addXP: (amount: number, reason: string) => void;
}

export const TryHackMeView: React.FC<TryHackMeProps> = ({ 
  tryhackme, 
  updateTryHackMeState,
  addXP 
}) => {
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const handleLinkAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setIsSyncing(true);

    // Simulate scraping / API query sequence
    setTimeout(() => {
      const mockSyncedData: TryHackMeData = {
        username: usernameInput,
        linked: true,
        rank: 15420,
        xp: 12450,
        streak: 15,
        completedRooms: [
          "Pre-Security Path", 
          "Web Hacking Fundamentals", 
          "Network Security", 
          "Nmap Deep Profile",
          "Burp Suite Part 1",
          "OWASP Top 10 Practice"
        ],
        inProgressRooms: [
          "Jr Penetration Tester Path", 
          "Wireshark packet forensic capture", 
          "Windows Privilege Escalation",
          "Active Directory Basics"
        ],
        badges: ["Script Explorer", "Network Ninja", "Bug Wrangler", "Streak Master", "Security Advocate"]
      };

      updateTryHackMeState(mockSyncedData);
      setIsSyncing(false);
      addXP(150, `Successfully synchronized TryHackMe profile for [${usernameInput}]`);
    }, 2000);
  };

  const handleUnlink = () => {
    updateTryHackMeState({
      username: "",
      linked: false,
      rank: 0,
      xp: 0,
      streak: 0,
      completedRooms: [],
      inProgressRooms: [],
      badges: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner section */}
      <div className="relative overflow-hidden rounded-xl border border-cyber-border bg-cyber-card p-6 shadow-sm">
        <div className="absolute right-0 top-0 h-32 w-32 bg-cyber-red/5 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-cyber-orange tracking-widest uppercase block font-bold">TRYHACKME INTEGRATION HUB</span>
            <h2 className="font-display text-2xl font-black text-cyber-text">GAMIFIED CYBER SECURITY TRAINING</h2>
            <p className="text-xs text-cyber-text-muted max-w-xl leading-relaxed">
              Synchronize your active TryHackMe profile with CyberOS. Retain badges, track continuous streak multipliers, and launch active laboratory modules directly on the THM learning framework.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyber-green animate-ping" />
            <span className="font-mono text-[10px] text-cyber-green uppercase font-bold">THM REST-API Online</span>
          </div>
        </div>
      </div>

      {/* Linking Account Portal vs Linked Profile view */}
      {!tryhackme.linked ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-cyber-card border border-cyber-border p-6 rounded-xl space-y-6 shadow-sm"
        >
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-cyber-orange/10 border border-cyber-orange/30 text-cyber-orange mb-2 shadow-inner">
              <Wifi size={24} className={isSyncing ? "animate-pulse" : ""} />
            </div>
            <h3 className="font-display text-lg font-bold text-cyber-text">Synchronize TryHackMe Operator Code</h3>
            <p className="text-xs text-cyber-text-muted max-w-sm mx-auto">
              Link your public profile using your THM username. This fetches level data, rankings, and path achievements instantly.
            </p>
          </div>

          <form onSubmit={handleLinkAccount} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-cyber-text-muted uppercase block font-semibold">TryHackMe Username</label>
              <input
                type="text"
                required
                placeholder="e.g. THM_CyberMaster"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                disabled={isSyncing}
                className="w-full bg-cyber-input-bg border border-cyber-border focus:border-cyber-orange/40 rounded-lg p-3 text-xs font-mono text-cyber-text outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSyncing}
              className="w-full py-2.5 bg-cyber-orange/15 hover:bg-cyber-orange/25 border border-cyber-orange/40 disabled:opacity-40 text-cyber-orange text-xs font-mono rounded cursor-pointer transition-all flex items-center justify-center gap-2 font-bold"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="animate-spin" size={14} /> SCANNING THM DATABASES...
                </>
              ) : (
                <>LINK PROFILE DATA</>
              )}
            </button>
          </form>

          <p className="font-mono text-[9px] text-cyber-text-muted text-center italic">
            *We do not request password or credentials. API queries retrieve only public security profiles.
          </p>
        </motion.div>
      ) : (
        /* Linked view - showing high level progress */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Linked Operator Overview Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* THM Username */}
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 relative overflow-hidden shadow-sm">
              <span className="font-mono text-[10px] text-cyber-text-muted block uppercase font-semibold">THM Operator</span>
              <span className="font-display text-lg font-bold text-cyber-text mt-1 block truncate">@{tryhackme.username}</span>
              <button 
                onClick={handleUnlink}
                className="mt-3 font-mono text-[10px] text-cyber-red hover:underline font-bold cursor-pointer"
              >
                Unlink Profile
              </button>
            </div>

            {/* THM Rank */}
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 relative overflow-hidden shadow-sm">
              <span className="font-mono text-[10px] text-cyber-text-muted block uppercase font-semibold">Global Rank</span>
              <span className="font-display text-2xl font-black text-cyber-orange mt-1 block">#{tryhackme.rank.toLocaleString()}</span>
              <span className="font-mono text-[10px] text-cyber-text-muted mt-2 block italic">Top 2% of Operators</span>
            </div>

            {/* Streak */}
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 relative overflow-hidden shadow-sm">
              <span className="font-mono text-[10px] text-cyber-text-muted block uppercase font-semibold">THM Daily Streak</span>
              <span className="font-display text-2xl font-black text-cyber-green mt-1 block">{tryhackme.streak} Days</span>
              <span className="font-mono text-[10px] text-cyber-text-muted mt-2 block italic">Continuous learning multiplier</span>
            </div>

            {/* Total XP */}
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 relative overflow-hidden shadow-sm">
              <span className="font-mono text-[10px] text-cyber-text-muted block uppercase font-semibold">TryHackMe XP</span>
              <span className="font-display text-2xl font-black text-cyber-blue mt-1 block">{tryhackme.xp.toLocaleString()} XP</span>
              <span className="font-mono text-[10px] text-cyber-text-muted mt-2 block italic">Synchronized successfully</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Rooms completed & In progress */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Completed Rooms list */}
              <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-cyber-green" size={16} />
                  <h3 className="font-display text-base font-bold text-cyber-text">Completed Labs & Rooms</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tryhackme.completedRooms.map((room, idx) => (
                    <div key={idx} className="bg-cyber-input-bg border border-cyber-border p-3 rounded-lg flex items-center justify-between">
                      <div className="font-mono text-xs text-cyber-text truncate pr-2 font-semibold">{room}</div>
                      <a 
                        href={`https://tryhackme.com/search?q=${encodeURIComponent(room)}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-cyber-green hover:text-cyber-text p-1"
                        title="Launch Room directly"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* In Progress Rooms */}
              <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="text-cyber-blue" size={16} />
                  <h3 className="font-display text-base font-bold text-cyber-text">Active Rooms in Progress</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tryhackme.inProgressRooms.map((room, idx) => (
                    <div key={idx} className="bg-cyber-input-bg border border-cyber-blue/30 p-3 rounded-lg flex items-center justify-between">
                      <div className="font-mono text-xs text-cyber-text truncate pr-2 font-bold">{room}</div>
                      <a 
                        href={`https://tryhackme.com/search?q=${encodeURIComponent(room)}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-cyber-blue hover:text-cyber-text p-1 flex items-center gap-1 font-mono text-[10px] font-bold"
                      >
                        <span>RESUME</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right column: Path Badges achievements */}
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 h-fit space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-cyber-border pb-3">
                <Award className="text-cyber-purple" size={16} />
                <h3 className="font-display text-base font-bold text-cyber-text">THM Badge Repository</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {tryhackme.badges.map((badge, idx) => (
                  <div key={idx} className="bg-cyber-input-bg border border-cyber-border p-2.5 rounded-lg flex flex-col items-center justify-center text-center space-y-1">
                    <Star className="text-cyber-purple fill-cyber-purple/10 animate-pulse" size={16} />
                    <span className="font-mono text-[10px] text-cyber-text leading-tight font-bold">{badge}</span>
                    <span className="font-mono text-[8px] text-cyber-text-muted uppercase">UNLOCKED</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </div>
  );
};
