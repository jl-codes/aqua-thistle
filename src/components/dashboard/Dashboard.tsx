"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/circular-progress";
import { CategoryCard, CategoryQuickActions } from "@/components/ui/category-card";
import { EnhancedGoalCard } from "@/components/ui/enhanced-goal-card";
import { mockUserProfile, categoryData, categoryInsights, savingsTips, goalAnalytics } from "@/lib/mock-data";
import { Menu, Edit, Mic } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Dashboard() {
  const [activeCategory, setActiveCategory] = useState<string>("finance");
  const [showQuickActions, setShowQuickActions] = useState<string | null>(null);
  const user = mockUserProfile;
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setShowQuickActions(null);
    // Category click now just shows content - no redirect to chat
  };

  const handleQuickAction = (categoryId: string, actionId: string) => {
    setShowQuickActions(null);
    // Navigate to chat with specific action context
    router.push(`/chat?category=${categoryId}&action=${actionId}`);
  };

  const currentCategory = categoryData.find(cat => cat.id === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile Header */}
      <div className="bg-white px-4 py-2 flex items-center justify-between border-b">
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

      <div className="px-4 py-6 space-y-6">
        {/* Interactive Category Selector */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">How can I help you today?</h2>
            <p className="text-sm text-gray-600">Choose a category to get personalized advice</p>
          </div>
          
          {/* Category Cards Grid */}
          <div className="grid grid-cols-5 gap-3 relative">
            {categoryData.map((category) => (
              <div key={category.id} className="relative">
                <CategoryCard
                  id={category.id}
                  name={category.name}
                  icon={category.icon}
                  gradient={category.gradient}
                  isActive={activeCategory === category.id}
                  liveData={category.liveData}
                  description={category.description}
                  onClick={() => handleCategoryClick(category.id)}
                  className="w-full aspect-square"
                />
                
                {/* Quick Actions Dropdown */}
                <CategoryQuickActions
                  category={category.id}
                  actions={category.quickActions.map(action => ({
                    ...action,
                    onClick: () => handleQuickAction(category.id, action.action)
                  }))}
                  isVisible={showQuickActions === category.id}
                />
              </div>
            ))}
          </div>

          {/* Category Insights */}
          {currentCategory && (
            <Card className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-lg">{currentCategory.icon}</span>
                  {currentCategory.name} Insights
                </h3>
                <div className="space-y-1">
                  {categoryInsights[currentCategory.id as keyof typeof categoryInsights]?.map((insight, index) => (
                    <div key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Quick Start Suggestions */}
          {currentCategory && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Quick Questions:</h3>
              <div className="grid grid-cols-1 gap-2">
                {currentCategory.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(`/chat?message=${encodeURIComponent(suggestion)}`)}
                    className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Budget Section */}
        <Card className="p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">This Month's Budget</h3>
            <Badge className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
              Mon
            </Badge>
          </div>
          
          <div className="mb-4">
            <div className="text-2xl font-bold text-gray-900">
              ${user.budget.current.toLocaleString()} <span className="text-gray-400">/ ${user.budget.total.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Progress 
              value={(user.budget.current / user.budget.total) * 100} 
              className="h-2 bg-gray-200"
            />
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              {user.budget.categories.map((category, index) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-medium">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Motivational Message */}
        <Card className="p-4 bg-gray-100 border-gray-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-semibold text-xl text-gray-900 mb-2">12% less study time today</div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stay focused! The ABC Certification is an important milestone for you to become a Program Manager.
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="text-lg">📊</div>
                </div>
              </div>
            </div>
          </div>
          <Button variant="link" className="mt-3 p-0 text-sm text-gray-500 hover:text-gray-700">
            Details
          </Button>
        </Card>

        {/* Enhanced Daily Goals */}
        <Card className="p-6 shadow-sm bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">My Goals For Today</h3>
              <p className="text-sm text-gray-600 mt-1">Track your daily progress and build streaks</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-sm"
              onClick={() => {
                // Future: Open goal management modal
                console.log("Goal management coming soon!");
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Manage
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.goals.map((goal) => (
              <EnhancedGoalCard
                key={goal.id}
                goal={goal}
                analytics={goalAnalytics[goal.id]}
                onGoalUpdate={(goalId, newProgress) => {
                  console.log(`Goal ${goalId} updated to ${newProgress}`);
                  // Future: Update goal progress in state management
                }}
                onGoalComplete={(goalId) => {
                  console.log(`Goal ${goalId} completed! 🎉`);
                  // Future: Handle goal completion celebration and streak tracking
                }}
                onGoalEdit={(goalId) => {
                  console.log(`Edit goal ${goalId}`);
                  // Future: Open goal editing modal
                }}
                className="h-full"
              />
            ))}
          </div>
          
          {/* Goal Summary Stats */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">
                  {user.goals.filter(g => (g.current/g.target) >= 1).length}
                </div>
                <div className="text-xs text-gray-500">Completed Today</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">
                  {Math.max(...user.goals.map(g => g.streak))}
                </div>
                <div className="text-xs text-gray-500">Best Streak</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(user.goals.reduce((acc, g) => acc + (g.current/g.target), 0) / user.goals.length * 100)}%
                </div>
                <div className="text-xs text-gray-500">Daily Average</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Savings Tips */}
        <Card className="p-4 shadow-sm">
          <div className="space-y-3">
            {savingsTips.map((tip, index) => (
              <div key={index} className="flex items-start">
                <span className="text-sm text-gray-700 leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Tip Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 shadow-sm">
            <div className="text-center">
              <h4 className="font-semibold text-lg text-gray-900 mb-6">Today's<br/>10-sec Quiz!</h4>
              <Button className="rounded-full text-sm px-4 py-2 bg-yellow-100 text-gray-800 hover:bg-yellow-200 border border-gray-300">
                🎁 Get rewarded
              </Button>
            </div>
          </Card>
          
          <Card className="p-4 shadow-sm">
            <div>
              <h4 className="font-semibold text-lg text-gray-900 mb-3">Today's Tip</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Did you know that by registering for Selective Service, you may qualify for student aid? 🎓
              </p>
            </div>
          </Card>
        </div>

        {/* Savings Goal */}
        <Card className="p-4 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">This month's savings goal</h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900 mb-3">{user.savingsGoal.percentage}%</div>
              <Progress value={user.savingsGoal.percentage} className="h-2 bg-gray-200" />
            </div>
            <div className="ml-6 text-right">
              <div className="text-sm text-green-600 font-medium">
                + ${user.savingsGoal.monthlyIncrease} from last month
              </div>
            </div>
          </div>
        </Card>

        {/* Chat Button */}
        <div className="fixed bottom-6 right-6">
          <Link href="/chat">
            <Button 
              size="lg" 
              className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              💬
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
