import {
  AlertTriangle,
  AlertCircle,
  Info,
  Bell,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/20",
  },
  warning: {
    icon: AlertCircle,
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  info: {
    icon: Info,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
};

const NotificationCard = ({ notification, onMarkAsRead, onAction }) => {
  const config = severityConfig[notification.severity] || severityConfig.info;
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }
    if (notification.actionUrl && onAction) {
      onAction(notification);
    }
  };

  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-xl border transition-all cursor-pointer",
        notification.isRead
          ? "bg-card/40 border-border/30"
          : cn("bg-card/70", config.bg)
      )}
      onClick={handleClick}
    >
      {/* Icon */}
      <div
        className={cn(
          "h-10 w-10 flex items-center justify-center rounded-lg",
          config.bg
        )}
      >
        <Icon className={cn("h-5 w-5", config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-3">
          <h4
            className={cn(
              "text-sm font-semibold",
              notification.isRead
                ? "text-muted-foreground"
                : "text-foreground"
            )}
          >
            {notification.title}
          </h4>

          {!notification.isRead && (
            <span className="h-2 w-2 mt-1 rounded-full bg-primary" />
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          {notification.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            {notification.timestamp}
          </span>

          {notification.actionLabel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAction(notification);
              }}
            >
              {notification.actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
