import React, { useState } from "react";
import { Lab, QuizQuestion } from "../types";
import { CYBER_LABS } from "../data/labs";
import { 
  ShieldCheck, Clock, Award, CheckCircle, Search, 
  HelpCircle, ChevronRight, File, BookOpen, PenTool, ArrowLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LabsProps {
  completedLabs: string[];
  completeLabInState: (labId: string, xpReward: number) => void;
  addXP: (amount: number, reason: string) => void;
}

export const LabsView: React.FC<LabsProps> = ({ 
  completedLabs, 
  completeLabInState,
  addXP 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [labNotes, setLabNotes] = useState<string>("");
  const [savedNotes, setSavedNotes] = useState<boolean>(false);

  const activeLab = CYBER_LABS.find(l => l.id === selectedLabId);

  const handleSelectLab = (labId: string) => {
    setSelectedLabId(labId);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setLabNotes("");
    setSavedNotes(false);
  };

  const handleOptionSelect = (qId: string, optIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers({ ...quizAnswers, [qId]: optIndex });
  };

  const handleSubmitQuiz = () => {
    if (!activeLab) return;
    let correctCount = 0;
    
    activeLab.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const isSuccess = correctCount === activeLab.quiz.length;
    setQuizScore(correctCount);
    setQuizSubmitted(true);

    if (isSuccess && !completedLabs.includes(activeLab.id)) {
      completeLabInState(activeLab.id, activeLab.xpReward);
      addXP(activeLab.xpReward, `Completed Lab Quiz successfully: ${activeLab.title}`);
    }
  };

  const handleSaveNotes = () => {
    setSavedNotes(true);
    addXP(15, `Saved local system notes and writeups for lab`);
    setTimeout(() => setSavedNotes(false), 3000);
  };

  const filteredLabs = CYBER_LABS.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!selectedLabId ? (
          /* List Mode */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Search and stats bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cyber-card border border-cyber-border p-4 rounded-xl shadow-sm">
              <div className="relative flex-1 max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyber-text-muted">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search labs (e.g. Linux, Nmap, Web, SQLi)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-cyber-input-bg border border-cyber-border focus:border-cyber-green/40 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-cyber-text outline-none"
                />
              </div>

              <div className="flex gap-4 text-xs font-mono text-cyber-text-muted">
                <div>
                  TOTAL LABS: <span className="text-cyber-text font-bold">{CYBER_LABS.length}</span>
                </div>
                <div>
                  COMPLETED: <span className="text-cyber-green font-bold">{completedLabs.length}</span>
                </div>
              </div>
            </div>

            {/* Labs grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLabs.map((lab) => {
                const isCompleted = completedLabs.includes(lab.id);
                return (
                  <motion.div
                    key={lab.id}
                    onClick={() => handleSelectLab(lab.id)}
                    className={`bg-cyber-card border rounded-xl p-5 cursor-pointer flex flex-col justify-between transition-all duration-300 hover:y-[-2px] ${
                      isCompleted 
                        ? "border-cyber-green/40 shadow-[0_0_15px_var(--cyber-shadow)] hover:border-cyber-green/80" 
                        : "border-cyber-border hover:border-cyber-blue/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-cyber-input-bg text-cyber-text-muted border border-cyber-border">
                          {lab.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono text-[9px] uppercase font-bold ${
                            lab.difficulty === "Easy" ? "text-cyber-green" :
                            lab.difficulty === "Medium" ? "text-cyber-blue" :
                            lab.difficulty === "Hard" ? "text-cyber-orange" : "text-cyber-red"
                          }`}>
                            {lab.difficulty}
                          </span>
                          {isCompleted && (
                            <CheckCircle size={14} className="text-cyber-green" />
                          )}
                        </div>
                      </div>

                      <h3 className="font-display text-base font-bold text-cyber-text mb-2 group-hover:text-cyber-green transition-colors">
                        {lab.title}
                      </h3>
                      <p className="text-xs text-cyber-text-muted line-clamp-3">
                        {lab.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-cyber-border flex items-center justify-between text-[10px] font-mono text-cyber-text-muted">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock size={12} className="text-cyber-blue" /> {lab.duration} mins
                      </span>
                      <span className="flex items-center gap-1 text-cyber-green font-bold">
                        <Award size={12} /> +{lab.xpReward} XP
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* Active Detail Mode */
          <motion.div
            key="detail"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            {/* Detail title header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedLabId(null)}
                className="flex items-center gap-1.5 text-xs font-mono text-cyber-text-muted hover:text-cyber-text cursor-pointer font-bold"
              >
                <ArrowLeft size={14} /> BACK TO ACTIVE LIST
              </button>
              
              {completedLabs.includes(activeLab?.id || "") && (
                <span className="font-mono text-xs text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2.5 py-1 rounded font-bold">
                  LAB CLASSIFICATION COMPLETED
                </span>
              )}
            </div>

            {activeLab && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left side: descriptions, instructions & files */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] bg-cyber-input-bg text-cyber-text-muted border border-cyber-border px-2 py-0.5 rounded uppercase font-semibold">
                        {activeLab.category}
                      </span>
                      <span className="font-mono text-[10px] bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 px-2 py-0.5 rounded uppercase font-semibold">
                        Difficulty: {activeLab.difficulty}
                      </span>
                      <span className="font-mono text-[10px] bg-cyber-purple/10 text-[#a78bfa] border border-cyber-purple/20 px-2 py-0.5 rounded uppercase font-semibold">
                        Time: {activeLab.duration} Mins
                      </span>
                    </div>

                    <h2 className="font-display text-2xl font-black text-cyber-text">{activeLab.title}</h2>
                    <p className="text-sm text-cyber-text-muted leading-relaxed">{activeLab.description}</p>

                    {/* Labs Instructions */}
                    <div className="bg-cyber-input-bg border border-cyber-border rounded-lg p-4 font-mono text-xs leading-relaxed space-y-2">
                      <div className="text-cyber-green uppercase font-bold flex items-center gap-1">
                        <PenTool size={12} /> Execution Instructions:
                      </div>
                      <p className="text-cyber-text-muted">{activeLab.instructions}</p>
                    </div>

                    {/* Virtual files provided */}
                    <div>
                      <h4 className="font-mono text-xs text-cyber-text-muted uppercase mb-2 font-bold">Simulated Laboratory Files:</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeLab.files.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 bg-cyber-input-bg border border-cyber-border px-2.5 py-1.5 rounded text-[11px] font-mono text-cyber-text">
                            <File size={12} className="text-cyber-blue" />
                            <span>{file}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* External guides & materials */}
                    <div>
                      <h4 className="font-mono text-xs text-cyber-text-muted uppercase mb-2 font-bold">Reference guides & resources:</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeLab.resources.map((res, idx) => (
                          <a 
                            key={idx} 
                            href={res} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1 bg-cyber-purple/10 border border-cyber-purple/30 hover:border-cyber-purple/60 px-2.5 py-1.5 rounded text-[11px] font-mono text-cyber-purple transition-all font-bold"
                          >
                            <BookOpen size={12} />
                            <span>{res.replace("https://", "")}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Notes writeup box */}
                  <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 space-y-4 shadow-sm">
                    <h3 className="font-display text-lg font-bold text-cyber-text flex items-center gap-2">
                      <PenTool className="text-cyber-blue" size={18} />
                      Operator writeup & Notes
                    </h3>
                    <textarea
                      placeholder="Write your notes, payload summaries, or solved flags here for safe tracking writeups..."
                      value={labNotes}
                      onChange={(e) => setLabNotes(e.target.value)}
                      className="w-full h-32 bg-cyber-input-bg border border-cyber-border focus:border-cyber-blue/40 rounded-lg p-3 text-xs font-mono text-cyber-text outline-none resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNotes}
                        className="px-4 py-2 bg-cyber-blue/10 hover:bg-cyber-blue/20 border border-cyber-blue/40 text-cyber-blue text-xs font-mono rounded transition-all cursor-pointer font-bold"
                      >
                        {savedNotes ? "✓ NOTES SAVED SUCCESSFULLY" : "SAVE NOTES FOR HISTORY"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right side: Quiz Panel */}
                <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 h-fit space-y-6 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-cyber-border pb-3">
                    <HelpCircle className="text-cyber-green animate-pulse" size={18} />
                    <h3 className="font-display text-base font-bold text-cyber-text">Quiz Validation</h3>
                  </div>

                  <div className="space-y-6">
                    {activeLab.quiz.map((q, idx) => (
                      <div key={q.id} className="space-y-2">
                        <span className="font-mono text-[10px] text-cyber-text-muted block font-semibold">QUESTION {idx + 1} OF {activeLab.quiz.length}</span>
                        <p className="text-xs font-bold text-cyber-text">{q.question}</p>
                        
                        <div className="space-y-1.5 mt-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = quizAnswers[q.id] === oIdx;
                            const isCorrect = q.correctAnswer === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleOptionSelect(q.id, oIdx)}
                                disabled={quizSubmitted}
                                className={`w-full text-left px-3 py-2 rounded text-xs font-mono border transition-all ${
                                  quizSubmitted
                                    ? isCorrect
                                      ? "bg-cyber-green/10 border-cyber-green text-cyber-green font-bold"
                                      : isSelected
                                        ? "bg-cyber-red/10 border-cyber-red text-cyber-red"
                                        : "bg-cyber-input-bg border-cyber-border text-cyber-text-muted"
                                    : isSelected
                                      ? "bg-cyber-blue/10 border-cyber-blue text-cyber-blue font-bold shadow-[0_0_8px_rgba(0,229,255,0.1)]"
                                      : "bg-cyber-input-bg border-cyber-border text-cyber-text hover:border-cyber-text-muted"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {quizSubmitted && quizScore !== null && (
                      <div className="p-4 rounded-lg bg-cyber-input-bg border border-cyber-border text-center">
                        <div className="font-display font-extrabold text-lg text-cyber-text">
                          Validation Score:{" "}
                          <span className={quizScore === activeLab.quiz.length ? "text-cyber-green" : "text-cyber-orange"}>
                            {quizScore} / {activeLab.quiz.length}
                          </span>
                        </div>
                        <p className="text-[11px] text-cyber-text-muted font-mono mt-1">
                          {quizScore === activeLab.quiz.length 
                            ? "Classification Authenticated! Reward Granted."
                            : "Integrity validation failure. Reset terminal nodes and try again."}
                        </p>
                        
                        {quizScore < activeLab.quiz.length && (
                          <button
                            onClick={() => {
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                              setQuizScore(null);
                            }}
                            className="mt-3 px-3 py-1.5 bg-cyber-orange/10 border border-cyber-orange/30 text-cyber-orange text-xs font-mono rounded hover:bg-cyber-orange/20 cursor-pointer font-bold"
                          >
                            RETRY INTEGRITY VALIDATION
                          </button>
                        )}
                      </div>
                    )}

                    {!quizSubmitted && (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(quizAnswers).length < activeLab.quiz.length}
                        className="w-full py-2.5 bg-cyber-green text-black font-display font-black text-xs rounded tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00e15c] transition-colors shadow-md cursor-pointer"
                      >
                        SUBMIT VERIFICATION FLAG
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
