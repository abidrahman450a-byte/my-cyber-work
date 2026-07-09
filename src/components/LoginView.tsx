import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Terminal, Lock, Key, ChevronRight, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MatrixRain } from "./MatrixRain";

interface LoginViewProps {
  onLoginSuccess: () => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, theme, setTheme }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING KERNEL SYSTEM GATEWAY...",
    "SECURE SOCKET SHELL: OPERATING ON PORT 3000",
    "AWAITING AUTHENTICATION FROM SECURITY HANDSHAKE..."
  ]);

  const addLog = (text: string) => {
    setLogs(prev => [...prev.slice(-4), text]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsSubmitting(true);
    setError(null);
    addLog(`ATTEMPTING ACCESS handshake for operator: [${username}]...`);

    setTimeout(() => {
      if (username === "armaani" && password === "1897") {
        addLog("CREDENTIALS ACCEPTED. SECURE KEY GENERATED.");
        addLog("REDIRECTING TO OPERATOR CONSOLE...");
        setTimeout(() => {
          onLoginSuccess();
          setIsSubmitting(false);
        }, 1000);
      } else {
        setError("ACCESS DENIED: INVALID SECURITY CLASSIFICATION CODE.");
        addLog("HANDSHAKE TERMINATED. ERROR CODE: 403_UNAUTHORIZED");
        setIsSubmitting(false);
      }
    }, 1200);
  };

  return (
    <div className={`min-h-screen bg-cyber-bg text-cyber-text flex flex-col justify-between font-sans selection:bg-cyber-green/30 relative overflow-x-hidden ${theme === "light" ? "light-theme" : ""}`}>
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0 opacity-40" />
      {theme === "dark" && <MatrixRain />}

      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg bg-cyber-card border border-cyber-border hover:bg-cyber-border-muted text-cyber-text transition-all cursor-pointer flex items-center justify-center shadow-md"
          title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {theme === "dark" ? (
            <Sun size={14} className="text-cyber-orange" />
          ) : (
            <Moon size={14} className="text-cyber-blue" />
          )}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-md bg-cyber-card border border-cyber-green/40 shadow-[0_0_35px_var(--cyber-shadow)] rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden"
        >
          {/* Scanning glow bar effect */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-green to-transparent animate-pulse" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-cyber-green/10 border border-cyber-green/30 text-cyber-green shadow-[0_0_15px_rgba(0,255,102,0.1)] mb-1">
              {error ? (
                <ShieldAlert size={30} className="text-cyber-red animate-bounce" />
              ) : (
                <Lock size={30} className={isSubmitting ? "animate-pulse" : ""} />
              )}
            </div>
            
            <h1 className="font-display text-2xl font-black text-cyber-text tracking-wide uppercase">
              CyberOS Terminal Gate
            </h1>
            <p className="font-mono text-[10px] text-cyber-text-muted">
              AUTHENTICATION LEVEL: <span className="text-cyber-blue font-bold">SECURE_OPERATOR_V2</span>
            </p>
          </div>

          {/* Simulated mini live logs console */}
          <div className="bg-cyber-input-bg border border-cyber-border p-3 rounded-lg font-mono text-[10px] text-cyber-text-muted space-y-1 h-24 overflow-y-auto shadow-inner leading-normal">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-1">
                <span className="text-cyber-green select-none">&gt;</span>
                <span className="break-all">{log}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[11.5px] text-cyber-text-muted uppercase block font-semibold tracking-wider">
                Operator Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyber-text-muted">
                  <Terminal size={14} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. armaani"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-cyber-input-bg border border-cyber-border focus:border-cyber-green/40 rounded-lg pl-9 pr-4 py-2.5 text-xs font-mono text-cyber-text outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[11.5px] text-cyber-text-muted uppercase block font-semibold tracking-wider">
                Security Passkey
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyber-text-muted">
                  <Key size={14} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="e.g. 1897"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-cyber-input-bg border border-cyber-border focus:border-cyber-green/40 rounded-lg pl-9 pr-4 py-2.5 text-xs font-mono text-cyber-text outline-none transition-colors"
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-3 bg-cyber-red/10 border border-cyber-red/30 rounded-lg flex items-center gap-2.5 text-cyber-red font-mono text-xs"
                >
                  <ShieldAlert size={14} className="shrink-0 animate-pulse" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-cyber-green hover:bg-[#00e15c] text-black font-display font-black text-xs rounded-lg tracking-widest uppercase transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-cyber-green/5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>DECRYPTING NODES...</>
              ) : (
                <>
                  INITIALIZE BOOTSTAP <ChevronRight size={14} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Aesthetic Footer */}
      <footer className="p-4 text-center font-mono text-[9px] text-cyber-text-muted z-10">
        <span>CYBEROS v2.4.0-STABLE | © 2026 SECURE TERMINAL MATRIX INC.</span>
      </footer>
    </div>
  );
};
