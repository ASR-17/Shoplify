import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "bg-amber-400",
  "bg-cyan-400",
  "bg-purple-400",
  "bg-emerald-400",
  "bg-orange-400",
  "bg-rose-400",
  "bg-blue-400",
  "bg-pink-400",
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

/**
 * ProductWiseTable
 * Shows product-wise breakdown: units sold, total revenue, avg selling price.
 * Placed below TopProductsChart.
 */
const ProductWiseTable = ({ data = [], isLoading = false }) => {

  /* ---- Loading ---- */
  if (isLoading) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48 bg-white/10" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 w-32 bg-white/10" />
              <Skeleton className="h-8 flex-1 bg-white/10" />
              <Skeleton className="h-8 w-24 bg-white/10" />
              <Skeleton className="h-8 w-24 bg-white/10" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  /* ---- Empty ---- */
  if (!data.length) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <div className="rounded-full bg-white/5 p-4 mb-3">
            <Package className="w-7 h-7 text-white/30" />
          </div>
          <p className="text-white/50 text-sm">No product data available for this period.</p>
        </CardContent>
      </Card>
    );
  }

  /* ---- Max revenue for bar scaling ---- */
  const maxRevenue = Math.max(...data.map((p) => p.revenue));
  const totalRevenue = data.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <TrendingUp className="h-5 w-5 text-primary" />
          Product-wise Sales Breakdown
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* ---- Desktop Table ---- */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60 w-8">#</TableHead>
                <TableHead className="text-white/60">Product</TableHead>
                <TableHead className="text-white/60">Revenue Share</TableHead>
                <TableHead className="text-white/60 text-right">Units Sold</TableHead>
                <TableHead className="text-white/60 text-right">Total Revenue</TableHead>
                <TableHead className="text-white/60 text-right">Avg. Price</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((product, index) => {
                const pct = totalRevenue > 0
                ? Math.round((product.revenue / totalRevenue) * 100)
                : 0;
                const avgPrice = product.unitsSold > 0
                  ? product.revenue / product.unitsSold
                  : 0;

                return (
                  <TableRow
                    key={product.name}
                    className="border-white/10 hover:bg-white/5 transition-colors"
                  >
                    {/* Rank */}
                    <TableCell>
                      <span className="text-white/40 text-sm font-medium">
                        {index === 0 ? "👑" : `#${index + 1}`}
                      </span>
                    </TableCell>

                    {/* Name */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${COLORS[index % COLORS.length]}`}
                        />
                        <span
                          className={
                            index === 0
                              ? "font-semibold text-amber-400"
                              : "text-white/80"
                          }
                        >
                          {product.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Progress bar */}
                    <TableCell className="min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-white/10">
                          <div
                            className={`h-2 rounded-full ${COLORS[index % COLORS.length]} opacity-80`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-white/40 text-xs w-8 text-right">
                          {pct}%
                        </span>
                      </div>
                    </TableCell>

                    {/* Units */}
                    <TableCell className="text-right font-medium text-white/80">
                      {product.unitsSold.toLocaleString()}
                    </TableCell>

                    {/* Revenue */}
                    <TableCell className="text-right font-semibold text-emerald-400">
                      {formatCurrency(product.revenue)}
                    </TableCell>

                    {/* Avg price */}
                    <TableCell className="text-right text-white/60">
                      {formatCurrency(avgPrice)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* ---- Mobile Cards ---- */}
        <div className="md:hidden space-y-3">
          {data.map((product, index) => {
            const avgPrice = product.unitsSold > 0
              ? product.revenue / product.unitsSold
              : 0;

            return (
              <div
                key={product.name}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${COLORS[index % COLORS.length]}`} />
                  <div>
                    <p className={index === 0 ? "font-semibold text-amber-400 text-sm" : "text-white/80 text-sm"}>
                      {index === 0 && "👑 "}{product.name}
                    </p>
                    <p className="text-white/40 text-xs">{product.unitsSold} units · avg {formatCurrency(avgPrice)}</p>
                  </div>
                </div>
                <p className="text-emerald-400 font-semibold text-sm">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductWiseTable;