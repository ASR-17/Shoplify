import AppLayout from "@/layouts/AppLayout";

import ReportTypeSelector from "@/components/reports/ReportTypeSelector";
import ReportFilters from "@/components/reports/ReportFilters";
import ReportSummaryCards from "@/components/reports/ReportSummaryCards";
import ReportCharts from "@/components/reports/ReportCharts";
import ReportDataTable from "@/components/reports/ReportDataTable";
import ExportActions from "@/components/reports/ExportActions";

import useReports from "@/hooks/useReports";

const Reports = () => {
  const {
    // ================= STATE =================
    reportType,
    dateRange,
    customDateFrom,
    customDateTo,
    createdBy,
    paymentMode,
    category,

    summary,
    timeSeries,
    categoryData,
    transactions,

    currentPage,
    totalPages,
    sortColumn,
    sortDirection,
    isLoading,

    // ================= SETTERS =================
    setReportType,
    setDateRange,
    setCustomDateFrom,
    setCustomDateTo,
    setCreatedBy,
    setPaymentMode,
    setCategory,
    setCurrentPage,

    // ================= ACTIONS =================
    applyFilters,
    clearFilters,
    handleSort,
    exportReport,
  } = useReports();

  return (
    <AppLayout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Reports & Export
            </h1>
            <p className="text-white/60 mt-1">
              Generate, analyze, and export your business records
            </p>
          </div>

          <ExportActions
            onExport={exportReport}
            onPrint={() => window.print()}
          />
        </div>

        {/* ================= REPORT TYPE ================= */}
        <ReportTypeSelector
          activeType={reportType}
          onTypeChange={setReportType}
        />

        {/* ================= FILTERS ================= */}
        <ReportFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          customDateFrom={customDateFrom}
          customDateTo={customDateTo}
          onCustomDateFromChange={setCustomDateFrom}
          onCustomDateToChange={setCustomDateTo}
          createdBy={createdBy}
          onCreatedByChange={setCreatedBy}
          paymentMode={paymentMode}
          onPaymentModeChange={setPaymentMode}
          category={category}
          onCategoryChange={setCategory}
          onApply={applyFilters}
          onClear={clearFilters}
        />

        {/* ================= SUMMARY ================= */}
        {summary && (
          <ReportSummaryCards
            data={summary}
            reportType={reportType}
          />
        )}

        {/* ================= CHARTS ================= */}
        <ReportCharts
          reportType={reportType}
          timeSeriesData={timeSeries}
          categoryData={categoryData}
        />

        {/* ================= TABLE ================= */}
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
