"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/circular-progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Goal, GoalAnalytics } from "@/types";
import { Check, Plus, Minus, TrendingUp, TrendingDown, Flame, Target, Clock, Award } from "lucide-react";

interface EnhancedGoalCardProps {
  goal: Goal;
  analytics?: GoalAnalytics;
  onGoalUpdate?: (goalId: string, newProgress: number) => void;
  onGoalComplete?: (goalId: string) => void;
  onGoalEdit?: (goalId: string) => void;
  className?: string;
}

export function EnhancedGoalCard({
  goal,
  analytics,
  onGoalUpdate,
  onGoalComplete,
  onGoalEdit,
  className
}: EnhancedGoalCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const progressPercentage = Math.min((goal.current / goal.target) * 100, 100);
  const isCompleted = goal.isCompleted || progressPercentage >= 100;
  
  // Determine status color based on progress and priority
  const getStatusColor = () => {
    if (isCompleted) return "from-green-500 to-emerald-600";
    if (progressPercentage >= 80) return "from-blue-500 to-cyan-600";
    if (progressPercentage >= 50) return "from-yellow-500 to-orange-500";
    if (goal.priority === "high") return "from-red-500 to-pink-600";
    return "from-gray-400 to-gray-500";
  };

  const getDifficultyBadge = () => {
    const colors = {
      easy: "bg-green-100 text-green-700 border-green-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200", 
      hard: "bg-red-100 text-red-700 border-red-200"
    };
    return colors[goal.difficulty];
  };

  const handleQuickUpdate = (increment: number) => {
    const newProgress = Math.max(0, Math.min(goal.target, goal.current + increment));
    onGoalUpdate?.(goal.id, newProgress);
  };

  const handleComplete = async () => {
    if (isCompleted) return;
    
    setIsCompleting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Animation delay
    
    onGoalUpdate?.(goal.id, goal.target);
    onGoalComplete?.(goal.id);
    
    setIsCompleting(false);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn("relative", className)}
    >
      <Card className={cn(
        "p-4 cursor-pointer transition-all duration-300 relative overflow-hidden",
        isCompleted 
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg" 
          : "bg-white hover:shadow-md border-gray-200",
        showDetails && "ring-2 ring-blue-500"
      )}>
        
        {/* Completion Celebration Overlay */}
        {isCompleting && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center z-50 rounded-lg"
          >
            <div className="text-center text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Award className="w-8 h-8 mx-auto mb-2" />
              </motion.div>
              <div className="font-bold">Goal Complete! 🎉</div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{goal.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={cn(
                  "font-semibold text-sm",
                  isCompleted ? "text-green-800" : "text-gray-900"
                )}>
                  {goal.name}
                </h3>
                {goal.streak > 1 && (
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 px-2 py-0 text-xs">
                    <Flame className="w-3 h-3 mr-1" />
                    {goal.streak}
                  </Badge>
                )}
              </div>
              <Badge className={cn("text-xs px-2 py-0 mt-1", getDifficultyBadge())}>
                {goal.difficulty}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {goal.priority === "high" && (
              <div className="w-2 h-2 bg-red-500 rounded-full" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <Target className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {goal.current} / {goal.target} {goal.unit}
            </span>
            <span className={cn(
              "text-sm font-medium",
              isCompleted ? "text-green-700" : "text-gray-700"
            )}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
          
          <div className="relative mb-2">
            <CircularProgress 
              value={progressPercentage}
              size={60}
              strokeWidth={6}
              className="mx-auto"
            />
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check className="w-6 h-6 text-green-600" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {!isCompleted && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickUpdate(-1);
              }}
              className="h-8 w-8 p-0"
              disabled={goal.current <= 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleComplete();
              }}
              className={cn(
                "px-4 py-1 text-xs font-medium transition-all",
                `bg-gradient-to-r ${getStatusColor()} text-white hover:shadow-md`
              )}
            >
              Complete
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickUpdate(1);
              }}
              className="h-8 w-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Contextual Tip */}
        {goal.contextualTip && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
            <div className="text-xs text-blue-700 leading-relaxed">
              💡 {goal.contextualTip}
            </div>
          </div>
        )}

        {/* Details Panel */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-3 mt-3"
          >
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Time Estimate:</span>
                <span className="text-gray-700 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {goal.estimatedTime}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Reward:</span>
                <span className="text-gray-700">{goal.reward}</span>
              </div>
              
              {analytics && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Completion Rate:</span>
                    <span className="text-gray-700 flex items-center gap-1">
                      {analytics.completionRate}%
                      {analytics.weeklyTrend > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />  
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Best Streak:</span>
                    <span className="text-gray-700 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      {analytics.bestStreak} days
                    </span>
                  </div>
                </>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onGoalEdit?.(goal.id)}
                className="w-full mt-2 text-xs"
              >
                Edit Goal
              </Button>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
