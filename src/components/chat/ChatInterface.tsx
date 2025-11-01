"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { mockUserProfile, mockChatMessages, studyAnalytics, quickSuggestions, categoryData } from "@/lib/mock-data";
import { 
  generateContextualSuggestions, 
  detectContext, 
  SUZY_PROFILE, 
  getFallbackResponse,
  analyzeUserPerformance,
  generateDynamicAnalytics 
} from "@/lib/enhanced-openai";
import { ArrowLeft, Menu, Mic } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { MessageRenderer } from "./MessageRenderer";
import { StreamingMessageRenderer } from "./StreamingMessageRenderer";
import { useSearchParams } from "next/navigation";

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  showAnalytics?: boolean;
  context?: string;
  budgetImpact?: {
    amount: number;
    percentage: number;
    category: string;
  };
}

interface ConversationMemory {
  topics: string[];
  decisions: string[];
  goals: string[];
  lastContext: string;
}

export function ChatInterface() {
  const user = mockUserProfile;
  const searchParams = useSearchParams();
  
  // Get category and message from URL parameters
  const categoryParam = searchParams.get('category');
  const messageParam = searchParams.get('message');
  const actionParam = searchParams.get('action');
  
  // Find category data
  const selectedCategory = categoryParam ? categoryData.find(cat => cat.id === categoryParam) : null;
  
  // Generate category-specific greeting
  const getCategoryGreeting = () => {
    if (!selectedCategory) {
      return {
        icon: "👋",
        greeting: "Hey Suzy! 👋 What's on your mind today?",
        context: "I'm here to help with anything - your finances, studies, or just life stuff! What would you like to chat about?",
        suggestions: ["💰 Help with my budget", "📚 Study assistance", "🎯 Set some goals"]
      };
    }

    const greetings = {
      finance: {
        icon: "💰",
        greeting: "Let's get your money right, Suzy! 💪",
        context: "I see you're dealing with that $376 deficit - no judgment here! We're gonna figure this out together and get you living your best financially stable life ✨",
        suggestions: selectedCategory.suggestions
      },
      education: {
        icon: "📚", 
        greeting: "Study mode activated! 🤓✨",
        context: "That 1200 score is solid progress, but I know you're hungry for more! Let's get you to that 1400+ and secure the bag with a better starting salary 💯",
        suggestions: selectedCategory.suggestions
      },
      family: {
        icon: "👨‍👩‍👧",
        greeting: "Family first! 💕",
        context: "Balancing family goals with your budget is REAL. Let's make sure you can enjoy family time without the financial stress - you deserve both! 🥰",
        suggestions: selectedCategory.suggestions
      },
      friends: {
        icon: "👥",
        greeting: "Friend drama? Been there! 😅",
        context: "Social spending hits different when you're on a budget. Let's figure out how to keep your friendships strong without going broke - it's totally doable! 💫",
        suggestions: selectedCategory.suggestions
      },
      weekend: {
        icon: "🏖️", 
        greeting: "Weekend vibes incoming! 🌟",
        context: "Self-care and fun are NOT luxuries - they're necessities! Let's plan some amazing experiences that won't destroy your budget 🎉",
        suggestions: selectedCategory.suggestions
      }
    };

    return greetings[selectedCategory.id as keyof typeof greetings] || greetings.finance;
  };

  const categoryGreeting = getCategoryGreeting();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `${categoryGreeting.icon} ${categoryGreeting.greeting}\n\n${categoryGreeting.context}`,
      type: "assistant",
      timestamp: new Date(),
      showAnalytics: false,
      context: selectedCategory?.id
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState(
    generateContextualSuggestions("", "financial") // Start with financial context
  );
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [conversationMemory, setConversationMemory] = useState<ConversationMemory>({
    topics: [],
    decisions: [],
    goals: [],
    lastContext: 'financial'
  });
  const [error, setError] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState<{
    id: string;
    eventSource: EventSource | null;
    isComplete: boolean;
  } | null>(null);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calculate budget impact for financial decisions
  const calculateBudgetImpact = (message: string, amount?: number): { amount: number; percentage: number; category: string } | null => {
    const msg = message.toLowerCase();
    let estimatedAmount = amount || 0;
    
    // Extract amounts from message using regex
    const amountMatch = message.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (amountMatch && !amount) {
      estimatedAmount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }
    
    // Estimate costs for common scenarios if no amount found
    if (!estimatedAmount) {
      if (msg.includes('car') || msg.includes('vehicle')) estimatedAmount = 300; // monthly car payment
      if (msg.includes('trip') || msg.includes('vacation')) estimatedAmount = 800;
      if (msg.includes('apartment') || msg.includes('rent')) estimatedAmount = 1200;
      if (msg.includes('dinner') || msg.includes('restaurant')) estimatedAmount = 50;
      if (msg.includes('coffee') || msg.includes('starbucks')) estimatedAmount = 5;
      if (msg.includes('shopping') || msg.includes('clothes')) estimatedAmount = 150;
    }
    
    if (estimatedAmount > 0) {
      const percentage = (estimatedAmount / SUZY_PROFILE.monthlyIncome) * 100;
      let category = 'Other';
      
      if (msg.includes('food') || msg.includes('restaurant') || msg.includes('dinner')) category = 'Food';
      if (msg.includes('transport') || msg.includes('car') || msg.includes('uber')) category = 'Transportation';
      if (msg.includes('rent') || msg.includes('apartment') || msg.includes('housing')) category = 'Housing';
      if (msg.includes('entertainment') || msg.includes('movie') || msg.includes('fun')) category = 'Entertainment';
      
      return { amount: estimatedAmount, percentage: Math.round(percentage), category };
    }
    
    return null;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-submit message from URL parameter
  useEffect(() => {
    if (messageParam && messageParam.trim() && !hasAutoSubmitted) {
      setInputValue(messageParam);
      setHasAutoSubmitted(true);
      // Auto-submit the message immediately
      handleSendMessage(messageParam);
    }
  }, [messageParam, hasAutoSubmitted]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Clear any previous errors
    setError(null);
    
    // Detect context and calculate budget impact
    const context = detectContext(text);
    const budgetImpact = context === 'financial' ? calculateBudgetImpact(text) : null;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      type: 'user',
      timestamp: new Date(),
      context: context,
      budgetImpact: budgetImpact || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Update conversation memory
    setConversationMemory(prev => ({
      ...prev,
      topics: [...new Set([...prev.topics, context])], // Add unique contexts
      lastContext: context,
      decisions: text.includes('should I') || text.includes('help me decide') 
        ? [...prev.decisions, text] 
        : prev.decisions,
      goals: text.includes('goal') || text.includes('want to') || text.includes('plan to')
        ? [...prev.goals, text]
        : prev.goals
    }));

    // Check if user wants analytics
    const showAnalyticsResponse = text.toLowerCase().includes('analyze') || text.toLowerCase().includes('exam');
    
    try {
      // Create streaming EventSource connection
      const streamingId = (Date.now() + 1).toString();
      const eventSource = new EventSource(`http://localhost:8001/api/chat/stream?message=${encodeURIComponent(text)}`);
      
      let streamedContent = '';
      
      // Handle successful EventSource connection
      eventSource.onopen = () => {
        console.log('EventSource connection established');
      };
      
      // Handle streaming messages
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'text_chunk') {
            streamedContent += data.content || '';
          } else if (data.type === 'stream_complete') {
            // Stream is complete, create final message
            const assistantMessage: Message = {
              id: streamingId,
              content: streamedContent,
              type: 'assistant',
              timestamp: new Date(),
              showAnalytics: showAnalyticsResponse,
              context: context
            };

            setMessages(prev => [...prev, assistantMessage]);
            setShowAnalytics(showAnalyticsResponse);
            
            // Update suggestions based on context
            setCurrentSuggestions(generateContextualSuggestions(text, context));
            
            // Clean up streaming state
            eventSource.close();
            setStreamingMessage(null);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error parsing streaming data:', error);
        }
      };
      
      // Handle EventSource errors
      eventSource.onerror = (error) => {
        console.error('EventSource connection error:', error);
        eventSource.close();
        
        // Fallback to regular response
        const fallbackResponse = getFallbackResponse(context, text);
        const assistantMessage: Message = {
          id: streamingId,
          content: fallbackResponse,
          type: 'assistant',
          timestamp: new Date(),
          context: context
        };

        setMessages(prev => [...prev, assistantMessage]);
        setCurrentSuggestions(generateContextualSuggestions(text, context));
        setStreamingMessage(null);
        setIsLoading(false);
      };
      
      // Set up streaming state after EventSource is configured
      setStreamingMessage({
        id: streamingId,
        eventSource,
        isComplete: false
      });
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Use direct fallback response instead of trying OpenAI again
      const fallbackResponse = getFallbackResponse(context, text);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponse,
        type: 'assistant',
        timestamp: new Date(),
        context: context
      };

      setMessages(prev => [...prev, assistantMessage]);
      setError(null); // Clear error since we successfully provided a response
      
      // Still update suggestions
      setCurrentSuggestions(generateContextualSuggestions(text, context));
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-2 flex items-center justify-between border-b sticky top-0 z-10">
        <div className="text-lg font-semibold">9:41</div>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
          </div>
          <div className="text-sm">📶</div>
          <div className="text-sm">📶</div>
          <div className="w-6 h-3 bg-black rounded-sm"></div>
        </div>
      </div>

      {/* Chat Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">StudyBot</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Study Progress Header */}
      <Card className="mx-4 mt-4 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{user.studyProgress.subject}</h3>
          <Button variant="link" className="p-0 text-sm text-gray-500">
            See more
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Goals</span>
            <span className="font-medium">{user.studyProgress.goals.toLocaleString()}</span>
            <span className="text-gray-500">{user.studyProgress.goalTarget.toLocaleString()}</span>
          </div>
          <Progress value={(user.studyProgress.goals / user.studyProgress.goalTarget) * 100} className="h-2" />
          
          <div className="flex items-center justify-between text-sm">
            <span>Score</span>
            <span className="font-medium">{user.studyProgress.score.toLocaleString()}</span>
            <span className="text-gray-500">{user.studyProgress.scoreTarget.toLocaleString()}</span>
          </div>
          <Progress value={(user.studyProgress.score / user.studyProgress.scoreTarget) * 100} className="h-2" />
        </div>
      </Card>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="space-y-3">
            {message.type === 'assistant' && (
              <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                <MessageRenderer content={message.content} />
                
                {message.showAnalytics && (() => {
                  // Generate dynamic analytics based on user data
                  const dynamicAnalytics = generateDynamicAnalytics(user);
                  
                  return (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-32 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={dynamicAnalytics.breakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={60}
                                dataKey="value"
                              >
                                {dynamicAnalytics.breakdown.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-lg font-bold text-gray-800">#9</div>
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-1 text-sm">
                          {dynamicAnalytics.breakdown.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: item.color }}
                                ></div>
                                <span className="font-medium">{item.name}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{item.value} ({item.percentage}%)</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-1">
                        <div className="font-semibold text-sm mb-2">Analysis</div>
                        {dynamicAnalytics.insights.map((insight, index) => (
                          <div key={index} className="text-sm text-green-600 flex items-start gap-1">
                            <span className="text-green-500 font-bold">✅</span>
                            <span>{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            
            {message.type === 'user' && (
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs">
                  <div className="text-sm">{message.content}</div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Render streaming message if active */}
        {streamingMessage && (
          <StreamingMessageRenderer
            onEvent={(event) => {
              if (event.type === 'text_chunk') {
                // Handle text streaming
              } else if (event.type === 'stream_complete') {
                // Stream completed - this is handled in the handleSendMessage function
                setStreamingMessage(null);
                setIsLoading(false);
              }
            }}
            eventSource={streamingMessage.eventSource}
            isComplete={streamingMessage.isComplete}
          />
        )}

        {isLoading && !streamingMessage && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Smart Contextual Suggestion Bubble - Based on conversation */}
      <div className="px-4 pb-2">
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="rounded-full text-sm px-6 py-3 bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
            onClick={() => {
              // Smart suggestion based on conversation context
              const lastMessage = messages[messages.length - 1];
              if (lastMessage?.context === 'finance') {
                handleSuggestionClick("What's my next biggest expense to tackle?");
              } else if (lastMessage?.context === 'study') {
                handleSuggestionClick("Help me create a study schedule for 1400+");  
              } else {
                handleSuggestionClick("Want to cut down on transportation costs.");
              }
            }}
          >
            {(() => {
              const lastMessage = messages[messages.length - 1];
              if (lastMessage?.context === 'finance') {
                return "What's my next biggest expense to tackle?";
              } else if (lastMessage?.context === 'study') {
                return "Help me create a study schedule for 1400+";
              } else {
                return "Want to cut down on transportation costs.";
              }
            })()}
          </Button>
        </div>
      </div>

      {/* Suggestions */}
      {currentSuggestions.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {currentSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="rounded-full text-sm px-4 py-2 bg-gray-50"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-gray-900 p-4">
        <div className="relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything :)"
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-full pr-12"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage(inputValue);
              }
            }}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <Mic className="w-5 h-5" />
          </Button>
        </div>
        <div className="w-full h-1 bg-gray-600 rounded-full mt-3"></div>
      </div>
    </div>
  );
}
