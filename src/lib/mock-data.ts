import { UserProfile, TipCard, ChatMessage } from '@/types';

export const mockUserProfile: UserProfile = {
  name: "Suzy",
  budget: {
    current: 1576,
    total: 2000,
    categories: [
      { name: "Savings", color: "#374151", amount: 630, percentage: 40 },
      { name: "Food", color: "#6B7280", amount: 472, percentage: 30 },
      { name: "Leisure", color: "#D1D5DB", amount: 474, percentage: 30 }
    ]
  },
  goals: [
    { 
      id: "calories-goal",
      name: "Daily Calories", 
      current: 85, 
      target: 100, 
      unit: "%", 
      color: "#10B981",
      category: "health" as const,
      icon: "🍎",
      description: "Stay within daily calorie budget",
      streak: 3,
      lastCompleted: new Date(Date.now() - 86400000), // Yesterday
      isCompleted: false,
      difficulty: "medium" as const,
      priority: "medium" as const,
      estimatedTime: "All day",
      reward: "Better energy levels!",
      contextualTip: "Track food costs to help with your budget deficit too!"
    },
    { 
      id: "money-goal",
      name: "Daily Budget", 
      current: 75, 
      target: 100, 
      unit: "%", 
      color: "#3B82F6",
      category: "financial" as const,
      icon: "💰",
      description: "Stay within daily spending limit",
      streak: 2,
      isCompleted: false,
      difficulty: "hard" as const,
      priority: "high" as const,
      estimatedTime: "All day",
      reward: "Closer to breaking even!",
      contextualTip: "You're $376 over budget monthly - every dollar saved counts!"
    },
    { 
      id: "steps-goal",
      name: "Daily Steps", 
      current: 54, 
      target: 100, 
      unit: "%", 
      color: "#F59E0B",
      category: "health" as const,
      icon: "👟",
      description: "Hit 10,000 steps today",
      streak: 1,
      isCompleted: false,
      difficulty: "easy" as const,
      priority: "low" as const,
      estimatedTime: "Throughout day",
      reward: "Free exercise, better sleep!",
      contextualTip: "Walking saves on transportation costs!"
    }
  ],
  studyProgress: {
    subject: "ABC Certification Preparation",
    goals: 1200,
    score: 1200,
    goalTarget: 1600,
    scoreTarget: 1600
  },
  savingsGoal: {
    current: 68,
    target: 100,
    monthlyIncrease: 300,
    percentage: 68
  }
};

export const mockTipCards: TipCard[] = [
  {
    id: "1",
    title: "Today's 10-sec Quiz!",
    description: "",
    type: "quiz",
    buttonText: "🎁 Get rewarded",
    icon: "🎯"
  },
  {
    id: "2",
    title: "Today's Tip",
    description: "Did you know that by registering for Selective Service, you may qualify for student aid? 🎓",
    type: "tip",
    icon: "💡"
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    content: "Hey Suzy!\n\nWell done on that last exam!\n\nYou scored a 1,200 which is a marked improvement but I think there's still room to grow.\n\nYou got this! 😊",
    type: "assistant",
    timestamp: new Date(),
    suggestions: [
      "📊 Analyze my last exam",
      "💰 How can I improve my scores?",
      "😊 How am I doing now?",
      "📝 Come up with similar questions"
    ]
  }
];

export const studyAnalytics = {
  breakdown: [
    { name: "Reading", value: 240, percentage: 40, color: "#374151" },
    { name: "Writing", value: 220, percentage: 25, color: "#6B7280" },
    { name: "Reasoning", value: 140, percentage: 15, color: "#9CA3AF" },
    { name: "Algebra", value: 100, percentage: 10, color: "#D1D5DB" },
    { name: "Geometry", value: 100, percentage: 10, color: "#E5E7EB" }
  ],
  insights: [
    "✅ Reading score improved 15% over the last 3 months",
    "✅ Your expected range is 1,150 to 1,320"
  ]
};

export const savingsTips = [
  "💡 View 3 ways to save 15% on fixed costs →",
  "🚗 11% off your transport costs — Learn more!"
];

export const motivationalMessages = [
  "Stay focused! The ABC Certification is an important milestone for you to become a Program Manager.",
  "12% less study time today",
  "70% goal reached"
];

