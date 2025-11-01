// Removed OpenAI client - all AI calls now go through secure backend API
import { UserProfile } from '@/types';

// Extended user profile with additional AI analysis data
export interface ExtendedUserProfile extends UserProfile {
  age: number;
  bankBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  studentLoans: number;
  currentGoals: string[];
  challenges: string[];
  personality: string[];
}

export const SUZY_PROFILE: ExtendedUserProfile = {
  name: "Suzy",
  age: 22,
  bankBalance: 2847,
  monthlyIncome: 1200,
  monthlyExpenses: 1576,
  studentLoans: 23000,
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
      lastCompleted: new Date(Date.now() - 86400000),
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
  budget: {
    current: 1576,
    total: 2000,
    categories: [
      { name: "Savings", color: "#374151", amount: 630, percentage: 40 },
      { name: "Food", color: "#6B7280", amount: 472, percentage: 30 },
      { name: "Leisure", color: "#D1D5DB", amount: 474, percentage: 30 }
    ]
  },
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
  },
  currentGoals: [
    "Graduate with honors",
    "Land Program Manager role",
    "Save $10k by graduation",
    "Build emergency fund"
  ],
  challenges: [
    "Student loan debt",
    "Living expenses exceeding income",
    "Social pressure to spend",
    "Time management between work and study"
  ],
  personality: [
    "Motivated but sometimes overwhelmed",
    "Values experiences over material goods",
    "Seeks work-life balance",
    "Responds well to structured advice"
  ]
};

// Advanced AI analysis functions
export function analyzeUserPerformance(userProfile: UserProfile): {
  insights: string[];
  recommendations: string[];
  focusAreas: string[];
  motivationalMessage: string;
} {
  const { studyProgress } = userProfile;
  const currentScore = studyProgress.score;
  const targetScore = studyProgress.scoreTarget;
  const progressPercentage = (currentScore / targetScore) * 100;
  
  const insights = [];
  const recommendations = [];
  const focusAreas = [];
  
  // Performance analysis
  if (progressPercentage < 60) {
    insights.push("Significant improvement needed across multiple areas");
    recommendations.push("Focus on fundamentals and consistent daily practice");
    focusAreas.push("Foundation building", "Time management");
  } else if (progressPercentage < 75) {
    insights.push("Good progress but rushing through questions near the end");
    recommendations.push("Practice time management and question pacing strategies");
    focusAreas.push("Pacing strategies", "Accuracy over speed");
  } else if (progressPercentage < 85) {
    insights.push("Strong foundation with room for strategic improvements");
    recommendations.push("Target specific weak areas and practice advanced techniques");
    focusAreas.push("Advanced strategies", "Weak area targeting");
  } else {
    insights.push("Excellent progress with fine-tuning opportunities");
    recommendations.push("Maintain consistency and polish advanced techniques");
    focusAreas.push("Consistency", "Advanced optimization");
  }
  
  // Generate motivational message based on current state
  let motivationalMessage = "";
  if (progressPercentage >= 75) {
    motivationalMessage = `Looks like you're rushing questions near the end. Maybe by practicing the fundamentals, you can save time up front?`;
  } else if (progressPercentage >= 60) {
    motivationalMessage = `You're making good progress! Focus on building a stronger foundation in your weaker areas.`;
  } else {
    motivationalMessage = `Don't get discouraged - every expert was once a beginner. Let's build your confidence with targeted practice.`;
  }
  
  return { insights, recommendations, focusAreas, motivationalMessage };
}

