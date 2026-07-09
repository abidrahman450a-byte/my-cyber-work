import React, { useState } from "react";
import { AppState } from "../types";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, 
  YAxis, Tooltip, CartesianGrid, BarChart, Bar 
} from "recharts";
import { 
  TrendingUp, Calendar, FileText, Download, Award, 
  Zap, Shield, Cpu, Activity, Info 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProgressProps {
  state: AppState;
}

export const ProgressView: React.FC<ProgressProps> = ({ state }) => {
  const [activeReportRange, setActiveReportRange] = useState<"weekly" | "monthly">("weekly");
  const [reportLog, setReportLog] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Recharts fake productivity dataset
  const productivityData = [
    { day: "Mon", hours: 1.5, commands: 12 },
    { day: "Tue", hours: 2.2, commands: 25 },
    { day: "Wed", hours: 3.1, commands: 34 },
    { day: "Thu", hours: 1.8, commands: 15 },
    { day: "Fri", hours: 4.0, commands: 48 },
    { day: "Sat", hours: 5.2, commands: 60 },
    { day: "Sun", hours: 2.5, commands: 20 }
  ];

  // Map 30-day simulated activity heatmap matrix cubes
  const heatmapCubes = Array.from({ length: 35 }).map((_, idx) => {
    const intensity = idx % 5 === 0 ? 0 : idx % 3 === 0 ? 3 : idx % 2 === 0 ? 1 : 2;
    const dateNum = 8 - (34 - idx);
    const dateLabel = dateNum <= 0 ? `2026-06-${30 + dateNum}` : `2026-07-0${dateNum}`;
    return { dateLabel, intensity };
  });

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedLog = `======================================================================
                 CYBEROS SEC-OPERATOR PROGRESS REPORT
======================================================================
REPORT TIMESTAMP      : 2026-07-08 02:50 UTC
CLASSIFICATION RANGE  : ${activeReportRange === "weekly" ? "7-DAY WEEKLY AUDIT" : "30-DAY MONTHLY AUDIT"}
OPERATOR CLEARANCE   : ${state.rank}
OPERATOR LEVEL        : LEVEL ${state.level}
TOTAL CORE XP SECURED : ${state.xp} XP
======================================================================

1. PERFORMANCE METRICS DUMP
----------------------------------------------------------------------
  - Active Hours Investigated : ${state.hoursStudied} Hours
  - Commands Executed / Tested: ${state.commandsPracticedCount} Commands
  - Cyber Labs Completed       : ${state.completedLabs.length} Defeated Labs
  - Completed Core Projects   : ${state.projects.length} Active Builds
  - Active Training Badges     : ${state.unlockedBadges.join(", ")}

2. SPECTRE AI SECURITY HEALTH CONSTRAINTS AUDIT
----------------------------------------------------------------------
  - Overall Performance Trend: OUTSTANDING (Learning Curve: +15.3%)
  - Cognitive Alert Logs    : Stabilized on terminal command history.
  - Vulnerability Remediation: All Union-based SQL exploits patched in
    Project Workspace sandbox environment.
  - Audit Recommendation     : Initiate Hard-difficulty Metasploit Lab
    and finalize Python network sockets automation scripts.

----------------------------------------------------------------------
[INTEGRITY LOCK SIGNED] BY SPECTRE_AI_INTEL_SYSTEMS_2026
======================================================================`;
      setReportLog(generatedLog);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top statistics summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Study Hours */}
        <div className="bg-cyber-card border border-cyber-border p-4 rounded-xl text-center shadow-sm">
          <span className="font-mono text-[10px] text-cyber-text-muted block uppercase font-bold">Total Hours studied</span>
          <span className="font-display text-2xl font-black text-cyber-text mt-1 block">{state.hoursStudied} hrs</span>
        </div>

        {/* Commands practiced */}
        <div className="bg-cyber-card border border-cyber-border p-4 rounded-xl text-center shadow-sm">
          <span className="font-mono text-[10px] text-cyber-text-muted block uppercase font-bold">Commands practiced</span>
          <span className="font-display text-2xl font-black text-cyber-text mt-1 block">{state.commandsPracticedCount}</span>
        </div>

        {/* Completed Labs */}
        <div className="bg-cyber-card border border-cyber-border p-4 rounded-xl text-center shadow-sm">
          <span className="font-mono text-[10px] text-cyber-text-muted block uppercase font-bold">Completed Labs</span>
          <span className="font-display text-2xl font-black text-cyber-text mt-1 block">{state.completedLabs.length} / 9</span>
        </div>

        {/* Current XP */}
        <div className="bg-cyber-card border border-cyber-border p-4 rounded-xl text-center shadow-sm">
          <span className="font-mono text-[10px] text-cyber-text-muted block uppercase font-bold">Active System XP</span>
          <span className="font-display text-2xl font-black text-cyber-green mt-1 block">{state.xp} XP</span>
        </div>
      </div>

      {/* Grid of Chart vs Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Area productivity chart */}
        <div className="lg:col-span-7 bg-cyber-card border border-cyber-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-cyber-border pb-3">
            <h3 className="font-display text-base font-bold text-cyber-text flex items-center gap-2">
              <TrendingUp className="text-cyber-green" size={16} />
              Productivity Learning Curve (Weekly)
            </h3>
            <span className="font-mono text-[9px] text-cyber-text-muted uppercase font-bold">Interactive stats</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff66" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00ff66" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCommands" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--cyber-border-muted)" />
                <XAxis dataKey="day" stroke="var(--cyber-text-muted)" fontSize={10} fontFamily="JetBrains Mono" />
                <YAxis stroke="var(--cyber-text-muted)" fontSize={10} fontFamily="JetBrains Mono" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--cyber-card)", borderColor: "var(--cyber-border)", borderRadius: "8px" }}
                  labelStyle={{ color: "var(--cyber-text)", fontFamily: "Space Grotesk", fontSize: "11px", fontWeight: "bold" }}
                  itemStyle={{ fontSize: "11px", fontFamily: "JetBrains Mono", color: "var(--cyber-text)" }}
                />
                <Area type="monotone" name="Study Hours" dataKey="hours" stroke="#00ff66" fillOpacity={1} fill="url(#colorHours)" strokeWidth={2} />
                <Area type="monotone" name="Commands run" dataKey="commands" stroke="#00e5ff" fillOpacity={1} fill="url(#colorCommands)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap activities calendar matrix */}
        <div className="lg:col-span-5 bg-cyber-card border border-cyber-border rounded-xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-cyber-border pb-3">
              <h3 className="font-display text-base font-bold text-cyber-text flex items-center gap-2">
                <Calendar className="text-cyber-blue" size={16} />
                Operator Activity Heatmap
              </h3>
              <span className="font-mono text-[9px] text-cyber-text-muted uppercase font-bold">30-day matrix</span>
            </div>

            <p className="font-sans text-xs text-cyber-text-muted mb-4">
              Intensity levels track daily security labs successfully compiled or terminal command practices. Keep cubes glowing green!
            </p>

            {/* Matrix grid cubes */}
            <div className="grid grid-cols-7 gap-2">
              {heatmapCubes.map((cube, idx) => (
                <div 
                  key={idx}
                  className={`aspect-square rounded transition-all duration-300 relative group cursor-pointer ${
                    cube.intensity === 0 ? "bg-cyber-input-bg border border-cyber-border hover:opacity-80" :
                    cube.intensity === 1 ? "bg-cyber-green/20 hover:bg-cyber-green/30" :
                    cube.intensity === 2 ? "bg-cyber-green/50 hover:bg-cyber-green/60" :
                    "bg-cyber-green border border-cyber-border hover:shadow-[0_0_8px_rgba(0,255,102,0.8)]"
                  }`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-cyber-card border border-cyber-border text-[9px] font-mono text-cyber-text p-1.5 rounded whitespace-nowrap z-20 pointer-events-none shadow-md">
                    {cube.dateLabel}: {cube.intensity === 0 ? "No Logs" : `${cube.intensity * 3} exploits logged`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-cyber-text-muted justify-end font-bold">
            <span>LESS</span>
            <div className="h-3 w-3 bg-cyber-input-bg border border-cyber-border rounded" />
            <div className="h-3 w-3 bg-cyber-green/20 rounded" />
            <div className="h-3 w-3 bg-cyber-green/50 rounded" />
            <div className="h-3 w-3 bg-cyber-green rounded" />
            <span>MORE</span>
          </div>
        </div>

      </div>

      {/* Automated Report Generator Section */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-border pb-4 mb-4">
          <div className="space-y-1">
            <h3 className="font-display text-base font-bold text-cyber-text flex items-center gap-2">
              <FileText className="text-cyber-purple" size={16} />
              Automated Operations Report Generator
            </h3>
            <p className="text-xs text-cyber-text-muted">
              Compile full analytical statistics, learning curves, and security health recommendations instantly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={activeReportRange}
              onChange={(e) => setActiveReportRange(e.target.value as any)}
              className="bg-cyber-input-bg border border-cyber-border rounded px-2.5 py-1.5 text-xs font-mono text-cyber-text outline-none font-bold"
            >
              <option value="weekly">7-DAY WEEKLY RANGE</option>
              <option value="monthly">30-DAY MONTHLY RANGE</option>
            </select>

            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="px-4 py-1.5 bg-cyber-purple/15 hover:bg-cyber-purple/25 border border-cyber-purple/40 disabled:opacity-40 text-cyber-purple text-xs font-mono rounded cursor-pointer transition-all flex items-center gap-1.5 font-bold"
            >
              <Download size={12} />
              {isGenerating ? "COMPILING..." : "COMPILE REPORT"}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {reportLog && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-cyber-input-bg border border-cyber-border rounded-lg p-4 overflow-x-auto font-mono text-xs text-cyber-text leading-relaxed whitespace-pre shadow-inner"
            >
              {reportLog}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
