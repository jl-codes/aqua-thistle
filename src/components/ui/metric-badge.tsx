import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, Target } from "lucide-react";

interface MetricBadgeProps {
  value: string | number;
  label: string;
  type: 'currency' | 'percentage' | 'number' | 'time';
  trend?: 'up' | 'down' | 'neutral';
  status?: 'good' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export function MetricBadge({ 
  value, 
  label, 
  type, 
  trend, 
  status = 'info',
  size = 'md',
  animated = false,
  className 
}: MetricBadgeProps) {
  const statusStyles = {
    good: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      text: 'text-white',
      border: 'border-green-300',
      glow: 'shadow-green-500/25'
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      text: 'text-white', 
      border: 'border-yellow-300',
      glow: 'shadow-yellow-500/25'
    },
    danger: {
      bg: 'bg-gradient-to-r from-red-500 to-pink-600',
      text: 'text-white',
      border: 'border-red-300',
      glow: 'shadow-red-500/25'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-purple-600',
      text: 'text-white',
      border: 'border-blue-300',
      glow: 'shadow-blue-500/25'
    }
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const getIcon = () => {
    const iconClass = cn(
      "flex-shrink-0",
      size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
    );

    switch (type) {
      case 'currency':
        return <DollarSign className={iconClass} />;
      case 'percentage':
        return <Percent className={iconClass} />;
      case 'time':
        return <Calendar className={iconClass} />;
      default:
        return <Target className={iconClass} />;
    }
  };

  const getTrendIcon = () => {
    const iconClass = cn(
      "flex-shrink-0 ml-1",
      size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
    );

    if (trend === 'up') return <TrendingUp className={iconClass} />;
    if (trend === 'down') return <TrendingDown className={iconClass} />;
    return null;
  };

  const formatValue = (val: string | number) => {
    if (type === 'currency' && typeof val === 'number') {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
    if (type === 'percentage' && typeof val === 'number') {
      return `${val}%`;
    }
    return val.toString();
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-2 rounded-full border-2 font-bold transition-all duration-300 hover:scale-105",
      statusStyles[status].bg,
      statusStyles[status].text,
      statusStyles[status].border,
      sizeStyles[size],
      animated && "animate-pulse",
      `hover:shadow-lg hover:${statusStyles[status].glow}`,
      className
    )}>
      {getIcon()}
      <div className="flex flex-col items-center">
        <span className={cn(
          "font-bold leading-none",
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg'
        )}>
          {formatValue(value)}
        </span>
        <span className={cn(
          "text-white/80 leading-none",
          size === 'sm' ? 'text-[0.6rem]' : size === 'md' ? 'text-xs' : 'text-sm'
        )}>
          {label}
        </span>
      </div>
      {getTrendIcon()}
    </div>
  );
}

// Specialized components for common use cases
export function CurrencyBadge({ 
  amount, 
  label, 
  status = 'info',
  ...props 
}: Omit<MetricBadgeProps, 'value' | 'type'> & { amount: number }) {
  return (
    <MetricBadge 
      value={amount} 
      label={label}
      type="currency" 
      status={status}
      {...props} 
    />
  );
}

export function PercentageBadge({ 
  percentage, 
  label, 
  status = 'info',
  ...props 
}: Omit<MetricBadgeProps, 'value' | 'type'> & { percentage: number }) {
  return (
    <MetricBadge 
      value={percentage} 
      label={label}
      type="percentage" 
      status={status}
      {...props} 
    />
  );
}
