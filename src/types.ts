export interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  text: string;
  status: "todo" | "in-progress" | "completed";
}

export interface Bug {
  id: string;
  text: string;
  status: "open" | "resolved";
  severity: "low" | "medium" | "high";
}

export interface DailyLog {
  date: string;
  note: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technology: string;
  progress: number;
  githubRepo: string;
  demoUrl: string;
  milestones: Milestone[];
  tasks: Task[];
  bugs: Bug[];
  dailyLogs: DailyLog[];
  notes: string;
}

export interface PlannerItem {
  id: string;
  title: string;
  day: string;
  time: string;
  duration: number; // in minutes
}

export interface TryHackMeData {
  username: string;
  linked: boolean;
  rank: number;
  xp: number;
  streak: number;
  completedRooms: string[];
  inProgressRooms: string[];
  badges: string[];
}

export interface HeatmapLog {
  date: string;
  count: number;
}

export interface AppState {
  xp: number;
  level: number;
  streak: number;
  rank: string;
  completedLabs: string[];
  hoursStudied: number;
  todayGoal: number;
  weeklyGoal: number;
  monthlyGoal: number;
  commandsPracticedCount: number;
  projects: Project[];
  planner: PlannerItem[];
  tryhackme: TryHackMeData;
  heatmapLogs: HeatmapLog[];
  unlockedBadges: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lab {
  id: string;
  title: string;
  category: "Linux" | "Networking" | "Python" | "Nmap" | "Web" | "Exploitation" | "Defensive" | "Forensics";
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  duration: number; // minutes
  xpReward: number;
  completed: boolean;
  description: string;
  files: string[];
  resources: string[];
  quiz: QuizQuestion[];
  instructions: string;
}
