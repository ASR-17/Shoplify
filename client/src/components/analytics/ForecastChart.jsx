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
          <span className="font-medium text-foreground">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const ForecastChart = ({ revenueForecast }) => {
  if (!revenueForecast?.length) return null;

  const totalForecastRevenue = revenueForecast.reduce((s, m) => s + m.revenue, 0);
  const totalForecastProfit  = revenueForecast.reduce((s, m) => s + m.profit, 0);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">6-Month Revenue Forecast</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Predicted using weighted moving average + seasonal adjustment
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">Projected Revenue</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">{fmt(totalForecastRevenue)}</p>
          <p className="text-xs text-muted-foreground mt-1">next 6 months</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">Projected Profit</p>
          <p className="text-xl font-bold text-blue-400 mt-1">{fmt(totalForecastProfit)}</p>
          <p className="text-xs text-muted-foreground mt-1">next 6 months</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={revenueForecast}>
          <defs>
            <linearGradient id="gFRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="url(#gFRev)" strokeWidth={2} strokeDasharray="6 3" name="Forecast Revenue" />
          <Area type="monotone" dataKey="profit"  stroke="#6366f1" fill="none"        strokeWidth={1.5} strokeDasharray="4 4" name="Forecast Profit" />
        </AreaChart>
      </ResponsiveContainer>

      <p className="text-xs text-muted-foreground text-center">
        ⚠️ Forecast based on historical sales patterns + seasonal trends. Actual results may vary.
      </p>
    </div>
  );
};

export default ForecastChart;