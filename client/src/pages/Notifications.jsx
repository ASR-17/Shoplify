import { useNavigate } from "react-router-dom";
import { Bell, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import NotificationFilters from "@/components/notifications/NotificationFilters";
import NotificationsList from "@/components/notifications/NotificationsList";
import useNotifications from "@/hooks/useNotifications";
import AppLayout from "@/layouts/AppLayout";

const Notifications = () => {
  const navigate = useNavigate();

  const {
    notifications,
    filteredNotifications,
    activeFilter,
    unreadCount,
    isLoading,
    setActiveFilter,
    markAsRead,
    markAllRead,
  } = useNotifications();

  const handleAction = (notification) => {
    console.log("CLICKED:", notification.type, notification.actionUrl, notification.metadata);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <AppLayout>
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Notifications & Alerts
              </h1>
              <p className="text-muted-foreground mt-1">
                Stay informed about important business events
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate("/settings?tab=notifications")}
          >
            <Settings className="h-4 w-4" />
            Preferences
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>

        {/* ================= FILTERS ================= */}
        <NotificationFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
        />

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: notifications.length },
            { label: "Unread", value: unreadCount },
            {
              label: "Critical",
              value: notifications.filter((n) => n.severity === "critical")
                .length,
            },
            {
              label: "Warnings",
              value: notifications.filter((n) => n.severity === "warning")
                .length,
            },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card/50">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ================= LIST ================= */}
        <Card className="bg-card/50">
          <CardContent className="p-4 sm:p-6">
            <NotificationsList
              notifications={filteredNotifications}
              onMarkAsRead={markAsRead}
              onAction={handleAction}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground/60">
          Notifications are retained for 30 days.
        </p>
      </div>
    </div>
    </AppLayout>
  );
};

export default Notifications;
