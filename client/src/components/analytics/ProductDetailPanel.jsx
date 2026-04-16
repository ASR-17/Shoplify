import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { X, Boxes, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

const fmt = (v) =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v.toLocaleString("en-IN")}`;

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const trendIcon = (trend) => {
  if (trend === "rising")    return <TrendingUp   className="w-4 h-4 text-emerald-400" />;
  if (trend === "declining") return <TrendingDown className="w-4 h-4 text-red-400" />;
  return <Minus className="w-4 h-4 text-blue-400" />;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-xs">
      <p className="font-semibold mb-1 text-foreground">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span>{p.name}:</span>
          <span className="font-medium text-foreground">{p.value} units</span>
        </div>
      ))}
    </div>
  );
};

const ProductDetailPanel = ({ product, onClose }) => {
  if (!product) return null;

  /* Build chart data — actual 12 months + 6 month forecast */
  const actualData = MONTH_LABELS.map((m, i) => ({
    month: m,
    actual: product.monthlySales[i],
  }));
  const forecastData = (product.forecast ?? []).map((f) => ({
    month: f.month,
    forecast: f.forecast,
  }));
  const chartData = [...actualData, ...forecastData];

  const reorder = product.reorder;
  const stockStatusColor =
    reorder.stockStatus === "critical" ? "text-red-400"
    : reorder.stockStatus === "warning" ? "text-amber-400"
    : "text-emerald-400";

  return (
    <div className="bg-card border border-primary/30 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {product.category} · {product.supplier}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
            product.trend === "rising"
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              : product.trend === "declining"
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
          }`}>
            {trendIcon(product.trend)}
            {product.trend} · {product.growthRate > 0 ? "+" : ""}{product.growthRate}% YoY
          </span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue", value: fmt(product.totalRevenue), color: "text-emerald-400" },
          { label: "Margin",        value: `${product.margin}%`,      color: "text-blue-400" },
          { label: "Cost Price",    value: `₹${product.costPrice}`,   color: "text-muted-foreground" },
          { label: "Selling Price", value: `₹${product.sellingPrice}`,color: "text-primary" },
        ].map((k) => (
          <div key={k.label} className="bg-background/50 rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className={`text-lg font-bold mt-1 ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Sales history + forecast chart */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">
          Sales History (12 months) + 6-Month Forecast
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
            <YAxis tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="actual"   stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Units Sold" />
            <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Forecast" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Reorder + Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reorder recommendation */}
        <div className="bg-background/50 rounded-xl p-4">
          <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Boxes className="w-4 h-4 text-primary" /> Supply Recommendation
          </p>
          <div className="space-y-2 text-sm">
            {[
              { label: "Current Stock",     value: `${reorder.currentStock} units`,      cls: stockStatusColor },
              { label: "Safety Stock (Min)",value: `${reorder.safetyStock} units`,        cls: "text-foreground" },
              { label: "Reorder Point",     value: `${reorder.reorderPoint} units`,       cls: "text-foreground" },
              { label: "Recommended Order", value: `${reorder.recommendedOrder} units`,   cls: "text-primary font-bold" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={row.cls}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-background/50 rounded-xl p-4">
          <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Predictive Insights
          </p>
          <ul className="space-y-2">
            {(product.insights ?? []).map((ins, i) => (
              <li key={i} className="text-xs text-muted-foreground leading-relaxed">{ins}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market scenarios */}
      {product.scenarios?.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            📊 Profit/Loss Scenarios (next 6 months)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.scenarios.map((s) => (
              <div
                key={s.shift}
                className={`rounded-xl p-4 border text-center ${
                  s.shift > 0
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : s.shift < 0
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-blue-500/10 border-blue-500/30"
                }`}
              >
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-lg font-bold mt-1 ${
                  s.shift > 0 ? "text-emerald-400" : s.shift < 0 ? "text-red-400" : "text-blue-400"
                }`}>
                  {fmt(s.projectedRevenue)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Profit: {fmt(s.projectedProfit)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPanel;