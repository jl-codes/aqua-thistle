export interface BudgetCategory {
  name: string;
  color: string;
  amount: number;
  percentage: number;
}

export interface Budget {
  current: number;
  total: number;
  categories: BudgetCategory[];
}

export interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  category: 'financial' | 'health' | 'study' | 'personal' | 'social';
  icon: string;
  description: string;
  streak: number;
  lastCompleted?: Date;
  isCompleted: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'low' | 'medium' | 'high';
  estimatedTime?: string;
  reward?: string;
  contextualTip?: string;
}

export interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'health' | 'study' | 'personal' | 'social';
  icon: string;
  defaultTarget: number;
  unit: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  contextualReasons: string[];
}

export interface GoalProgress {
  date: Date;
  value: number;
  completed: boolean;
}

export interface GoalAnalytics {
  completionRate: number;
  averageProgress: number;
  bestStreak: number;
  currentStreak: number;
  weeklyTrend: number;
  monthlyTrend: number;
  progressHistory: GoalProgress[];
}

export interface StudyProgress {
  subject: string;
  goals: number;
  score: number;
  goalTarget: number;
  scoreTarget: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
}

export interface UserProfile {
  name: string;
  goals: Goal[];
  budget: Budget;
  studyProgress: StudyProgress;
  savingsGoal: {
    current: number;
    target: number;
    monthlyIncrease: number;
    percentage: number;
  };
}

export interface TipCard {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'tip' | 'action';
  buttonText?: string;
  icon?: string;
}