export const quickSuggestions = [
  "📊 Analyze my last exam",
  "💰 How can I improve my scores?", 
  "😊 How am I doing now?",
  "📝 Come up with similar questions",
  "🚗 Want to cut down on transportation costs.",
  "📚 Give me practice questions"
];

// Category System for Query Grouping
export const categoryData = [
  {
    id: "finance",
    name: "Finance",
    icon: "💰",
    gradient: "from-blue-500 to-purple-600",
    liveData: "$376 deficit",
    description: "Budget, expenses, savings",
    suggestions: [
      "💡 How can I cut my expenses by $200?",
      "🏠 What should I budget for rent?",
      "📊 Show me my spending breakdown",
      "🎯 Create a savings plan for me"
    ],
    quickActions: [
      { label: "Quick Budget", icon: "📊", action: "budget-analysis" },
      { label: "Save Money", icon: "💰", action: "expense-cutting" },
      { label: "Emergency Fund", icon: "🛡️", action: "emergency-fund" },
      { label: "Debt Plan", icon: "📉", action: "debt-strategy" }
    ]
  },
  {
    id: "education",
    name: "Education", 
    icon: "📚",
    gradient: "from-green-500 to-teal-600",
    liveData: "75% progress",
    description: "Study plans, certifications",
    suggestions: [
      "📖 Help me create a study schedule",
      "🎯 How can I improve my test scores?",
      "📝 Give me practice questions",
      "🏆 Track my certification progress"
    ],
    quickActions: [
      { label: "Study Plan", icon: "📅", action: "study-schedule" },
      { label: "Practice Test", icon: "📝", action: "practice-questions" },
      { label: "Progress Check", icon: "📊", action: "progress-analysis" },
      { label: "Goal Setting", icon: "🎯", action: "goal-setting" }
    ]
  },
  {
    id: "family",
    name: "Family",
    icon: "👨‍👩‍👧",
    gradient: "from-pink-500 to-rose-600", 
    liveData: "3 goals",
    description: "Family finances, activities",
    suggestions: [
      "🍽️ Budget for family dinner out",
      "🎁 Plan holiday gift budget",
      "🏡 Family emergency fund strategy", 
      "👶 Save for future family goals"
    ],
    quickActions: [
      { label: "Family Budget", icon: "👨‍👩‍👧", action: "family-budget" },
      { label: "Kids Savings", icon: "🎓", action: "education-fund" },
      { label: "Family Trip", icon: "✈️", action: "vacation-planning" },
      { label: "Emergency Plan", icon: "🚨", action: "family-emergency" }
    ]
  },
  {
    id: "friends",
    name: "Friends",
    icon: "👥", 
    gradient: "from-orange-500 to-yellow-500",
    liveData: "2 events",
    description: "Social budgets, group plans",
    suggestions: [
      "🍕 Split dinner costs with friends",
      "🎉 Budget for friend's birthday party",
      "🎬 Cheap group activity ideas",
      "💸 How to say no to expensive plans"
    ],
    quickActions: [
      { label: "Split Bills", icon: "🧾", action: "bill-splitting" },
      { label: "Group Events", icon: "🎉", action: "event-planning" },
      { label: "Social Budget", icon: "👥", action: "social-limits" },
      { label: "Gift Ideas", icon: "🎁", action: "gift-budgeting" }
    ]
  },
  {
    id: "weekend",
    name: "Weekend",
    icon: "🏖️",
    gradient: "from-purple-500 to-indigo-600",
    liveData: "Next: $120",
    description: "Leisure, trips, activities",
    suggestions: [
      "🏖️ Budget for weekend getaway",
      "🎪 Find free weekend activities",
      "✈️ Plan affordable vacation",
      "🎨 Hobby budget planning"
    ],
    quickActions: [
      { label: "Day Trip", icon: "🚗", action: "day-trip-budget" },
      { label: "Activities", icon: "🎯", action: "activity-finder" },
      { label: "Vacation Fund", icon: "✈️", action: "vacation-savings" },
      { label: "Free Events", icon: "🎪", action: "free-activities" }
    ]
  }
];

