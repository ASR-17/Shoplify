import { AlertTriangle, ChevronRight } from "lucide-react";

const LowStockAlerts = ({ alerts, onProductClick }) => {
  if (!alerts?.length) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        <h3 className="font-semibold text-red-400">
          Low Stock Alerts ({alerts.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {alerts.map((p, i) => (
          <div
            key={i}
            onClick={() => onProductClick?.(p.name)}
            className="bg-background/50 rounded-xl p-3 cursor-pointer hover:bg-background/80 transition-colors"
          >
            <p className="font-medium text-sm text-foreground">{p.name}</p>
            <div className="flex items-center justify-between mt-2">
              <div>
                <span className="text-xs text-red-400 font-semibold">
                  {p.stock} units left
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  (min: {p.threshold})
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-400"
                style={{
                  width: `${Math.min(100, (p.stock / p.threshold) * 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlerts;