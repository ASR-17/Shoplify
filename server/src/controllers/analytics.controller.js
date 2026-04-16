import Sale from "../models/sale.model.js";
import Product from "../models/product.model.js";
import Expense from "../models/expense.model.js";

/* ─── helpers ─────────────────────────────────────── */

// Weighted moving average — recent months count more
const wma = (arr) => {
  if (!arr.length) return 0;
  const weights = arr.map((_, i) => i + 1);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  return arr.reduce((sum, val, i) => sum + val * weights[i], 0) / totalWeight;
};

// Linear regression slope — positive = rising, negative = declining
const slope = (arr) => {
  const n = arr.length;
  if (n < 2) return 0;
  const meanX = (n - 1) / 2;
  const meanY = arr.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  arr.forEach((y, x) => {
    num += (x - meanX) * (y - meanY);
    den += (x - meanX) ** 2;
  });
  return den === 0 ? 0 : num / den;
};

// Standard deviation for safety stock
const stdDev = (arr) => {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length);
};

// Seasonal index per month (retail-typical, index 1.0 = average)
const SEASONAL = [0.82, 0.78, 0.95, 0.90, 1.00, 0.92,
                  0.88, 0.95, 1.02, 1.08, 1.25, 1.45];

// Last N months as { year, month (0-indexed) } objects
const lastNMonths = (n) => {
  const result = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  return result;
};

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun",
                      "Jul","Aug","Sep","Oct","Nov","Dec"];

/* ─── main controller ─────────────────────────────── */
export const getAnalyticsSummary = async (req, res) => {
  try {
    const months12 = lastNMonths(12);
    const startDate = new Date(months12[0].year, months12[0].month, 1);

    /* ── 1. Pull raw sales (last 12 months) ── */
    const rawSales = await Sale.find({ soldAt: { $gte: startDate } })
      .populate("productId", "costPrice sellingPrice name category")
      .lean();

    /* ── 2. Pull expenses (last 12 months) ── */
    const rawExpenses = await Expense.find({ date: { $gte: startDate } }).lean();

    /* ── 3. Monthly revenue + expense + profit ── */
    const monthlyMap = {};
    months12.forEach(({ year, month }) => {
      const key = `${year}-${month}`;
      monthlyMap[key] = { label: MONTH_LABELS[month], revenue: 0, expenses: 0, profit: 0, orders: 0 };
    });

    rawSales.forEach((s) => {
      const d = new Date(s.soldAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthlyMap[key]) return;
      const cost = s.productId?.costPrice ?? 0;
      monthlyMap[key].revenue += s.totalAmount;
      monthlyMap[key].profit  += (s.pricePerItem - cost) * s.quantity;
      monthlyMap[key].orders  += 1;
    });

    rawExpenses.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthlyMap[key]) return;
      monthlyMap[key].expenses += e.amount;
      monthlyMap[key].profit   -= e.amount;
    });

    const monthlyData = Object.values(monthlyMap);

    /* ── 4. Per-product monthly units sold ── */
    const productSalesMap = {}; // productId → [units per month × 12]

    rawSales.forEach((s) => {
      const pid = s.productId?._id?.toString() ?? s.productName;
      if (!productSalesMap[pid]) {
        productSalesMap[pid] = {
          name: s.productId?.name ?? s.productName,
          category: s.productId?.category ?? "—",
          costPrice: s.productId?.costPrice ?? 0,
          sellingPrice: s.pricePerItem,
          units: new Array(12).fill(0),
          revenue: 0,
        };
      }
      const d = new Date(s.soldAt);
      const idx = months12.findIndex(
        (m) => m.year === d.getFullYear() && m.month === d.getMonth()
      );
      if (idx !== -1) productSalesMap[pid].units[idx] += s.quantity;
      productSalesMap[pid].revenue += s.totalAmount;
      productSalesMap[pid].sellingPrice = s.pricePerItem; // use latest
    });

    /* ── 5. Fetch all products for stock info ── */
    const allProducts = await Product.find({}).lean();
    const productStockMap = {};
    allProducts.forEach((p) => {
      productStockMap[p._id.toString()] = {
        stock: p.quantity,
        lowStockThreshold: p.lowStockThreshold,
        costPrice: p.costPrice,
        sellingPrice: p.sellingPrice,
        status: p.status,
        supplier: p.supplier,
        unit: p.unit,
      };
    });

    /* ── 6. Build per-product analytics ── */
    const productAnalytics = Object.entries(productSalesMap).map(([pid, data]) => {
      const units = data.units; // 12-month array
      const stockInfo = productStockMap[pid] ?? {};
      const totalUnits = units.reduce((a, b) => a + b, 0);
      const margin = data.sellingPrice > 0
        ? (((data.sellingPrice - data.costPrice) / data.sellingPrice) * 100).toFixed(1)
        : "0.0";

      // Trend via slope on last 6 months
      const last6 = units.slice(-6);
      const trendSlope = slope(last6);
      const trend = trendSlope > 0.5 ? "rising" : trendSlope < -0.5 ? "declining" : "stable";
      const growthRate = last6[0] > 0
        ? (((last6[5] - last6[0]) / last6[0]) * 100).toFixed(1)
        : "0.0";

      // Demand forecast — next 6 months
      const forecastMonths = [];
      const now = new Date();
      for (let i = 1; i <= 6; i++) {
        const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const mIdx = futureDate.getMonth();
        const base = wma(units.slice(-6));
        const seasonal = SEASONAL[mIdx];
        const trendBoost = trendSlope * i * 0.5;
        const predicted = Math.max(0, Math.round(base * seasonal + trendBoost));
        forecastMonths.push({
          month: `${MONTH_LABELS[mIdx]} '${String(futureDate.getFullYear()).slice(2)}`,
          forecast: predicted,
        });
      }

      // Reorder recommendation
      const avgDaily = totalUnits / 365;
      const demandStdDev = stdDev(units.filter((u) => u > 0).length ? units : [0]);
      const safetyStock = Math.ceil(1.65 * demandStdDev); // 95% service level
      const reorderPoint = Math.ceil(avgDaily * 7 + safetyStock);
      const recommendedOrder = Math.ceil(wma(units.slice(-3)) * 2);

      // Profit scenarios
      const baseMonthlyRevenue = data.revenue / 12;
      const baseCost = data.costPrice;
      const scenarios = [-15, 0, 15].map((shift) => ({
        label: shift > 0 ? `+${shift}% market growth` : shift < 0 ? `${shift}% market dip` : "Stable market",
        shift,
        projectedRevenue: Math.round(baseMonthlyRevenue * (1 + shift / 100) * 6),
        projectedProfit: Math.round(
          (data.sellingPrice * (1 + shift / 100) - baseCost) *
          wma(units.slice(-3)) * 6
        ),
      }));

      return {
        productId: pid,
        name: data.name,
        category: data.category,
        costPrice: data.costPrice,
        sellingPrice: data.sellingPrice,
        stock: stockInfo.stock ?? 0,
        lowStockThreshold: stockInfo.lowStockThreshold ?? 10,
        status: stockInfo.status ?? "—",
        supplier: stockInfo.supplier ?? "—",
        unit: stockInfo.unit ?? "pcs",
        margin: parseFloat(margin),
        totalUnits,
        totalRevenue: Math.round(data.revenue),
        trend,
        growthRate: parseFloat(growthRate),
        monthlySales: units,
        forecast: forecastMonths,
        reorder: {
          safetyStock,
          reorderPoint,
          recommendedOrder,
          currentStock: stockInfo.stock ?? 0,
          stockStatus:
            (stockInfo.stock ?? 0) <= (stockInfo.lowStockThreshold ?? 10)
              ? "critical"
              : (stockInfo.stock ?? 0) <= reorderPoint
              ? "warning"
              : "ok",
        },
        scenarios,
        insights: buildInsights(data, trend, growthRate, margin, stockInfo, reorderPoint, recommendedOrder, units),
      };
    });

    /* ── 7. Top / bottom performers ── */
    const sorted = [...productAnalytics].sort((a, b) => b.totalRevenue - a.totalRevenue);
    const topProducts = sorted.slice(0, 5);
    const bottomProducts = sorted.slice(-3).reverse();

    /* ── 8. Low stock alerts ── */
    const lowStockAlerts = allProducts
      .filter((p) => p.quantity <= p.lowStockThreshold)
      .map((p) => ({
        name: p.name,
        stock: p.quantity,
        threshold: p.lowStockThreshold,
        status: p.status,
      }));

    /* ── 9. Overall KPIs ── */
    const totalRevenue = monthlyData.reduce((s, m) => s + m.revenue, 0);
    const totalExpenses = monthlyData.reduce((s, m) => s + m.expenses, 0);
    const totalProfit = monthlyData.reduce((s, m) => s + m.profit, 0);
    const totalOrders = monthlyData.reduce((s, m) => s + m.orders, 0);

    // Revenue forecast — next 6 months from overall trend
    const revenueArr = monthlyData.map((m) => m.revenue);
    const revForecast = [];
    const now = new Date();
    for (let i = 1; i <= 6; i++) {
      const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const mIdx = futureDate.getMonth();
      const base = wma(revenueArr.slice(-6));
      const predicted = Math.round(base * SEASONAL[mIdx]);
      revForecast.push({
        month: `${MONTH_LABELS[mIdx]} '${String(futureDate.getFullYear()).slice(2)}`,
        revenue: predicted,
        profit: Math.round(predicted * (totalProfit / (totalRevenue || 1))),
      });
    }

    res.json({
      success: true,
      data: {
        kpis: { totalRevenue, totalExpenses, totalProfit, totalOrders },
        monthlyData,
        revenueForecast: revForecast,
        productAnalytics,
        topProducts,
        bottomProducts,
        lowStockAlerts,
      },
    });
  } catch (err) {
    console.error("Analytics error ❌", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─── insight generator ───────────────────────────── */
function buildInsights(data, trend, growthRate, margin, stockInfo, reorderPoint, recommendedOrder, units) {
  const insights = [];
  const peakMonth = MONTH_LABELS[units.indexOf(Math.max(...units))];

  if (trend === "rising")
    insights.push(`📈 Sales growing at ${growthRate}% — consider increasing inventory 20–25% before peak season.`);
  else if (trend === "declining")
    insights.push(`📉 Sales declining at ${Math.abs(growthRate)}% — review pricing or run promotions to recover demand.`);
  else
    insights.push(`📊 Demand is stable — maintain current stock with regular reorders.`);

  const stock = stockInfo.stock ?? 0;
  if (stock <= (stockInfo.lowStockThreshold ?? 10))
    insights.push(`🔴 Critical: Only ${stock} units left. Order ${recommendedOrder} units immediately.`);
  else if (stock <= reorderPoint)
    insights.push(`🟡 Approaching reorder point. Order ${recommendedOrder} units within 3–5 days.`);
  else
    insights.push(`🟢 Stock healthy. Next reorder when stock hits ${reorderPoint} units.`);

  const m = parseFloat(margin);
  if (m > 30)
    insights.push(`💰 Excellent margin of ${margin}% — this is a star product. Protect pricing.`);
  else if (m > 15)
    insights.push(`💰 Healthy margin of ${margin}% — room for occasional discounts to drive volume.`);
  else
    insights.push(`💰 Thin margin of ${margin}% — negotiate better cost price with supplier.`);

  insights.push(`📦 Peak demand in ${peakMonth} historically. Stock up 3–4 weeks in advance.`);

  return insights;
}