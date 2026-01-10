import { cn } from "@/lib/utils";

const StockBadge = ({ quantity, lowStockThreshold }) => {
  const isLowStock = quantity <= lowStockThreshold;
  const isOutOfStock = quantity === 0;

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs border font-medium",
        isOutOfStock
          ? "bg-destructive/20 text-destructive border-destructive/30"
          : isLowStock
          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
          : "bg-green-500/20 text-green-400 border-green-500/30"
      )}
    >
      {isOutOfStock
        ? "Out of Stock"
        : isLowStock
        ? "Low Stock"
        : "In Stock"}
    </span>
  );
};

export default StockBadge;
