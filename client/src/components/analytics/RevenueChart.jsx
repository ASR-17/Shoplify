import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const fmt = (v) =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-xs">
      <p className="font-semibold mb-2 text-foreground">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span>{p.name}:</span>
          <span className="font-medium text-foreground">
            {typeof p.value === "number" ? fmt(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const RevenueChart = ({ monthlyData }) => {
  if (!monthlyData?.length) return null;
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground">Revenue vs Expenses</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Monthly breakdown — last 12 months</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={monthlyData}>
          <defs>
            <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="rgba(255,255,255,0.3)" />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area type="monotone" dataKey="revenue"  stroke="#6366f1" fill="url(#gRev)"    strokeWidth={2} name="Revenue" />
          <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="none"          strokeWidth={1.5} strokeDasharray="4 4" name="Expenses" />
          <Area type="monotone" dataKey="profit"   stroke="#22c55e" fill="url(#gProfit)" strokeWidth={2} name="Profit" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;