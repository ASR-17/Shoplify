import {
  AlertTriangle,
  Package,
  CreditCard,
  TrendingUp,
  Bell,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    badgeVariant: 'destructive',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    badgeVariant: 'outline',
  },
  info: {
    icon: Bell,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    badgeVariant: 'secondary',
  },
};

const typeIcons = {
  low_stock: Package,
  pending_payment: CreditCard,
  high_expense: TrendingUp,
};

const AlertsPanel = ({ alerts }) => {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-foreground">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alerts & Notifications
          </div>
          {alerts.length > 0 && (
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {alerts.length} Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-emerald-500/10 p-4 mb-3">
              <Bell className="h-8 w-8 text-emerald-400" />
            </div>
            <p className="text-muted-foreground">
              All clear! No alerts at the moment.
            </p>
          </div>
        ) : (
          alerts.map((alert) => {
            const config = severityConfig[alert.severity];
            const TypeIcon = typeIcons[alert.type];

            return (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg border p-4 transition-all hover:scale-[1.01]',
                  config.bgColor,
                  config.borderColor
                )}
              >
                <div className={cn('rounded-lg p-2', config.bgColor)}>
                  <TypeIcon className={cn('h-4 w-4', config.textColor)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={cn('font-medium text-sm', config.textColor)}>
                      {alert.title}
                    </p>
                    <Badge
                      variant={config.badgeVariant}
                      className={cn(
                        'text-xs capitalize',
                        alert.severity === 'warning' &&
                          'border-amber-500/50 text-amber-400'
                      )}
                    >
                      {alert.severity}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {alert.description}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {alert.timestamp}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
