import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  title: string;
  amount: string;
  status: 'good' | 'warning' | 'danger';
  description?: string;
  progress?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function BudgetCard({ title, amount, status, description, progress, icon, className }: BudgetCardProps) {
  const statusColors = {
    good: 'from-green-500 to-emerald-600',
    warning: 'from-yellow-500 to-orange-500', 
    danger: 'from-red-500 to-pink-600'
  };

  const statusAccents = {
    good: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    danger: 'border-red-200 bg-red-50'
  };

  return (
    <Card className={cn(
      "relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg",
      statusAccents[status],
      className
    )}>
      {/* Gradient overlay */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
        statusColors[status]
      )} />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={cn(
                "p-2 rounded-full bg-gradient-to-br",
                statusColors[status]
              )}>
                <div className="text-white text-lg">
                  {icon}
                </div>
              </div>
            )}
            <h3 className="font-bold text-gray-800">{title}</h3>
          </div>
          <div className={cn(
            "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
            statusColors[status]
          )}>
            {amount}
          </div>
        </div>
        
        {description && (
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        )}
        
        {progress !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className={cn(
                "h-2 transition-all duration-500",
                status === 'good' && "bg-green-100",
                status === 'warning' && "bg-yellow-100", 
                status === 'danger' && "bg-red-100"
              )}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
