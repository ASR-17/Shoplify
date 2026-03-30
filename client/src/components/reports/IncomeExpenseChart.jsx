import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const filters = ["Today", "This Week", "This Month", "Custom"];

/* ================= PREPARE DATA (NO CUMULATIVE) ================= */
const prepareChartData = (data = []) => {
  if (!Array.isArray(data)) return [];

  return [...data]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      name: format(new Date(item.date), "dd MMM"),
      income: item.income || 0,
      expenses: item.expenses || 0,
    }));
};

const IncomeExpenseChart = ({ data = [], onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState("This Month");

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    onFilterChange?.({ range: filter });
  };

  const chartData = useMemo(() => prepareChartData(data), [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-lg border bg-card/95 p-3 shadow-xl">
        <p className="text-sm font-medium mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="font-medium">
              ₹{Number(entry.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="flex justify-between pb-4">
        <CardTitle className="text-lg font-semibold">
          Income vs Expenses
        </CardTitle>

        <div className="flex gap-1">
          {filters.map((f) => (
            <Button
              key={f}
              size="sm"
              variant="ghost"
              onClick={() => handleFilterClick(f)}
              className={cn(
                "h-8 px-3 text-xs",
                activeFilter === f
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground"
              )}
            >
              {f}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incomeG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity={0.35} />
                  <stop offset="100%" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 6" opacity={0.4} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              <Area
                dataKey="expenses"
                name="Expenses"
                stroke="#c084fc"
                fill="url(#expenseG)"
                strokeWidth={2}
                dot
              />
              <Area
                dataKey="income"
                name="Income"
                stroke="#10b981"
                fill="url(#incomeG)"
                strokeWidth={2}
                dot
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseChart;
