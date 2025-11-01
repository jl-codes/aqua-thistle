import React from 'react';
import { BudgetCard } from '@/components/ui/budget-card';
import { QuestItem } from '@/components/ui/quest-item';
import { MetricBadge, CurrencyBadge, PercentageBadge } from '@/components/ui/metric-badge';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DollarSign, TrendingDown, Target, BookOpen, Star, Zap } from 'lucide-react';

interface MessageRendererProps {
  content: string;
  className?: string;
}

export function MessageRenderer({ content, className }: MessageRendererProps) {
  const renderGamifiedContent = (text: string) => {
    const lines = text.split('\n');
    const sections: React.ReactNode[] = [];
    let currentSection: string[] = [];
    let sectionType = 'text';
    let sectionIndex = 0;

    const flushCurrentSection = () => {
      if (currentSection.length === 0) return;
      
      const sectionContent = currentSection.join('\n');
      const currentIndex = sectionIndex++;
      
      if (sectionType === 'budget') {
        sections.push(renderBudgetSection(sectionContent, currentIndex));
      } else if (sectionType === 'quest') {
        sections.push(renderQuestSection(sectionContent, currentIndex));
      } else if (sectionType === 'metrics') {
        sections.push(renderMetricsSection(sectionContent, currentIndex));
      } else {
        sections.push(renderTextSection(sectionContent, currentIndex));
      }
      
      currentSection = [];
      sectionType = 'text';
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Detect section types - Updated patterns to match actual response format
      if (trimmed.includes('Budget Reality') || 
          trimmed.includes('Current Situation') || 
          trimmed.includes('Current Savings Challenge') ||
          trimmed.includes('Current Budget Reality') ||
          trimmed.includes('Rent Affordability Analysis') ||
          trimmed.includes('monthly deficit') || 
          trimmed.includes('Monthly deficit') ||
          (trimmed.includes('spending') && trimmed.includes('$'))) {
        flushCurrentSection();
        sectionType = 'budget';
      } else if (trimmed.match(/^\d+\.\s*\*\*/) || 
                 trimmed.includes('Areas to Cut') || 
                 trimmed.includes('Priority') ||
                 trimmed.includes('Month Savings Plan') ||
                 trimmed.includes('Action Plan') ||
                 trimmed.includes('Rent Strategy Breakdown') ||
                 (trimmed.includes('Month 1') || trimmed.includes('Month 2') || trimmed.includes('Month 3'))) {
        flushCurrentSection();
        sectionType = 'quest';
      } else if (trimmed.includes('%') && (trimmed.includes('$') || trimmed.includes('deficit')) ||
                trimmed.includes('Financial Impact')) {
        flushCurrentSection();
        sectionType = 'metrics';
      }
      
      currentSection.push(line);
    });
    
    flushCurrentSection();
    return sections;
  };

  const renderBudgetSection = (content: string, sectionIndex: number) => {
    const lines = content.split('\n').filter(line => line.trim());
    const cards: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Parse income line (general budget)
      const incomeMatch = trimmed.match(/Income:\s*\$?(\d+(?:,\d{3})*)/);
      if (incomeMatch) {
        cards.push(
          <BudgetCard
            key={`income-${index}`}
            title="Monthly Income"
            amount={`$${parseInt(incomeMatch[1].replace(/,/g, '')).toLocaleString()}`}
            status="good"
            icon={<DollarSign />}
            description="From part-time job"
            className="mb-2"
          />
        );
      }
      
      // Parse rent-specific income 
      const rentIncomeMatch = trimmed.match(/Your Income:\s*\$?(\d+(?:,\d{3})*)/);
      if (rentIncomeMatch) {
        cards.push(
          <BudgetCard
            key={`rent-income-${index}`}
            title="Monthly Income"
            amount={`$${parseInt(rentIncomeMatch[1].replace(/,/g, '')).toLocaleString()}`}
            status="good"
            icon={<DollarSign />}
            description="Available for all expenses"
            className="mb-2"
          />
        );
      }
      
      // Parse 30% rent rule
      const rent30Match = trimmed.match(/30% Rule:\*\*\s*Max\s*\$?(\d+)/);
      if (rent30Match) {
        cards.push(
          <BudgetCard
            key={`rent-30-${index}`}
            title="30% Rule Max Rent"
            amount={`$${rent30Match[1]}`}
            status="warning"
            icon={<Target />}
            description="Standard guideline (30% of income)"
            className="mb-2"
          />
        );
      }
      
      // Parse 25% rent rule  
      const rent25Match = trimmed.match(/25% Rule:\*\*\s*Max\s*\$?(\d+)/);
      if (rent25Match) {
        cards.push(
          <BudgetCard
            key={`rent-25-${index}`}
            title="25% Rule Max Rent"
            amount={`$${rent25Match[1]}`}
            status="good"
            icon={<Target />}
            description="Safer option (with current deficit)"
            className="mb-2"
          />
        );
      }
      
      // Parse expenses line
      const expensesMatch = trimmed.match(/Expenses:\s*\$?(\d+(?:,\d{3})*)/);
      if (expensesMatch) {
        cards.push(
          <BudgetCard
            key={`expenses-${index}`}
            title="Monthly Expenses" 
            amount={`$${parseInt(expensesMatch[1].replace(/,/g, '')).toLocaleString()}`}
            status="warning"
            icon={<TrendingDown />}
            description="Living expenses"
            className="mb-2"
          />
        );
      }
      
      // Parse deficit line
      const deficitMatch = trimmed.match(/Overspending.*?\$?(\d+).*?(\d+)%/);
      if (deficitMatch) {
        cards.push(
          <BudgetCard
            key={`deficit-${index}`}
            title="Monthly Deficit"
            amount={`$${deficitMatch[1]}`}
            status="danger"
            icon={<Target />}
            description={`${deficitMatch[2]}% over budget`}
            progress={parseInt(deficitMatch[2])}
            className="mb-2"
          />
        );
      }
      
      // Parse current overspending (rent specific)
      const overspendingMatch = trimmed.match(/Current overspending:\s*\$?(\d+)/);
      if (overspendingMatch) {
        cards.push(
          <BudgetCard
            key={`overspending-${index}`}
            title="Current Deficit"
            amount={`$${overspendingMatch[1]}`}
            status="danger"
            icon={<TrendingDown />}
            description="Monthly overspending"
            className="mb-2"
          />
        );
      }
    });
    
    // Determine section title based on content
    const isRentSection = content.includes('Rent Affordability') || content.includes('30% Rule');
    const sectionTitle = isRentSection ? 'Rent Affordability' : 'Budget Analysis';
    
    return (
      <div key={`budget-section-${sectionIndex}`} className="space-y-3 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {sectionTitle}
          </h3>
        </div>
        <div className="grid gap-2">
          {cards}
        </div>
      </div>
    );
  };

  const renderQuestSection = (content: string, sectionIndex: number) => {
    const lines = content.split('\n').filter(line => line.trim());
    const quests: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Parse savings plan items like "1. **Month 1:** Cut expenses by $200 → Reduce deficit to $176"
      const savingsPlanMatch = trimmed.match(/^\d+\.\s*\*\*(Month \d+):\*\*\s*(.+)\s*→\s*(.+)/);
      if (savingsPlanMatch) {
        const monthTitle = savingsPlanMatch[1]; // "Month 1"
        const action = savingsPlanMatch[2]; // "Cut expenses by $200"
        const result = savingsPlanMatch[3]; // "Reduce deficit to $176"
        
        // Extract dollar amount from action
        const amountMatch = action.match(/\$(\d+)/);
        const amount = amountMatch ? parseInt(amountMatch[1]) : 0;
        
        const category = action.toLowerCase().includes('cut') || action.toLowerCase().includes('save') ? 'savings' : 'other';
        const difficulty = amount > 200 ? 'hard' : amount > 100 ? 'medium' : 'easy';
        
        quests.push(
          <QuestItem
            key={`quest-${index}`}
            title={`${monthTitle}: ${action}`}
            description={`Result: ${result}`}
            reward={amount > 0 ? `$${amount} impact` : "Financial progress"}
            difficulty={difficulty}
            category={category}
            className="mb-2"
          />
        );
      } else {
        // Fallback: Parse traditional quest items (numbered lists with costs in parentheses)
        const questMatch = trimmed.match(/^\d+\.\s*\*\*(.*?)\*\*.*?\(\$(\d+).*?\)\s*-\s*(.+)/);
        if (questMatch) {
          const category = questMatch[1].toLowerCase().includes('food') ? 'food' : 
                          questMatch[1].toLowerCase().includes('transport') ? 'transportation' : 
                          questMatch[1].toLowerCase().includes('subscription') ? 'subscriptions' : 'other';
          
          const difficulty = parseInt(questMatch[2]) > 100 ? 'hard' : 
                            parseInt(questMatch[2]) > 50 ? 'medium' : 'easy';
          
          quests.push(
            <QuestItem
              key={`quest-${index}`}
              title={`Save ${questMatch[2]} on ${questMatch[1]}`}
              description={questMatch[3]}
              reward={`$${questMatch[2]}/month saved`}
              difficulty={difficulty}
              category={category}
              className="mb-2"
            />
          );
        }
      }
    });
    
    if (quests.length === 0) return null;
    
    return (
      <div key={`quest-section-${sectionIndex}`} className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Savings Plan Steps
          </h3>
        </div>
        <div className="space-y-2">
          {quests}
        </div>
      </div>
    );
  };

  const renderMetricsSection = (content: string, sectionIndex: number) => {
    const metrics: React.ReactNode[] = [];
    
    // Look for key metrics
    const deficitMatch = content.match(/\$(\d+)/);
    const percentageMatch = content.match(/(\d+)%/);
    const balanceMatch = content.match(/\$(\d+,?\d*)\s*balance/);
    const monthsMatch = content.match(/(\d+)\s*months/);
    
    if (deficitMatch) {
      metrics.push(
        <CurrencyBadge
          key="deficit-badge"
          amount={parseInt(deficitMatch[1])}
          label="Monthly Deficit"
          status="danger"
          trend="down"
          className="mr-2 mb-2"
        />
      );
    }
    
    if (percentageMatch) {
      metrics.push(
        <PercentageBadge
          key="percentage-badge"
          percentage={parseInt(percentageMatch[1])}
          label="Over Budget"
          status="warning"
          className="mr-2 mb-2"
        />
      );
    }
    
    if (balanceMatch) {
      metrics.push(
        <CurrencyBadge
          key="balance-badge"
          amount={parseInt(balanceMatch[1].replace(',', ''))}
          label="Current Balance"
          status="good"
          className="mr-2 mb-2"
        />
      );
    }
    
    if (monthsMatch) {
      metrics.push(
        <MetricBadge
          key="months-badge"
          value={monthsMatch[1]}
          label="Months Runway"
          type="time"
          status="warning"
          className="mr-2 mb-2"
        />
      );
    }
    
    if (metrics.length === 0) return null;
    
    return (
      <div key={`metrics-section-${sectionIndex}`} className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Key Metrics
          </h3>
        </div>
        <div className="flex flex-wrap">
          {metrics}
        </div>
      </div>
    );
  };

  const renderTextSection = (content: string, sectionIndex: number) => {
    if (!content.trim()) return null;
    
    // Clean up markdown formatting for display
    const cleanedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .split('\n')
      .filter(line => line.trim())
      .join('\n');
    
    return (
      <Card key={`text-section-${sectionIndex}`} className="p-4 mb-4 bg-gradient-to-br from-gray-50 to-white border-gray-200">
        <div 
          className="text-gray-800 leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: cleanedContent }}
        />
      </Card>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {renderGamifiedContent(content)}
    </div>
  );
}