// Category-specific tips and insights
export const categoryInsights = {
  finance: [
    "💡 Your biggest opportunity: Cut $200 from food & transport",
    "📈 Emergency fund goal: $3,600 (3 months expenses)",
    "🎯 Break-even target: Reduce deficit by $376/month"
  ],
  education: [
    "📚 Study pattern: You rush questions near test end",
    "🎯 Target score: 1,400+ opens more career opportunities", 
    "💰 Score impact: Every 100 points = $5K salary boost"
  ],
  family: [
    "👨‍👩‍👧 Family dinner budget: $80-120/month is realistic",
    "🎁 Holiday planning: Start saving $50/month now",
    "🏡 Family goals need your deficit fixed first"
  ],
  friends: [
    "👥 Social spending: Limit to $100/month max",
    "💸 Saying 'no' saves $200+ monthly on avg",
    "🎉 Host potlucks instead of restaurant meetups"
  ],
  weekend: [
    "🏖️ Weekend trips: Budget $150 max with your deficit",
    "🎪 Free activities save $400+ monthly",
    "✈️ Vacation fund: Fix deficit first, then save $100/month"
  ]
};

// Enhanced Goal System Data
import { GoalTemplate, GoalAnalytics } from '@/types';

export const goalTemplates: GoalTemplate[] = [
  // Financial Goals
  {
    id: "save-daily",
    name: "Daily Savings Goal",
    description: "Stay within daily spending limit",
    category: "financial",
    icon: "💰",
    defaultTarget: 100,
    unit: "%",
    color: "#3B82F6",
    difficulty: "hard",
    estimatedTime: "All day",
    contextualReasons: [
      "You're currently $376 over budget monthly",
      "Every dollar saved brings you closer to break-even",
      "Building daily discipline leads to monthly success"
    ]
  },
  {
    id: "emergency-fund",
    name: "Emergency Fund Progress",
    description: "Build your emergency fund weekly",
    category: "financial",
    icon: "🛡️",
    defaultTarget: 50,
    unit: "$",
    color: "#059669",
    difficulty: "medium",
    estimatedTime: "5 min setup",
    contextualReasons: [
      "Aim for $3,600 (3 months expenses)",
      "Start small - even $10/week builds the habit",
      "Financial security reduces stress"
    ]
  },
  {
    id: "expense-tracking",
    name: "Daily Expense Tracking",
    description: "Log all expenses for budget awareness",
    category: "financial",
    icon: "📊",
    defaultTarget: 100,
    unit: "%",
    color: "#7C3AED",
    difficulty: "easy",
    estimatedTime: "5 min daily",
    contextualReasons: [
      "Awareness is the first step to control",
      "Find patterns in your $1,576 monthly spending",
      "Identify quick wins for budget cutting"
    ]
  },
  
  // Health Goals
  {
    id: "daily-steps",
    name: "Daily Steps",
    description: "Hit your daily step target",
    category: "health",
    icon: "👟",
    defaultTarget: 10000,
    unit: "steps",
    color: "#F59E0B",
    difficulty: "easy",
    estimatedTime: "Throughout day",
    contextualReasons: [
      "Free exercise - no gym membership needed",
      "Walking saves on transportation costs",
      "Better health = better academic performance"
    ]
  },
  {
    id: "healthy-meals",
    name: "Home-Cooked Meals",
    description: "Cook meals at home to save money and eat better",
    category: "health",
    icon: "🍎",
    defaultTarget: 5,
    unit: "meals",
    color: "#10B981",
    difficulty: "medium",
    estimatedTime: "30 min/meal",
    contextualReasons: [
      "Can save $200+ monthly on food budget",
      "Healthier than eating out constantly",
      "Meal prep skills for post-graduation life"
    ]
  },
  {
    id: "sleep-schedule",
    name: "Consistent Sleep",
    description: "Maintain regular sleep schedule",
    category: "health",
    icon: "😴",
    defaultTarget: 8,
    unit: "hours",
    color: "#8B5CF6",
    difficulty: "medium",
    estimatedTime: "8 hours nightly",
    contextualReasons: [
      "Better sleep = better test performance",
      "Reduces stress from financial pressure",
      "More energy for part-time work"
    ]
  },
  
  // Study Goals
  {
    id: "daily-study",
    name: "Focused Study Time",
    description: "Dedicated study sessions for certification",
    category: "study",
    icon: "📚",
    defaultTarget: 2,
    unit: "hours",
    color: "#DC2626",
    difficulty: "medium",
    estimatedTime: "2 hours daily",
    contextualReasons: [
      "Improve from 1200 to 1400+ score",
      "Higher score = better job prospects",
      "Better salary helps with $376 deficit"
    ]
  },
  {
    id: "practice-questions",
    name: "Practice Questions",
    description: "Complete practice questions daily",
    category: "study",
    icon: "✏️",
    defaultTarget: 20,
    unit: "questions",
    color: "#7C2D12",
    difficulty: "easy",
    estimatedTime: "30 minutes",
    contextualReasons: [
      "Address your pattern of rushing through questions",
      "Build accuracy before focusing on speed",
      "Every 100 points = $5K salary increase"
    ]
  },
  
  // Personal Goals
  {
    id: "skill-building",
    name: "Career Skill Development",
    description: "Learn PM-relevant skills daily",
    category: "personal",
    icon: "🚀",
    defaultTarget: 30,
    unit: "minutes",
    color: "#0EA5E9",
    difficulty: "easy",
    estimatedTime: "30 min daily",
    contextualReasons: [
      "Program Manager role requires diverse skills",
      "Stand out from other candidates",
      "Higher starting salary helps with debt"
    ]
  },
  {
    id: "networking",
    name: "Professional Networking",
    description: "Connect with industry professionals weekly",
    category: "personal",
    icon: "🤝",
    defaultTarget: 3,
    unit: "connections",
    color: "#EC4899",
    difficulty: "medium",
    estimatedTime: "1 hour weekly",
    contextualReasons: [
      "70% of jobs found through networking",
      "Learn industry insights for interviews",
      "Potential mentorship opportunities"
    ]
  },
  
  // Social Goals
  {
    id: "budget-social",
    name: "Social Budget Adherence",
    description: "Stay within weekly social spending limit",
    category: "social",
    icon: "👥",
    defaultTarget: 100,
    unit: "%",
    color: "#F97316",
    difficulty: "hard",
    estimatedTime: "Throughout week",
    contextualReasons: [
      "Social pressure is a major budget challenge",
      "Learn to have fun within financial limits",
      "Build skills for post-graduation social life"
    ]
  }
];