export function generateDynamicAnalytics(userProfile: UserProfile): {
  breakdown: Array<{ name: string; value: number; percentage: number; color: string }>;
  insights: string[];
  suggestions: string[];
} {
  const { studyProgress } = userProfile;
  const currentScore = studyProgress.score;
  
  // Dynamic breakdown based on typical test performance patterns
  const baseBreakdown = [
    { name: "Reading", basePercentage: 35, color: "#374151" },
    { name: "Writing", basePercentage: 25, color: "#6B7280" },
    { name: "Reasoning", basePercentage: 20, color: "#9CA3AF" },
    { name: "Algebra", basePercentage: 12, color: "#D1D5DB" },
    { name: "Geometry", basePercentage: 8, color: "#E5E7EB" }
  ];
  
  // Calculate scores with some variation based on current performance
  const performanceMultiplier = currentScore / 1600;
  const breakdown = baseBreakdown.map(area => {
    const adjustedScore = Math.round(area.basePercentage * currentScore * performanceMultiplier / 100);
    return {
      name: area.name,
      value: adjustedScore,
      percentage: Math.round((adjustedScore / currentScore) * 100),
      color: area.color
    };
  });
  
  // Generate dynamic insights based on performance
  const insights = [];
  const suggestions = [];
  
  const readingScore = breakdown[0].value;
  const writingScore = breakdown[1].value;
  
  if (readingScore > writingScore * 1.2) {
    insights.push("✅ Reading score is your strongest area");
    suggestions.push("Leverage reading skills to improve writing comprehension");
  } else if (writingScore > readingScore * 1.2) {
    insights.push("✅ Writing skills are developing well");
    suggestions.push("Apply writing structure techniques to reading analysis");
  }
  
  if (currentScore >= 1200) {
    insights.push(`✅ Your expected range is ${Math.round(currentScore * 0.96)} to ${Math.round(currentScore * 1.1)}`);
  }
  
  if (currentScore < 1300) {
    suggestions.push("Focus on accuracy before speed to improve overall performance");
    suggestions.push("Review fundamentals in your weakest areas");
  }
  
  return { breakdown, insights, suggestions };
}

// Context-aware system prompts with AI analysis integration
export const SYSTEM_PROMPTS = {
  financial: `You are StudyBot, Suzy's personal AI financial advisor with access to her complete profile and behavioral patterns.

SUZY'S COMPLETE PROFILE:
- Bank Balance: $2,847
- Monthly Income: $1,200 (part-time job) 
- Monthly Expenses: $1,576 (living beyond means - deficit of $376/month)
- Student Loans: $23,000
- Savings Goal: $10,000 by graduation
- Study Performance: ABC Certification (1,200/1,600 - 75% complete)
- Time Management: Struggles with rushing, needs better pacing strategies

As an intelligent AI coach, analyze her patterns and provide:
1. Data-driven budget impact analysis with specific percentages
2. Personalized alternatives based on her spending patterns
3. Long-term financial projections tied to her career goals
4. Actionable next steps that consider her time constraints as a student

Be encouraging, use appropriate emojis, and make connections between her academic performance patterns and financial habits.`,

  career: `You are StudyBot, Suzy's intelligent AI career strategist with deep insight into her academic performance and personality.

COMPREHENSIVE SUZY ANALYSIS:
- Academic Performance: 1,200/1,600 on ABC Certification (shows strong ability but rushes under pressure)
- Goal: Program Manager role (requires strong organizational and analytical skills)
- Strengths: Goal-oriented, motivated, shows 75% competency in structured assessments
- Growth Areas: Time management, pacing strategies, pressure management
- Financial Context: $23K student debt, needs income quickly after graduation

Provide AI-powered career guidance that:
- Connects her test-taking patterns to workplace skills (pacing = project management)
- Suggests skill development based on her learning style
- Recommends networking strategies that fit her personality
- Provides salary negotiation advice considering her financial pressure
- Offers timeline-based action plans that work with her study schedule

Reference her specific performance data to make personalized recommendations.`,

  lifestyle: `You are StudyBot, Suzy's AI life coach with comprehensive understanding of her behavioral patterns and life situation.

BEHAVIORAL ANALYSIS:
- Academic Pattern: High performer who rushes under pressure (1,200/1,600 score)
- Financial Stress: Living beyond means ($376 monthly deficit)
- Personality: Motivated but sometimes overwhelmed, values structure
- Social Context: College senior facing transition pressure
- Time Management: Struggles with pacing in high-stakes situations

Provide intelligent life coaching that:
- Connects her academic pacing issues to life decision-making patterns
- Helps her manage social pressure around spending with data-driven arguments
- Provides decision frameworks that work for someone who excels but rushes
- Addresses overwhelm with personalized coping strategies
- Balances her desire for experiences with financial reality

Use her performance data to illustrate points and provide evidence-based advice.`,

  study: `You are StudyBot, Suzy's advanced AI academic coach with deep analysis of her learning patterns and performance data.

PERFORMANCE DATA ANALYSIS:
- Current Score: 1,200/1,600 (75% - strong foundation, optimization needed)
- Pattern Recognition: Shows competency but likely rushing through questions near the end
- Strengths: Solid understanding of fundamentals, goal-oriented approach
- Growth Opportunities: Time management, question pacing, pressure performance
- Context: Financial pressure, part-time work, senior year stress

Provide AI-driven study coaching that:
- Analyzes her specific performance patterns to identify improvement strategies
- Connects her rushing tendency to actionable pacing techniques
- Provides personalized practice recommendations based on her score distribution
- Suggests time management strategies that work with her work schedule
- Offers evidence-based study methods that address her specific challenges

Generate dynamic insights about her performance and provide targeted recommendations that evolve based on her progress patterns.`
};

