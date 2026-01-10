import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Package,
  Home,
  Users,
  Zap,
  MoreHorizontal,
} from "lucide-react";

const categoryConfig = {
  "Stock Purchase": { color: "hsl(190, 100%, 50%)", icon: Package },
  Rent: { color: "hsl(270, 75%, 60%)", icon: Home },
  Salary: { color: "hsl(280, 80%, 65%)", icon: Users },
  Electricity: { color: "hsl(45, 100%, 50%)", icon: Zap },
  Miscellaneous: { color: "hsl(0, 0%, 60%)", icon: MoreHorizontal },
};

const CategoryBreakdown = ({ data = [] }) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  // 🛑 Prevent chart render when no data
  if (!data.length || total === 0) {
    return (
      <div className="glass-card border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Category Breakdown
        </h3>
        <p className="text-muted-foreground text-sm">
          No expense data available yet.
        </p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    color:
      categoryConfig[item.category]?.color ||
      "hsl(0, 0%, 50%)",
  }));

  // 🛡️ Fully safe tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0] || !payload[0].payload) {
      return null;
    }

    const tooltipData = payload[0].payload;

    return (
      <div className="glass-card border border-white/20 rounded-lg p-3 shadow-xl">
        <p className="text-foreground font-medium">
          {tooltipData.category}
        </p>
        <p className="text-primary">
          ₹{tooltipData.amount.toLocaleString("en-IN")}
        </p>
        <p className="text-muted-foreground text-sm">
          {((tooltipData.amount / total) * 100).toFixed(1)}%
        </p>
      </div>
    );
  };

  return (
    <div className="glass-card border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Category Breakdown
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= PIE CHART ================= */}
        <div className="relative w-full h-[280px] min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="amount"
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ================= CATEGORY LIST ================= */}
        <div className="space-y-3">
          {data.map((item) => {
            const config = categoryConfig[item.category];
            const Icon = config?.icon || MoreHorizontal;
            const percentage =
              total > 0
                ? ((item.amount / total) * 100).toFixed(1)
                : 0;

            return (
              <div
                key={item.category}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: `${config?.color}20`,
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: config?.color }}
                    />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">
                      {item.category}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {percentage}%
                    </p>
                  </div>
                </div>
                <p className="text-foreground font-semibold">
                  ₹{item.amount.toLocaleString("en-IN")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
