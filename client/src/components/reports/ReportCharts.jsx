import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

const ReportCharts = ({ reportType, timeSeriesData, categoryData }) => {
  const formatCurrency = (value) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white/70 text-sm mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderMainChart = () => {
    if (reportType === "sales") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#salesGradient)"
              name="Sales"
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (reportType === "expense") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient
                id="expenseGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} 
              cursor={{ fill: "transparent" }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (reportType === "profit") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient
                id="profitGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} 
              cursor={{ fill: "transparent" }}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#profitGradient)"
              name="Net Profit"
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    // Combined report
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={timeSeriesData}>
          <defs>
            <linearGradient
              id="combinedSalesGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient
              id="combinedExpenseGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.1)"
          />
          <XAxis
            dataKey="date"
            stroke="rgba(255,255,255,0.5)"
            fontSize={12}
          />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} 
            cursor={{ fill: "transparent" }}
          />
          <Legend wrapperStyle={{ color: "rgba(255,255,255,0.7)" }} />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#combinedSalesGradient)"
            name="Sales"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#combinedExpenseGradient)"
            name="Expenses"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderCategoryChart = () => {
    if (!categoryData.length) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <h4 className="text-white/80 font-medium mb-4">
            Category Breakdown
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                type="number"
                stroke="rgba(255,255,255,0.5)"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <YAxis
                dataKey="category"
                type="category"
                stroke="rgba(255,255,255,0.5)"
                fontSize={11}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} 
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="amount"
                name="Amount"
                radius={[0, 4, 4, 0]}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color || COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <h4 className="text-white/80 font-medium mb-4">
            Distribution
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-white/70 text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Chart */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <h4 className="text-white/80 font-medium mb-4">
          {reportType === "sales" && "Sales Trend"}
          {reportType === "expense" && "Expense Trend"}
          {reportType === "profit" && "Profit Trend"}
          {reportType === "combined" && "Sales vs Expenses"}
        </h4>
        {renderMainChart()}
      </div>

      {/* Category Charts */}
      {(reportType === "expense" || reportType === "combined") &&
        renderCategoryChart()}
    </div>
  );
};

export default ReportCharts;
