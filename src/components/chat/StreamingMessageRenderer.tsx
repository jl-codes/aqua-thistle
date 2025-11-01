"use client";

import { useState, useEffect } from "react";
import { BudgetCard } from "@/components/ui/budget-card";
import { QuestItem } from "@/components/ui/quest-item";
import { MetricBadge } from "@/components/ui/metric-badge";
import { DollarSign, TrendingDown, Target } from "lucide-react";

interface StreamEvent {
  type: 'typing_start' | 'text_chunk' | 'budget_card' | 'quest_items' | 'metric_badges' | 'stream_complete';
  content?: string;
  data?: any;
  fallback?: boolean;
}

interface StreamingMessageRendererProps {
  onEvent: (event: StreamEvent) => void;
  eventSource: EventSource | null;
  isComplete: boolean;
}

interface StreamingState {
  text: string;
  budgetCard?: {
    deficit?: number;
    balance?: number;
    income?: number;
  };
  questItems?: Array<{
    title: string;
    amount: number;
    difficulty: string;
    category: string;
  }>;
  metricBadges?: Array<{
    type: string;
    value: number;
    label: string;
  }>;
  isTyping: boolean;
  isComplete: boolean;
}

export function StreamingMessageRenderer({ 
  onEvent, 
  eventSource, 
  isComplete 
}: StreamingMessageRendererProps) {
  const [streamingState, setStreamingState] = useState<StreamingState>({
    text: "",
    isTyping: false,
    isComplete: false
  });

  useEffect(() => {
    if (!eventSource) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data: StreamEvent = JSON.parse(event.data);
        onEvent(data);

        setStreamingState(prev => {
          const newState = { ...prev };

          switch (data.type) {
            case 'typing_start':
              newState.isTyping = true;
              break;
              
            case 'text_chunk':
              newState.text += data.content || '';
              break;
              
            case 'budget_card':
              newState.budgetCard = data.data;
              break;
              
            case 'quest_items':
              newState.questItems = data.data?.quests || [];
              break;
              
            case 'metric_badges':
              newState.metricBadges = data.data?.metrics || [];
              break;
              
            case 'stream_complete':
              newState.isTyping = false;
              newState.isComplete = true;
              break;
          }

          return newState;
        });
      } catch (error) {
        console.error('Error parsing stream event:', error);
      }
    };

    const handleError = (error: Event) => {
      console.error('EventSource error:', error);
      setStreamingState(prev => ({ ...prev, isTyping: false, isComplete: true }));
    };

    eventSource.addEventListener('message', handleMessage);
    eventSource.addEventListener('error', handleError);

    return () => {
      eventSource.removeEventListener('message', handleMessage);
      eventSource.removeEventListener('error', handleError);
    };
  }, [eventSource, onEvent]);

  const renderStreamingContent = () => {
    const components = [];

    // Render streaming text with typewriter effect
    if (streamingState.text) {
      const lines = streamingState.text.split('\n');
      const processedLines = lines.map((line, index) => {
        // Convert markdown-style headers to styled components
        if (line.startsWith('**') && line.endsWith('**')) {
          const headerText = line.slice(2, -2);
          return (
            <div key={`header-${index}`} className="mb-3 mt-4 first:mt-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                {headerText.toLowerCase().includes('budget') && <DollarSign className="w-4 h-4" />}
                {headerText.toLowerCase().includes('areas') && <Target className="w-4 h-4" />}
                {headerText.toLowerCase().includes('impact') && <TrendingDown className="w-4 h-4" />}
                {headerText}
              </div>
            </div>
          );
        }
        
        // Regular text with emoji and formatting preserved
        if (line.trim()) {
          return (
            <div key={`line-${index}`} className="mb-2 text-gray-700 leading-relaxed">
              {line}
            </div>
          );
        }
        
        return null;
      }).filter(Boolean);

      components.push(
        <div key="text" className="space-y-1">
          {processedLines}
          {streamingState.isTyping && (
            <span className="inline-block w-2 h-5 bg-blue-600 animate-pulse ml-1"></span>
          )}
        </div>
      );
    }

    // Render Budget Card with animation
    if (streamingState.budgetCard) {
      const { deficit, balance, income } = streamingState.budgetCard;
      
      components.push(
        <div key="budget-card" className="mt-4 animate-in slide-in-from-left duration-500">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {deficit && (
              <BudgetCard 
                title="Monthly Deficit" 
                amount={`$${deficit}`}
                status="danger"
                icon={<TrendingDown />}
                description="Living beyond means"
                className="animate-in fade-in duration-700"
              />
            )}
            {balance && (
              <BudgetCard 
                title="Bank Balance" 
                amount={`$${balance.toLocaleString()}`}
                status="warning"
                icon={<DollarSign />}
                description="Current savings"
                className="animate-in fade-in duration-700 delay-150"
              />
            )}
            {income && (
              <BudgetCard 
                title="Monthly Income" 
                amount={`$${income.toLocaleString()}`}
                status="good"
                icon={<DollarSign />}
                description="Part-time job"
                className="animate-in fade-in duration-700 delay-300"
              />
            )}
          </div>
        </div>
      );
    }

    // Render Quest Items with stagger animation
    if (streamingState.questItems && streamingState.questItems.length > 0) {
      components.push(
        <div key="quest-items" className="mt-4 space-y-3">
          {streamingState.questItems.map((quest, index) => (
            <div 
              key={`quest-${index}`}
              className="animate-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${index * 200}ms` }}
            >
            <QuestItem
              title={quest.title}
              description={`Save $${quest.amount}/month`}
              difficulty={quest.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}
              category={quest.category.toLowerCase() as 'food' | 'transportation' | 'subscriptions' | 'savings' | 'study' | 'other'}
              reward={`$${quest.amount}/month`}
              completed={false}
            />
            </div>
          ))}
        </div>
      );
    }

    // Render Metric Badges with counter animation
    if (streamingState.metricBadges && streamingState.metricBadges.length > 0) {
      components.push(
        <div key="metric-badges" className="mt-4 flex flex-wrap gap-2">
          {streamingState.metricBadges.map((metric, index) => (
            <div 
              key={`metric-${index}`}
              className="animate-in zoom-in duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MetricBadge
                value={metric.type === 'currency' ? metric.value : metric.value}
                label={metric.label}
                type={metric.type as 'currency' | 'percentage' | 'number' | 'time'}
                trend={metric.type === 'percentage' && metric.value > 50 ? 'up' : 'down'}
                className="animate-pulse"
              />
            </div>
          ))}
        </div>
      );
    }

    return components;
  };

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden p-6">
      {renderStreamingContent()}
      
      {/* Loading state for empty stream */}
      {streamingState.text === '' && streamingState.isTyping && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>StudyBot is thinking...</span>
        </div>
      )}
    </div>
  );
}
