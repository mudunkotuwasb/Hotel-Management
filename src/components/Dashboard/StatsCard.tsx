import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'teal';
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color,
  subtitle
}) => {
  const colorClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
    teal: 'bg-teal-500'
  };

  const changeClasses = {
    positive: 'text-success-600 bg-success-50',
    negative: 'text-danger-600 bg-danger-50',
    neutral: 'text-navy-600 bg-navy-50'
  };

  const getTrendIcon = () => {
    switch (changeType) {
      case 'positive': return <TrendingUp className="h-3 w-3" />;
      case 'negative': return <TrendingDown className="h-3 w-3" />;
      default: return <Minus className="h-3 w-3" />;
    }
  };

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-navy-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-navy-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-navy-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      
      {change && (
        <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${changeClasses[changeType]}`}>
          {getTrendIcon()}
          <span className="ml-1">{change}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