// Comprehensive fallback responses for when OpenAI is unavailable
export const FALLBACK_RESPONSES = {
  financial: {
    budgeting: [
      "💰 Let's look at your budget, Suzy! With $1,200 income and $1,576 expenses, you're spending $376 more than you earn each month. Here's my suggestion:\n\n1️⃣ Track every expense for one week\n2️⃣ Identify your top 3 variable expenses\n3️⃣ Cut 10% from each category\n\nThis could save you ~$120/month. Want me to help you create a specific plan?",
      
      "📊 Budget reality check: You're currently spending 131% of your income. That's unsustainable long-term. Here's a quick fix:\n\n• Food: Aim for $300/month (meal prep saves $100+)\n• Entertainment: Set a $150 limit\n• Transportation: Look into student discounts\n\nThese changes alone could save $150/month. Ready to dive deeper?"
    ],
    
    savings: [
      "🎯 Your $10K savings goal is ambitious but achievable! Here's a realistic timeline:\n\n• Current deficit: -$376/month\n• First: Balance your budget (see my budgeting tips)\n• Then: Save $200/month = $10K in 4 years\n\nStart small: Even $25/month builds the savings habit. Want a personalized savings plan?",
      
      "💡 Smart savings strategy for your situation:\n\n1️⃣ Emergency fund first: $1,000\n2️⃣ High-interest debt next (if any)\n3️⃣ Then your $10K goal\n\nWith your current expenses, let's focus on cutting $200/month first. That alone puts you on track for your goal!"
    ],
    
    debt: [
      "📚 Your $23K student loans need a strategy! Here's what I recommend:\n\n• Don't panic - this is normal for your generation\n• Focus on federal loan benefits (income-driven repayment)\n• Pay minimums until you're financially stable\n• Then tackle highest interest rates first\n\nYour priority: Get that budget balanced before attacking debt aggressively.",
      
      "💪 Student loan game plan:\n\n1️⃣ Know your interest rates\n2️⃣ Set up auto-pay (often saves 0.25%)\n3️⃣ Pay extra toward principal when possible\n4️⃣ Don't sacrifice emergency fund for loans\n\nWith discipline, you could save thousands in interest. Want help calculating payment strategies?"
    ]
  },
  
  career: {
    jobSearch: [
      "🚀 Program Manager role hunting? Here's your action plan:\n\n1️⃣ Build your project portfolio (even class projects count!)\n2️⃣ Network on LinkedIn - connect with 5 PMs this week\n3️⃣ Practice the STAR method for interviews\n4️⃣ Research salary ranges ($65-85K entry level)\n\nStart applying 3-6 months before graduation. Want help with your LinkedIn profile?",
      
      "💼 PM job search strategy:\n\n• Skills to highlight: Organization, communication, analytics\n• Companies to target: Tech startups, consulting firms, Fortune 500\n• Application timeline: Start NOW (senior year is perfect)\n• Interview prep: Have 5 solid project examples ready\n\nThe job market is competitive but PMs are in demand. You've got this! 💪"
    ],
    
    skills: [
      "📈 PM skill development roadmap:\n\n🔥 MUST HAVES:\n• Project management tools (Asana, Jira)\n• Data analysis basics (Excel, Google Analytics)\n• Agile methodology understanding\n\n💡 NICE TO HAVE:\n• SQL basics\n• Design thinking\n• Public speaking\n\nFocus on 2-3 skills this semester. Many are free to learn online!",
      
      "🎯 Skills that'll make you stand out:\n\n• Certification: Google Project Management (free!)\n• Technical: Learn basic SQL and APIs\n• Soft skills: Cross-functional communication\n• Industry knowledge: Pick one sector to specialize\n\nSpend 5 hours/week skill building. In 3 months, you'll be way ahead of other candidates!"
    ]
  },
  
  lifestyle: {
    social: [
      "👫 Friend pressure about spending? I get it! Here's how to handle it:\n\n💬 BE HONEST: 'I'm saving for my future right now'\n💡 SUGGEST ALTERNATIVES: Free events, potlucks, group discounts\n🎯 SET BOUNDARIES: 'My entertainment budget is $150/month'\n\nTrue friends will understand and support your goals. You're being smart!",
      
      "🤝 Social life on a budget tips:\n\n• Host game nights instead of going out\n• Find free campus events and activities\n• Suggest coffee dates over expensive dinners\n• Use student discounts everywhere\n• Plan affordable group activities\n\nYou can maintain friendships without breaking the bank. Quality time > expensive activities!"
    ],
    
    decisions: [
      "🤔 Big decision coming up? Use my decision framework:\n\n1️⃣ CLARIFY: What exactly are you deciding?\n2️⃣ COSTS: Financial and opportunity costs\n3️⃣ VALUES: Does this align with your goals?\n4️⃣ TIMING: Is this the right time?\n5️⃣ ALTERNATIVES: What are 3 other options?\n\nTake time to think. Rushed decisions often cost more later!",
      
      "⚖️ Decision-making when you're overwhelmed:\n\n• Write it out - brain dump all factors\n• Sleep on it - don't decide when stressed\n• Ask: 'What would I tell my best friend?'\n• Consider the 10-10-10 rule: How will I feel in 10 minutes, 10 months, 10 years?\n\nYour gut usually knows. Trust yourself! 💪"
    ]
  }
};

// Detect conversation context/category
export function detectContext(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.includes('budget') || msg.includes('money') || msg.includes('save') || msg.includes('spend') || msg.includes('cost') || msg.includes('debt') || msg.includes('loan')) {
    return 'financial';
  }
  
  if (msg.includes('job') || msg.includes('career') || msg.includes('interview') || msg.includes('resume') || msg.includes('work') || msg.includes('salary')) {
    return 'career';
  }
  
  if (msg.includes('study') || msg.includes('exam') || msg.includes('grade') || msg.includes('test') || msg.includes('school') || msg.includes('college')) {
    return 'study';
  }
  
  if (msg.includes('friend') || msg.includes('relationship') || msg.includes('social') || msg.includes('decision') || msg.includes('stress')) {
    return 'lifestyle';
  }
  
  return 'financial'; // Default to financial advice
}

// Get appropriate fallback response
export function getFallbackResponse(context: string, message: string): string {
  const msg = message.toLowerCase();
  
  // More specific matching within context
  if (context === 'financial') {
    const financialResponses = FALLBACK_RESPONSES.financial;
    if (msg.includes('save') || msg.includes('saving')) {
      return financialResponses.savings[Math.floor(Math.random() * financialResponses.savings.length)];
    }
    if (msg.includes('budget')) {
      return financialResponses.budgeting[Math.floor(Math.random() * financialResponses.budgeting.length)];
    }
    if (msg.includes('debt') || msg.includes('loan')) {
      return financialResponses.debt[Math.floor(Math.random() * financialResponses.debt.length)];
    }
    return financialResponses.budgeting[0]; // Default to budgeting
  }
  
  if (context === 'career') {
    const careerResponses = FALLBACK_RESPONSES.career;
    if (msg.includes('skill')) {
      return careerResponses.skills[Math.floor(Math.random() * careerResponses.skills.length)];
    }
    return careerResponses.jobSearch[Math.floor(Math.random() * careerResponses.jobSearch.length)];
  }
  
  if (context === 'lifestyle') {
    const lifestyleResponses = FALLBACK_RESPONSES.lifestyle;
    if (msg.includes('friend') || msg.includes('social')) {
      return lifestyleResponses.social[Math.floor(Math.random() * lifestyleResponses.social.length)];
    }
    return lifestyleResponses.decisions[Math.floor(Math.random() * lifestyleResponses.decisions.length)];
  }
  
  return "I'm here to help you make smart decisions! What's on your mind? 😊";
}

