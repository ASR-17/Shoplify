import { Bell, AlertTriangle, AlertCircle, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All", icon: Bell },
  { id: "critical", label: "Critical", icon: AlertTriangle },
  { id: "warning", label: "Warnings", icon: AlertCircle },
  { id: "info", label: "Info", icon: Info },
];

const NotificationFilters = ({
  activeFilter,
  onFilterChange,
  unreadCount,
  onMarkAllRead,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-card/50 border border-border/30">
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Mark All Read */}
      {unreadCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onMarkAllRead}
          className="text-muted-foreground hover:text-foreground gap-2"
        >
          <Check className="h-4 w-4" />
          Mark all as read
          <span className="ml-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
            {unreadCount}
          </span>
        </Button>
      )}
    </div>
  );
};

export default NotificationFilters;
