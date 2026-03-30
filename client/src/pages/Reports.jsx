import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

import AppLayout from "@/layouts/AppLayout";

import ReportTypeSelector from "@/components/reports/ReportTypeSelector";
import ReportFilters      from "@/components/reports/ReportFilters";
import ReportSummaryCards from "@/components/reports/ReportSummaryCards";
import ReportCharts       from "@/components/reports/ReportCharts";
import ReportDataTable    from "@/components/reports/ReportDataTable";
import ExportActions      from "@/components/reports/ExportActions";
import ProductWiseTable   from "@/components/reports/ProductWiseTable";
import TopProductsChart   from "@/components/reports/TopProductsChart";
import AlertsPanel        from "@/components/reports/AlertsPanel";

import useReports from "@/hooks/useReports";

const Reports = () => {
  const {
    reportType,  setReportType,
    dateRange,   setDateRange,

    summary,
    timeSeries,
    categoryData,
    transactions,
    topProducts,
    productWise,
    alerts,

    currentPage,  setCurrentPage,
    totalPages,
    sortColumn,
    sortDirection,
    isLoading,

    applyFilters,
    refreshReports,
    handleSort,
    exportReport,
  } = useReports();

  return (
    <AppLayout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Reports & Analytics
            </h1>
            <p className="text-white/60 mt-1">
              Monitor performance, analyse trends and export your business records
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={refreshReports}
              disabled={isLoading}
              variant="outline"
              className="gap-2 border-white/20 bg-white/5 hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <ExportActions onExport={exportReport} onPrint={() => window.print()} />
          </div>
        </div>

        {/* ===== QUICK DATE FILTERS (Today / Week / Month / Year) ===== */}
        <ReportFilters
          dateRange={dateRange}
          onDateRangeChange={(val) => {
            setDateRange(val);
            applyFilters({ dateRange: val });
          }}
        />

        {/* ===== REPORT TYPE (Sales / Expense only) ===== */}
        <ReportTypeSelector
          activeType={reportType}
          onTypeChange={(val) => {
            setReportType(val);
            applyFilters({ reportType: val });
          }}
        />

        {/* ===== SUMMARY CARDS ===== */}
        {summary && (
          <ReportSummaryCards data={summary} reportType={reportType} />
        )}

        {/* ===== CHART + TOP PRODUCTS ===== */}
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <ReportCharts
              reportType={reportType}
              timeSeriesData={timeSeries}
              categoryData={categoryData}
            />
          </div>
          <div>
            <TopProductsChart data={topProducts} />
          </div>
        </div>

        {/* ===== PRODUCT-WISE DETAILS ===== */}
        <ProductWiseTable data={productWise} isLoading={isLoading} />

        {/* ===== ALERTS ===== */}
        <AlertsPanel alerts={alerts} />

        {/* ===== TRANSACTIONS ===== */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Transaction Details
          </h3>
          <ReportDataTable
            data={transactions}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
        </div>

      </div>
    </AppLayout>
  );
};

export default Reports;