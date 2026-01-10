import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const gradientClasses = {
  blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:border-blue-400/50',
  purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-400/50',
  green: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-400/50',
  orange: 'from-orange-500/20 to-amber-500/20 border-orange-500/30 hover:border-orange-400/50',
  pink: 'from-pink-500/20 to-rose-500/20 border-pink-500/30 hover:border-pink-400/50',
};

const iconBgClasses = {
  blue: 'bg-blue-500/20 text-blue-400',
  purple: 'bg-purple-500/20 text-purple-400',
  green: 'bg-emerald-500/20 text-emerald-400',
  orange: 'bg-orange-500/20 text-orange-400',
  pink: 'bg-pink-500/20 text-pink-400',
};

const KPICard = ({ title, value, trend, icon: Icon, gradient }) => {
  const isPositive = typeof trend === 'number' && trend > 0;
  const isNegative = typeof trend === 'number' && trend < 0;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-gradient-to-br backdrop-blur-sm p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
        gradientClasses[gradient]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {value}
          </p>

          {trend !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive && (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              )}
              {isNegative && (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}

              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive && 'text-emerald-400',
                  isNegative && 'text-red-400',
                  !isPositive && !isNegative && 'text-muted-foreground'
                )}
              >
                {isPositive && '+'}
                {trend}%
              </span>

              <span className="text-xs text-muted-foreground">
                vs last period
              </span>
            </div>
          )}
        </div>

        <div className={cn('rounded-xl p-3', iconBgClasses[gradient])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Decorative glow */}
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl" />
    </div>
  );
};

export default KPICard;
