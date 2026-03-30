import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RANGES = [
  { label: "Today",      value: "today"      },
  { label: "This Week",  value: "this-week"  },
  { label: "This Month", value: "this-month" },
  { label: "This Year",  value: "this-year"  },
];

/**
 * ReportFilters
 * Minimal — just 4 quick-range pill buttons.
 * No date pickers, no dropdowns, no apply button.
 */
const ReportFilters = ({ dateRange, onDateRangeChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {RANGES.map((r) => (
        <Button
          key={r.value}
          size="sm"
          variant="ghost"
          onClick={() => onDateRangeChange(r.value)}
          className={cn(
            "h-9 px-5 text-sm rounded-full border transition-all",
            dateRange === r.value
              ? "bg-primary/20 text-primary border-primary/30 font-medium"
              : "text-muted-foreground border-white/10 hover:bg-white/10 hover:text-white"
          )}
        >
          {r.label}
        </Button>
      ))}
    </div>
  );
};

export default ReportFilters;