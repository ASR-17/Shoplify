import {
  IndianRupee,
  Wallet,
  TrendingUp,
  Clock,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import KPICard from "@/components/dashboard/KPICard";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import TopProductsChart from "@/components/dashboard/TopProductsChart";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import DashboardFilters from "@/components/dashboard/DashboardFilters";

import AppLayout from "@/layouts/AppLayout";
import useDashboard from "@/hooks/useDashboard";
import formatCurrency from "@/utils/formatCurrency";

const Dashboard = () => {
  const {
    kpis,
    chartData,
    topProducts,
    alerts,
    loading,
    updateFilters,
    refreshDashboard,
  } = useDashboard();

  /* ================= SAFE FALLBACKS ================= */
  const safeKpis = {
    totalSales: kpis?.totalSales ?? 0,
    totalExpenses: kpis?.totalExpenses ?? 0,
    currentProfit: kpis?.currentProfit ?? 0,
    pendingPayments: kpis?.pendingPayments ?? 0,
    salesTrend: kpis?.salesTrend ?? 0,
    expensesTrend: kpis?.expensesTrend ?? 0,
    profitTrend: kpis?.profitTrend ?? 0,
    pendingTrend: kpis?.pendingTrend ?? 0,
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor your shop&apos;s performance at a glance
            </p>
          </div>

          <Button
            onClick={refreshDashboard}
            disabled={loading}
            variant="outline"
            className="gap-2 border-white/20 bg-white/5 hover:bg-white/10"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* ================= FILTERS ================= */}
        <DashboardFilters onFilterChange={updateFilters} />

        {/* ================= KPI CARDS ================= */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Sales"
            value={formatCurrency(safeKpis.totalSales)}
            trend={safeKpis.salesTrend}
            icon={IndianRupee}
            gradient="green"
          />

          <KPICard
            title="Total Expenses"
            value={formatCurrency(safeKpis.totalExpenses)}
            trend={safeKpis.expensesTrend}
            icon={Wallet}
            gradient="purple"
          />

          <KPICard
            title="Current Month Profit"
            value={formatCurrency(safeKpis.currentProfit)}
            trend={safeKpis.profitTrend}
            icon={TrendingUp}
            gradient="blue"
          />

          <KPICard
            title="Pending Payments"
            value={formatCurrency(safeKpis.pendingPayments)}
            trend={safeKpis.pendingTrend}
            icon={Clock}
            gradient="orange"
          />
        </div>

        {/* ================= CHARTS ================= */}
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <IncomeExpenseChart
              data={chartData ?? []}
              onFilterChange={updateFilters} // ✅ FIXED
            />
          </div>

          <div>
            <TopProductsChart data={topProducts ?? []} />
          </div>
        </div>

        {/* ================= ALERTS ================= */}
        <AlertsPanel alerts={alerts ?? []} />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
