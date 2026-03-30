import { LineChart, Line, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const fmt = (v) =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v.toLocaleString("en-IN")}`;

const trendConfig = {
  rising:   { color: "#22c55e", Icon: TrendingUp,   badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  declining:{ color: "#ef4444", Icon: TrendingDown,  badge: "bg-red-500/20 text-red-400 border-red-500/30" },
  stable:   { color: "#6366f1", Icon: Minus,         badge: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
};

const ProductCard = ({ product, onClick }) => {
  const cfg = trendConfig[product.trend] ?? trendConfig.stable;
  const Icon = cfg.Icon;

  const sparkData = product.monthlySales.map((v, i) => ({ i, v }));

  return (
    <div
      onClick={() => onClick(product)}
      className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/50 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {product.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {product.category} · {product.supplier !== "—" ? product.supplier : "No supplier"}
          </p>
        </div>
        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ml-2 ${cfg.badge}`}>
          <Icon className="w-3 h-3" />
          {product.growthRate > 0 ? "+" : ""}{product.growthRate}%
        </span>
      </div>

      {/* Sparkline */}
      <ResponsiveContainer width="100%" height={48}>
        <LineChart data={sparkData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={cfg.color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Revenue</p>
          <p className="text-sm font-semibold text-foreground">{fmt(product.totalRevenue)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Stock</p>
          <p className={`text-sm font-semibold ${
            product.stock <= product.lowStockThreshold ? "text-red-400" : "text-emerald-400"
          }`}>
            {product.stock} {product.unit}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Margin</p>
          <p className="text-sm font-semibold text-foreground">{product.margin}%</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;