// Generate dynamic system prompt from real user context
function buildDynamicSystemPrompt(message: string, context: any): string {
  const detectedContext = detectContext(message);
  
  // Handle unusual/unclear input gracefully
  if (message.trim().length < 3 || !/[a-zA-Z]/.test(message)) {
    return `You are StudyBot, Suzy's personal AI assistant. The user sent an unclear message: "${message}". 
    
Respond helpfully by:
1. Acknowledging you don't understand the input
2. Asking for clarification
3. Suggesting what kinds of questions you can help with (financial advice, career guidance, study tips, life decisions)
4. Keep it friendly and encouraging

Current context about Suzy:
- Bank Balance: $${context?.bankBalance || 2847}
- Monthly Income: $${context?.monthlyIncome || 1200}  
- Monthly Expenses: $${context?.monthlyExpenses || 1576}
- Study Score: ${context?.studyProgress?.score || 1200}/${context?.studyProgress?.scoreTarget || 1600}`;
  }

  // Build context-specific prompts with real data
  const baseInfo = `
SUZY'S CURRENT DATA:
- Bank Balance: $${context?.bankBalance || 2847}
- Monthly Income: $${context?.monthlyIncome || 1200}
- Monthly Expenses: $${context?.monthlyExpenses || 1576}
- Monthly Deficit: $${(context?.monthlyExpenses || 1576) - (context?.monthlyIncome || 1200)}
- Student Loans: $${context?.studentLoans || 23000}
- Study Progress: ${context?.studyProgress?.score || 1200}/${context?.studyProgress?.scoreTarget || 1600} (${Math.round(((context?.studyProgress?.score || 1200) / (context?.studyProgress?.scoreTarget || 1600)) * 100)}%)
- Recent Topics: ${context?.recentTopics?.join(', ') || 'None'}

CONVERSATION HISTORY:
${context?.conversationHistory || 'No previous conversation'}`;

  switch (detectedContext) {
    case 'financial':
      return `You are StudyBot, Suzy's personal AI financial advisor with access to her real-time financial data.

${baseInfo}

FINANCIAL ANALYSIS:
- Current monthly deficit: $${(context?.monthlyExpenses || 1576) - (context?.monthlyIncome || 1200)}
- Living beyond means by ${Math.round((((context?.monthlyExpenses || 1576) - (context?.monthlyIncome || 1200)) / (context?.monthlyIncome || 1200)) * 100)}%
- Debt-to-income ratio: ${Math.round(((context?.studentLoans || 23000) / ((context?.monthlyIncome || 1200) * 12)) * 100)}%

Provide specific, actionable financial advice based on her ACTUAL numbers. Include:
1. Budget impact analysis using her real income/expenses
2. Specific dollar amounts and percentages
3. Personalized alternatives based on her spending patterns
4. Next steps that consider her student status and time constraints

Be encouraging, use emojis, and reference her actual financial situation.`;

    case 'career':
      return `You are StudyBot, Suzy's intelligent AI career coach with insight into her academic performance and financial pressures.

${baseInfo}

CAREER CONTEXT:
- Goal: Program Manager role after graduation
- Academic Performance: Shows ${Math.round(((context?.studyProgress?.score || 1200) / (context?.studyProgress?.scoreTarget || 1600)) * 100)}% competency (strong but may rush under pressure)
- Financial Pressure: Needs income quickly due to $${context?.monthlyExpenses - context?.monthlyIncome || 376}/month deficit
- Student Debt: $${context?.studentLoans || 23000} requires strategic career planning

Provide career guidance that:
- References her specific academic performance (${context?.studyProgress?.score || 1200}/1600 score)
- Considers her financial timeline and debt load
- Connects her test-taking patterns to workplace skills
- Provides realistic salary expectations for her debt situation
- Offers concrete next steps with timelines

Use her actual performance data to make personalized recommendations.`;

    case 'study':
      return `You are StudyBot, Suzy's AI academic coach analyzing her learning patterns and performance.

${baseInfo}

STUDY PERFORMANCE ANALYSIS:
- Current Score: ${context?.studyProgress?.score || 1200}/${context?.studyProgress?.scoreTarget || 1600} (${Math.round(((context?.studyProgress?.score || 1200) / (context?.studyProgress?.scoreTarget || 1600)) * 100)}%)
- Performance Pattern: ${((context?.studyProgress?.score || 1200) / (context?.studyProgress?.scoreTarget || 1600)) >= 0.75 ? 'Strong foundation but may rush through questions' : 'Needs improvement across multiple areas'}
- Financial Context: $${Math.abs((context?.monthlyExpenses || 1576) - (context?.monthlyIncome || 1200))}/month ${(context?.monthlyExpenses || 1576) > (context?.monthlyIncome || 1200) ? 'deficit' : 'surplus'} affects study stress
- Work Balance: Part-time job limits study time

Provide study coaching that:
- Analyzes her specific ${context?.studyProgress?.score || 1200}/1600 performance
- Addresses time management with work constraints  
- Connects financial stress to academic performance
- Offers evidence-based study strategies for her score level
- Provides realistic improvement timelines

Generate insights based on her actual performance data.`;

    case 'lifestyle':
      return `You are StudyBot, Suzy's AI life coach understanding her behavioral patterns and pressures.

${baseInfo}

LIFESTYLE ANALYSIS:
- Financial Stress: $${Math.abs((context?.monthlyExpenses || 1576) - (context?.monthlyIncome || 1200))}/month deficit creates decision pressure
- Academic Pattern: ${Math.round(((context?.studyProgress?.score || 1200) / (context?.studyProgress?.scoreTarget || 1600)) * 100)}% performer who may rush under pressure
- Life Stage: College senior facing transition with $${context?.studentLoans || 23000} debt load
- Social Context: Financial constraints impact social decisions

Provide life coaching that:
- Connects her academic pacing issues (rushing) to life decision-making
- Addresses social pressure around spending with her actual budget numbers
- Helps manage overwhelm using her personality traits
- Provides decision frameworks for someone with financial constraints
- References her actual income/expenses in advice

Use her performance data and financial reality to provide grounded advice.`;

    default:
      return `You are StudyBot, Suzy's comprehensive AI assistant with access to her complete profile.

${baseInfo}

Provide helpful guidance based on her actual situation. Be encouraging, specific, and reference her real data when relevant.`;
  }
}

// All AI calls now go through secure backend - this function removed for security
// Frontend uses EventSource to connect to FastAPI backend for real AI responses

// Generate intelligent fallback using actual user context
function generateContextAwareFallback(message: string, context: any): string {
  const detectedContext = detectContext(message);
  const monthlyDeficit = (context?.monthlyExpenses || 1576) - (context?.monthlyIncome || 1200);
  const studyScore = context?.studyProgress?.score || 1200;
  const studyTarget = context?.studyProgress?.scoreTarget || 1600;
  const studyPercentage = Math.round((studyScore / studyTarget) * 100);

  // Handle unclear input contextually
  if (message.trim().length < 3 || !/[a-zA-Z]/.test(message)) {
    return `I didn't quite understand "${message}" 🤔 

Let me help you with something specific! I can assist with:

💰 **Financial advice** - You currently have a $${Math.abs(monthlyDeficit)}/month ${monthlyDeficit > 0 ? 'deficit' : 'surplus'}
📚 **Study coaching** - Your current score is ${studyScore}/${studyTarget} (${studyPercentage}%)
🚀 **Career planning** - Landing that Program Manager role
🎯 **Life decisions** - Making smart choices for your future

What would you like to talk about? 😊`;
  }

  // Use context-aware responses based on user's actual data
  switch (detectedContext) {
    case 'financial':
      return `💰 I see you're asking about finances! Here's what I know about your current situation:

**Your Numbers:**
- Monthly Income: $${context?.monthlyIncome || 1200}
- Monthly Expenses: $${context?.monthlyExpenses || 1576}
- Current Deficit: $${monthlyDeficit}
- Student Loans: $${context?.studentLoans || 23000}

This $${monthlyDeficit}/month deficit needs attention! Let's work on creating a sustainable budget that gets you back on track. What specific area would you like to focus on first?`;

    case 'career':
      return `🚀 Career planning time! Based on your profile:

**Your Situation:**
- Goal: Program Manager role
- Academic Performance: ${studyPercentage}% (strong foundation!)
- Financial Pressure: Need income due to $${monthlyDeficit}/month deficit
- Debt Load: $${context?.studentLoans || 23000} in student loans

Your ${studyScore}/1600 score shows you have solid analytical skills - perfect for PM roles! Let's create a strategic plan to land that position. What aspect interests you most?`;

    case 'study':
      return `📚 Let's boost your academic performance! Current stats:

**Performance Analysis:**
- Current Score: ${studyScore}/${studyTarget} (${studyPercentage}%)
- Pattern: ${studyPercentage >= 75 ? 'Strong performer who may rush under pressure' : 'Room for improvement with focused practice'}
- Context: Balancing studies with $${monthlyDeficit}/month financial pressure

Your score shows ${studyPercentage >= 75 ? 'excellent potential - let\'s optimize your approach!' : 'great opportunity for growth!'} What study area would you like to focus on?`;

    default:
      return `I'm here to help with whatever's on your mind! Based on your current situation:

- **Financially:** ${monthlyDeficit > 0 ? `Working on that $${monthlyDeficit}/month deficit` : `You're doing great financially!`}
- **Academically:** ${studyPercentage}% performance on your certification
- **Career-wise:** Preparing for that Program Manager role

What would you like to discuss? I'm here to provide personalized advice based on your real situation! 😊`;
  }
}

// Generate context-aware suggestions
export function generateContextualSuggestions(message: string, context: string): string[] {
  const baseFinancial = [
    "💰 How can I cut my expenses by $200?",
    "📊 Show me my spending breakdown",
    "🎯 Create a savings plan for me",
    "💡 What should I budget for rent?"
  ];
  
  const baseCareer = [
    "🚀 How do I land a PM role?",
    "📈 What skills should I develop?",
    "💼 Help me with interview prep",
    "💰 What salary should I expect?"
  ];
  
  const baseLifestyle = [
    "🤔 Help me make this decision",
    "👫 How do I handle friend pressure?",
    "⚖️ What are my options here?",
    "🎯 How do I prioritize my goals?"
  ];
  
  const baseStudy = [
    "📚 Create a study schedule",
    "🎯 How can I improve my scores?",
    "⏰ Help me manage my time",
    "💪 How do I stay motivated?"
  ];
  
  switch (context) {
    case 'financial': return baseFinancial;
    case 'career': return baseCareer;
    case 'lifestyle': return baseLifestyle;
    case 'study': return baseStudy;
    default: return baseFinancial;
  }
}
