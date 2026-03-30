import { Button } from "@/components/ui/button";
import { TrendingUp, Wallet, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPES = [
  { id: "sales",    label: "Sales Report",    icon: TrendingUp },
  { id: "expense",  label: "Expense Report",  icon: Wallet     },
  { id: "combined", label: "Combined Report", icon: BarChart2  },
];

const ReportTypeSelector = ({ activeType, onTypeChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {TYPES.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant="ghost"
          onClick={() => onTypeChange(id)}
          className={cn(
            "h-10 px-6 rounded-xl border text-sm font-medium transition-all gap-2",
            activeType === id
              ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30"
              : "text-white/60 border-white/10 hover:bg-white/5 hover:text-white"
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Button>
      ))}
    </div>
  );
};

export default ReportTypeSelector;