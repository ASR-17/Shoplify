import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const fmt = (v) =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v.toLocaleString("en-IN")}`;

const TrendIcon = ({ trend }) => {
  if (trend === "rising")   return <TrendingUp   className="w-4 h-4 text-emerald-400" />;
  if (trend === "declining") return <TrendingDown className="w-4 h-4 text-red-400" />;
  return <Minus className="w-4 h-4 text-blue-400" />;
};

const trendColor = (trend) =>
  trend === "rising" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
  : trend === "declining" ? "text-red-400 bg-red-500/10 border-red-500/20"
  : "text-blue-400 bg-blue-500/10 border-blue-500/20";

const ProductRow = ({ product, rank, onClick }) => (
  <div
    onClick={() => onClick(product)}
    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
  >
    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
      {rank}
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
        {product.name}
      </p>
      <p className="text-xs text-muted-foreground">{product.category}</p>
    </div>
    <div className="text-right flex-shrink-0">
      <p className="text-sm font-semibold text-foreground">{fmt(product.totalRevenue)}</p>
      <p className="text-xs text-muted-foreground">{product.margin}% margin</p>
    </div>
    <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${trendColor(product.trend)} flex-shrink-0`}>
      <TrendIcon trend={product.trend} />
      {product.trend}
    </span>
  </div>
);

const TopBottomProducts = ({ topProducts, bottomProducts, onProductClick }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Top performers */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-foreground">Top Performers</h2>
            <p className="text-xs text-muted-foreground">Highest revenue products</p>
          </div>
        </div>
        <div className="space-y-1">
          {topProducts?.map((p, i) => (
            <ProductRow key={p.productId} product={p} rank={i + 1} onClick={onProductClick} />
          ))}
          {!topProducts?.length && (
            <p className="text-sm text-muted-foreground text-center py-6">No data yet</p>
          )}
        </div>
      </div>

      {/* Bottom performers */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-red-400" />
          <div>
            <h2 className="text-base font-bold text-foreground">Needs Attention</h2>
            <p className="text-xs text-muted-foreground">Lowest performing products</p>
          </div>
        </div>
        <div className="space-y-1">
          {bottomProducts?.map((p, i) => (
            <ProductRow key={p.productId} product={p} rank={i + 1} onClick={onProductClick} />
          ))}
          {!bottomProducts?.length && (
            <p className="text-sm text-muted-foreground text-center py-6">No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBottomProducts;