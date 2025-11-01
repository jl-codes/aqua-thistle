import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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',
  dangerouslyAllowBrowser: true
});

// Fallback responses for when API is unavailable or quota exceeded
const FALLBACK_RESPONSES = [
  "💰 I see you're asking about budgeting! With your current expenses of $1,576 vs income of $1,200, let's focus on cutting $200-300/month. Try meal prepping (saves $100+) and reviewing subscriptions. Want me to help create a specific plan?",
  
  "🎯 Great question! Based on your goals, I'd recommend focusing on your ABC certification first - you're so close at 1,200/1,600! Then we can tackle that savings goal together. What specific area would you like help with?",
  
  "📊 I'm here to help you succeed, Suzy! While I'm having connection issues, here's what I know works: break big goals into small daily actions, track your progress, and celebrate wins. What's your biggest challenge right now?",
  
  "💪 You're doing amazing managing school, work, and your goals! Remember: progress over perfection. Even small steps toward your $10K savings goal matter. What would help you most right now - budgeting tips or study strategies?"
];

function getFallbackResponse(): string {
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

export async function generateChatResponse(message: string, context?: any): Promise<string> {
  // Try OpenAI with retry logic for quota/rate limit errors
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are StudyBot, a friendly AI mentor for GenZ users helping them make better life decisions. You're helping Suzy with her ABC Certification preparation and overall life goals including budgeting and personal development. 

Current user context:
- Name: Suzy
- Study Progress: ABC Certification (scored 1,200/1,600 on last exam)
- Budget: $1,576 used of $2,000 monthly budget
- Goals: Tracking calories (85%), money (75%), and steps (54%)
- Savings: 68% toward monthly goal

Be encouraging, use emojis appropriately, keep responses concise and actionable. Focus on long-term well-being and provide specific, personalized advice based on the user's current progress.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || getFallbackResponse();
      
    } catch (error: any) {
      console.log(`OpenAI attempt ${attempt + 1} failed:`, error.message);
      
      // Handle quota exceeded and rate limit errors specifically
      if (error.status === 429 || (error.message && error.message.includes('quota'))) {
        console.log('API quota exceeded, using fallback response');
        if (attempt < 2) {
          // Wait with exponential backoff before retry
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
        // After retries, use fallback
        return getFallbackResponse();
      }
      
      // For other errors, fall back immediately
      break;
    }
  }
  
  // If all attempts fail, use fallback
  console.log('Using fallback response due to API issues');
  return getFallbackResponse();
}

export function generateQuickSuggestions(currentContext: string): string[] {
  const baseSuggestions = [
    "📊 Analyze my last exam",
    "💰 How can I improve my scores?",
    "😊 How am I doing now?",
    "📝 Come up with similar questions",
    "🚗 Want to cut down on transportation costs.",
    "📚 Give me practice questions"
  ];
  
  // Return 3-4 contextually relevant suggestions
  return baseSuggestions.slice(0, 4);
}