export const goalAnalytics: Record<string, GoalAnalytics> = {
  "calories-goal": {
    completionRate: 72,
    averageProgress: 89,
    bestStreak: 7,
    currentStreak: 3,
    weeklyTrend: 5,
    monthlyTrend: 12,
    progressHistory: [
      { date: new Date(Date.now() - 6 * 86400000), value: 78, completed: false },
      { date: new Date(Date.now() - 5 * 86400000), value: 95, completed: false },
      { date: new Date(Date.now() - 4 * 86400000), value: 100, completed: true },
      { date: new Date(Date.now() - 3 * 86400000), value: 100, completed: true },
      { date: new Date(Date.now() - 2 * 86400000), value: 100, completed: true },
      { date: new Date(Date.now() - 1 * 86400000), value: 92, completed: false },
      { date: new Date(), value: 85, completed: false }
    ]
  },
  "money-goal": {
    completionRate: 58,
    averageProgress: 76,
    bestStreak: 4,
    currentStreak: 2,
    weeklyTrend: -3,
    monthlyTrend: 8,
    progressHistory: [
      { date: new Date(Date.now() - 6 * 86400000), value: 45, completed: false },
      { date: new Date(Date.now() - 5 * 86400000), value: 67, completed: false },
      { date: new Date(Date.now() - 4 * 86400000), value: 89, completed: false },
      { date: new Date(Date.now() - 3 * 86400000), value: 100, completed: true },
      { date: new Date(Date.now() - 2 * 86400000), value: 100, completed: true },
      { date: new Date(Date.now() - 1 * 86400000), value: 82, completed: false },
      { date: new Date(), value: 75, completed: false }
    ]
  },
  "steps-goal": {
    completionRate: 45,
    averageProgress: 63,
    bestStreak: 3,
    currentStreak: 1,
    weeklyTrend: 8,
    monthlyTrend: 15,
    progressHistory: [
      { date: new Date(Date.now() - 6 * 86400000), value: 34, completed: false },
      { date: new Date(Date.now() - 5 * 86400000), value: 67, completed: false },
      { date: new Date(Date.now() - 4 * 86400000), value: 78, completed: false },
      { date: new Date(Date.now() - 3 * 86400000), value: 56, completed: false },
      { date: new Date(Date.now() - 2 * 86400000), value: 89, completed: false },
      { date: new Date(Date.now() - 1 * 86400000), value: 100, completed: true },
      { date: new Date(), value: 54, completed: false }
    ]
  }
};
