"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  isActive?: boolean;
  liveData?: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

export function CategoryCard({
  id,
  name,
  icon,
  gradient,
  isActive = false,
  liveData,
  description,
  onClick,
  className
}: CategoryCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card
        className={cn(
          "relative p-4 cursor-pointer transition-all duration-300 transform",
          "hover:shadow-lg active:shadow-xl",
          isActive 
            ? `ring-2 ring-blue-500 shadow-lg bg-gradient-to-br ${gradient} text-white` 
            : "bg-white hover:bg-gray-50 border-gray-200",
          className
        )}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onClick={onClick}
      >
        {/* Active Indicator */}
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1"
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
          </motion.div>
        )}

        <div className="flex flex-col items-center text-center space-y-2">
          {/* Icon with Animation */}
          <motion.div
            animate={{
              scale: isActive ? 1.1 : 1,
              rotate: isPressed ? -5 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "text-3xl mb-1 p-2 rounded-full transition-all",
              isActive 
                ? "bg-white/20 backdrop-blur-sm" 
                : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            {icon}
          </motion.div>

          {/* Category Name */}
          <div className={cn(
            "font-bold text-sm",
            isActive ? "text-white" : "text-gray-900"
          )}>
            {name}
          </div>

          {/* Live Data Badge */}
          {liveData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge 
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  isActive 
                    ? "bg-white/20 text-white border-white/30" 
                    : "bg-blue-50 text-blue-700 border-blue-200"
                )}
              >
                {liveData}
              </Badge>
            </motion.div>
          )}

          {/* Description */}
          <div className={cn(
            "text-xs leading-tight",
            isActive ? "text-white/80" : "text-gray-500"
          )}>
            {description}
          </div>
        </div>

        {/* Subtle Gradient Overlay */}
        {!isActive && (
          <div 
            className={cn(
              "absolute inset-0 rounded-lg opacity-0 hover:opacity-10 transition-opacity",
              `bg-gradient-to-br ${gradient}`
            )}
          />
        )}
      </Card>
    </motion.div>
  );
}

// Category Quick Actions Component
interface QuickActionsProps {
  category: string;
  actions: Array<{
    label: string;
    icon: string;
    onClick: () => void;
  }>;
  isVisible: boolean;
}

export function CategoryQuickActions({ category, actions, isVisible }: QuickActionsProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 mt-2 z-50"
    >
      <Card className="p-3 shadow-lg border bg-white">
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <span className="text-lg">{action.icon}</span>
              <span className="font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
