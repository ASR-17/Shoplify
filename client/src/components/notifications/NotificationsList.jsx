import { Bell, Sparkles } from "lucide-react";
import NotificationCard from "./NotificationCard";
import { ScrollArea } from "@/components/ui/scroll-area";

const NotificationsList = ({
  notifications,
  onMarkAsRead,
  onAction,
  isLoading,
}) => {
  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse flex items-start gap-4 p-4 rounded-xl bg-card/30 border border-border/20"
          >
            <div className="w-10 h-10 rounded-lg bg-muted/50" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted/50 rounded w-3/4" />
              <div className="h-3 bg-muted/30 rounded w-full" />
              <div className="h-3 bg-muted/30 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
          <div className="relative rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-6 border border-primary/20">
            <Bell className="h-12 w-12 text-primary/60" />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-semibold text-foreground">
            You're all caught up
          </h3>
          <Sparkles className="h-5 w-5 text-amber-400" />
        </div>
        <p className="text-muted-foreground max-w-sm">
          No new notifications at the moment. We'll let you know when something
          important happens.
        </p>
      </div>
    );
  }

  /* ================= LIST ================= */
  return (
    <ScrollArea className="h-[calc(100vh-380px)] min-h-[400px] pr-4">
      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification._id || notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onAction={onAction}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotificationsList;
