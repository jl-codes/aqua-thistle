import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Star, Target, Zap } from "lucide-react";

interface QuestItemProps {
  title: string;
  description: string;
  reward?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'food' | 'transportation' | 'subscriptions' | 'savings' | 'study' | 'other';
  completed?: boolean;
  onClick?: () => void;
  className?: string;
}

export function QuestItem({ 
  title, 
  description, 
  reward, 
  difficulty, 
  category, 
  completed = false, 
  onClick,
  className 
}: QuestItemProps) {
  const difficultyColors = {
    easy: 'from-green-400 to-green-600',
    medium: 'from-blue-400 to-blue-600',
    hard: 'from-purple-400 to-purple-600'
  };

  const categoryIcons = {
    food: '🍽️',
    transportation: '🚗',
    subscriptions: '📱',
    savings: '💰',
    study: '📚',
    other: '🎯'
  };

  const difficultyStars = {
    easy: 1,
    medium: 2,
    hard: 3
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-md cursor-pointer group",
        completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:border-blue-300",
        className
      )}
      onClick={onClick}
    >
      {/* Quest difficulty indicator */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r transition-all duration-300",
        completed ? "from-green-400 to-green-600" : difficultyColors[difficulty]
      )} />
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* Completion status */}
            {completed ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
            )}
            
            {/* Category icon */}
            <span className="text-lg">{categoryIcons[category]}</span>
            
            <div className="flex-1">
              <h3 className={cn(
                "font-bold text-sm transition-colors",
                completed ? "text-green-700 line-through" : "text-gray-800 group-hover:text-blue-700"
              )}>
                {title}
              </h3>
            </div>
          </div>
          
          {/* Difficulty stars */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < difficultyStars[difficulty]
                    ? completed 
                      ? "text-green-400 fill-green-400"
                      : "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
        </div>
        
        <p className={cn(
          "text-xs text-gray-600 mb-3 ml-7 transition-colors",
          completed && "text-green-600"
        )}>
          {description}
        </p>
        
        <div className="flex items-center justify-between ml-7">
          {reward && (
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs px-2 py-1 transition-all duration-300",
                completed 
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-200 group-hover:from-yellow-200 group-hover:to-orange-200"
              )}
            >
              <Zap className="w-3 h-3 mr-1" />
              {reward}
            </Badge>
          )}
          
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs capitalize transition-all duration-300",
              completed 
                ? "border-green-300 text-green-600"
                : {
                    easy: "border-green-300 text-green-600 group-hover:bg-green-50",
                    medium: "border-blue-300 text-blue-600 group-hover:bg-blue-50",
                    hard: "border-purple-300 text-purple-600 group-hover:bg-purple-50"
                  }[difficulty]
            )}
          >
            <Target className="w-3 h-3 mr-1" />
            {difficulty}
          </Badge>
        </div>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
}
