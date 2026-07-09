import React, { useState, useEffect, useRef } from "react";
import { PlannerItem } from "../types";
import { 
  Play, Pause, RotateCcw, Calendar, Clock, 
  Plus, Check, Target, EyeOff, Sparkles, BookOpen 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StudyPlannerProps {
  planner: PlannerItem[];
  updatePlanner: (items: PlannerItem[]) => void;
  addXP: (amount: number, reason: string) => void;
  hoursStudied: number;
  updateHoursStudied: (hours: number) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerProps> = ({
  planner,
  updatePlanner,
  addXP,
  hoursStudied,
  updateHoursStudied
}) => {
  // Pomodoro states
  const [pomodoroMinutes, setPomodoroMinutes] = useState<number>(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<"focus" | "break">("focus");
  const [pomodoroCycles, setPomodoroCycles] = useState<number>(0);
  const [focusModeActive, setFocusModeActive] = useState<boolean>(false);

  // New plan form states
  const [planTitle, setPlanTitle] = useState<string>("");
  const [planDay, setPlanDay] = useState<string>("Monday");
  const [planTime, setPlanTime] = useState<string>("19:00");
  const [planDuration, setPlanDuration] = useState<number>(60);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown clock loop
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        if (pomodoroSeconds > 0) {
          setPomodoroSeconds(pomodoroSeconds - 1);
        } else if (pomodoroMinutes > 0) {
          setPomodoroMinutes(pomodoroMinutes - 1);
          setPomodoroSeconds(59);
        } else {
          // Timer completed!
          clearInterval(timerRef.current!);
          setIsTimerRunning(false);

          if (timerMode === "focus") {
            addXP(100, "Successfully completed 25-minute Pomodoro Cyber focus cycle");
            updateHoursStudied(hoursStudied + 0.42); // 25 mins is ~0.42 hours
            setTimerMode("break");
            setPomodoroMinutes(5);
            setPomodoroCycles(prev => prev + 1);
          } else {
            addXP(20, "Completed break period, ready for focus core reloading");
            setTimerMode("focus");
            setPomodoroMinutes(25);
          }
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, pomodoroMinutes, pomodoroSeconds, timerMode]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerMode("focus");
    setPomodoroMinutes(25);
    setPomodoroSeconds(0);
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim()) return;

    const newItem: PlannerItem = {
      id: `pl-${Date.now()}`,
      title: planTitle,
      day: planDay,
      time: planTime,
      duration: planDuration
    };

    updatePlanner([...planner, newItem]);
    setPlanTitle("");
    addXP(15, `Scheduled study slot: [${planTitle}] on ${planDay}`);
  };

  const deletePlan = (id: string) => {
    updatePlanner(planner.filter(item => item.id !== id));
  };

  const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {focusModeActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#040404] flex flex-col items-center justify-center p-6"
          >
            {/* Ambient cyber matrix scan background in Focus mode */}
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            
            <div className="text-center max-w-lg space-y-6 relative z-10">
              <span className="font-mono text-xs text-cyber-green tracking-widest uppercase block animate-pulse font-bold">
                [ FOCUS MODE STAGE ACTIVE - ALL COMPILATIONS SILENCED ]
              </span>
              
              <h2 className="font-display text-lg font-bold text-gray-400">
                "Disconnect from outer nodes. Refine security scripts. Master the shell."
              </h2>

              <div className="py-8 bg-[#0b0b0b] border border-cyber-green/30 rounded-2xl shadow-[0_0_30px_rgba(0,255,102,0.15)]">
                <div className="font-display text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 font-mono tracking-wider">
                  {String(pomodoroMinutes).padStart(2, "0")}:{String(pomodoroSeconds).padStart(2, "0")}
                </div>
                <div className="font-mono text-xs text-cyber-green mt-3 uppercase tracking-wider font-bold">
                  {timerMode === "focus" ? "⚔ TACTICAL FOCUS CORE LOADED" : "☕ SYSTEM COOLING BREAK"}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  className={`px-6 py-2.5 rounded-lg border font-mono text-xs tracking-wider cursor-pointer transition-all font-bold ${
                    isTimerRunning
                      ? "border-cyber-orange text-cyber-orange bg-cyber-orange/10"
                      : "border-cyber-green text-cyber-green bg-cyber-green/10"
                  }`}
                >
                  {isTimerRunning ? "PAUSE THREAD" : "RUN CALIBRATION"}
                </button>
                
                <button
                  onClick={resetTimer}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 font-mono text-xs cursor-pointer font-bold"
                >
                  RESET
                </button>
              </div>

              <button
                onClick={() => setFocusModeActive(false)}
                className="text-xs font-mono text-gray-500 hover:text-white underline block mx-auto cursor-pointer font-semibold"
              >
                Exit Focus Arena
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Pomodoro Engine & Scheduler */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pomodoro Focus engine card */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 relative overflow-hidden shadow-sm">
            <div className="absolute right-0 top-0 h-24 w-24 bg-cyber-green/5 blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-4 border-b border-cyber-border pb-3">
              <Clock className="text-cyber-green" size={16} />
              <h3 className="font-display text-base font-bold text-cyber-text">Study Pomodoro Engine</h3>
            </div>

            <div className="text-center py-6 bg-cyber-input-bg border border-cyber-border rounded-xl">
              <div className="font-mono text-5xl font-bold text-cyber-text tracking-widest">
                {String(pomodoroMinutes).padStart(2, "0")}:{String(pomodoroSeconds).padStart(2, "0")}
              </div>
              
              <div className="font-mono text-[10px] text-cyber-green mt-2 uppercase tracking-widest animate-pulse font-bold">
                {timerMode === "focus" ? "TACTICAL FOCUS INTERVAL" : "COOLING DOWN"}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <button
                onClick={toggleTimer}
                className={`py-2 rounded font-mono text-xs border cursor-pointer transition-all font-bold ${
                  isTimerRunning 
                    ? "border-cyber-orange text-cyber-orange bg-cyber-orange/10" 
                    : "border-cyber-green text-cyber-green bg-cyber-green/10"
                }`}
              >
                {isTimerRunning ? "PAUSE" : "START"}
              </button>

              <button
                onClick={resetTimer}
                className="py-2 bg-cyber-input-bg border border-cyber-border hover:border-cyber-text-muted text-cyber-text-muted hover:text-cyber-text rounded font-mono text-xs cursor-pointer transition-all font-bold"
              >
                RESET
              </button>

              <button
                onClick={() => setFocusModeActive(true)}
                className="py-2 bg-cyber-purple/15 border border-cyber-purple/40 text-cyber-purple hover:bg-cyber-purple/25 rounded font-mono text-xs cursor-pointer transition-all font-bold"
              >
                FOCUS ARENA
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-cyber-border flex justify-between items-center text-[10px] font-mono text-cyber-text-muted">
              <span className="font-semibold">CYCLES COMPLETED TODAY</span>
              <span className="text-cyber-green font-bold">{pomodoroCycles} / 4 Sessions</span>
            </div>
          </div>

          {/* New scheduler Slot Form */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 shadow-sm">
            <h3 className="font-display text-base font-bold text-cyber-text mb-4 flex items-center gap-2">
              <Calendar className="text-cyber-blue" size={16} />
              Schedule Study slots
            </h3>

            <form onSubmit={handleAddPlan} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-cyber-text-muted uppercase font-semibold">Class/Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireshark Forensics Lab"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  className="w-full bg-cyber-input-bg border border-cyber-border focus:border-cyber-blue/40 rounded-lg p-2.5 text-xs font-mono text-cyber-text outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-cyber-text-muted uppercase font-semibold">Day</label>
                  <select
                    value={planDay}
                    onChange={(e) => setPlanDay(e.target.value)}
                    className="w-full bg-cyber-input-bg border border-cyber-border rounded p-2 text-xs font-mono text-cyber-text outline-none font-bold"
                  >
                    {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-cyber-text-muted uppercase font-semibold">Hour (HH:MM)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20:00"
                    value={planTime}
                    onChange={(e) => setPlanTime(e.target.value)}
                    className="w-full bg-cyber-input-bg border border-cyber-border rounded p-1.5 text-xs font-mono text-cyber-text outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-cyber-blue/15 hover:bg-cyber-blue/25 border border-cyber-blue/40 text-cyber-blue text-xs font-mono rounded cursor-pointer transition-all font-bold"
              >
                SCHEDULE SESSION
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Timetable Grid viewer */}
        <div className="lg:col-span-7 bg-cyber-card border border-cyber-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-cyber-border pb-3">
            <h3 className="font-display text-base font-bold text-cyber-text flex items-center gap-2">
              <Target className="text-cyber-purple" size={16} />
              Timetable Schedule Grid
            </h3>
            <span className="font-mono text-[9px] text-cyber-text-muted font-bold">REALTIME MATRIX</span>
          </div>

          <div className="space-y-4">
            {DAYS_OF_WEEK.map(day => {
              const itemsForDay = planner.filter(p => p.day === day);
              return (
                <div key={day} className="border-b border-cyber-border pb-3 last:border-b-0 last:pb-0">
                  <div className="font-mono text-[10px] text-cyber-purple font-black uppercase mb-2">
                    {day}
                  </div>

                  {itemsForDay.length > 0 ? (
                    <div className="space-y-2">
                      {itemsForDay.map(item => (
                        <div key={item.id} className="bg-cyber-input-bg border border-cyber-border p-3 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Clock size={12} className="text-cyber-blue" />
                            <div>
                              <span className="font-mono text-xs text-cyber-text block font-bold">{item.title}</span>
                              <span className="font-mono text-[10px] text-cyber-text-muted font-semibold">{item.time} | Duration: {item.duration} mins</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => deletePlan(item.id)}
                            className="text-cyber-red/80 hover:text-cyber-red text-xs font-mono cursor-pointer font-bold"
                          >
                            REMOVE
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="font-mono text-[10px] text-cyber-text-muted/60 italic">No scheduled tasks.</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
