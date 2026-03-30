import { useState, useMemo } from "react";
import { BarChart3, RefreshCw, Search, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/AppLayout";

import useAnalytics from "@/hooks/useAnalytics";
import KPICards          from "@/components/analytics/KPICards";
import RevenueChart      from "@/components/analytics/RevenueChart";
import ForecastChart     from "@/components/analytics/ForecastChart";
import TopBottomProducts from "@/components/analytics/TopBottomProducts";
import ProductCard       from "@/components/analytics/ProductCard";
import ProductDetailPanel from "@/components/analytics/ProductDetailPanel";
import LowStockAlerts    from "@/components/analytics/LowStockAlerts";

/* ── tabs ── */
const TABS = [
  { id: "overview",  label: "Overview" },
  { id: "products",  label: "Products" },
  { id: "forecast",  label: "Forecast" },
];

const Analytics = () => {
  const { data, isLoading, error, refresh } = useAnalytics();

  const [activeTab,      setActiveTab]      = useState("overview");
  const [query,          setQuery]          = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ── search / filter products ── */
  const filteredProducts = useMemo(() => {
    if (!data?.productAnalytics) return [];
    if (!query.trim()) return data.productAnalytics;
    const q = query.toLowerCase();
    return data.productAnalytics.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [data, query]);

  /* ── select product (from any panel) ── */
  const handleProductClick = (product) => {
    // product may be an object or just a name string (from low stock alerts)
    const found =
      typeof product === "string"
        ? data?.productAnalytics?.find((p) => p.name === product)
        : product;
    if (found) {
      setSelectedProduct(found);
      setActiveTab("products");
    }
  };

  /* ── loading ── */
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Analysing your business data…</p>
        </div>
      </AppLayout>
    );
  }

  /* ── error ── */
  if (error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-red-400 font-medium">{error}</p>
          <Button onClick={refresh} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              Analytics & Intelligence
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Predictive insights powered by your real sales data
            </p>
          </div>
          <Button
            onClick={refresh}
            variant="outline"
            className="gap-2 border-white/20 bg-white/5 hover:bg-white/10 self-start sm:self-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* ── KPI CARDS ── */}
        <KPICards kpis={data?.kpis} />

        {/* ── LOW STOCK ALERTS ── */}
        <LowStockAlerts
          alerts={data?.lowStockAlerts}
          onProductClick={handleProductClick}
        />

        {/* ── TABS ── */}
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════ OVERVIEW TAB ══════════ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <RevenueChart monthlyData={data?.monthlyData} />
            <TopBottomProducts
              topProducts={data?.topProducts}
              bottomProducts={data?.bottomProducts}
              onProductClick={handleProductClick}
            />
          </div>
        )}

        {/* ══════════ PRODUCTS TAB ══════════ */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name or category…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedProduct(null);
                }}
                className="pl-9 bg-white/5 border-white/20"
              />
            </div>

            {/* Selected product detail */}
            {selectedProduct && (
              <ProductDetailPanel
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
              />
            )}

            {/* Product grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.productId}
                  product={p}
                  onClick={setSelectedProduct}
                />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No products found for <strong>{query}</strong></p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ FORECAST TAB ══════════ */}
        {activeTab === "forecast" && (
          <div className="space-y-6">
            <ForecastChart revenueForecast={data?.revenueForecast} />

            {/* Per-product forecast table */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-foreground">Product Demand Forecast</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Predicted unit demand per product — next 6 months
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Product</th>
                      {(data?.productAnalytics?.[0]?.forecast ?? []).map((f) => (
                        <th key={f.month} className="text-center py-3 px-2 text-muted-foreground font-medium">
                          {f.month}
                        </th>
                      ))}
                      <th className="text-center py-3 px-2 text-muted-foreground font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.productAnalytics?.map((p) => (
                      <tr
                        key={p.productId}
                        className="border-b border-border/50 hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedProduct(p);
                          setActiveTab("products");
                        }}
                      >
                        <td className="py-3 px-2 font-medium text-foreground">{p.name}</td>
                        {(p.forecast ?? []).map((f, i) => (
                          <td key={i} className="text-center py-3 px-2 text-muted-foreground">
                            {f.forecast}
                          </td>
                        ))}
                        <td className="text-center py-3 px-2">
                          <span className={`text-xs font-medium ${
                            p.trend === "rising"    ? "text-emerald-400"
                            : p.trend === "declining" ? "text-red-400"
                            : "text-blue-400"
                          }`}>
                            {p.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!data?.productAnalytics?.length && (
                  <p className="text-center text-muted-foreground py-8 text-sm">
                    No product data available yet. Add some sales to see forecasts.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default Analytics;