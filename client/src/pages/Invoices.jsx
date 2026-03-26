import { FileText } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";

import InvoiceFilters from "@/components/invoices/InvoiceFilters";
import InvoicesTable from "@/components/invoices/InvoicesTable";
import InvoicePreview from "@/components/invoices/InvoicePreview";

import useInvoices from "@/hooks/useInvoices";

/* ================= SHOP DETAILS ================= */

const shopDetails = {
  name: "Tech Galaxy Store",
  address: "123 Main Street, Mumbai - 400001",
  phone: "+91 98765 43210",
  email: "contact@techgalaxy.com",
  gstNumber: "27AABCU9603R1ZM",
};

/* ================= PAGE ================= */

const Invoices = () => {
  const {
    invoices,
    allInvoices,
    selectedInvoice,

    isPreviewOpen,
    isLoading,

    currentPage,
    totalPages,

    setCurrentPage,
    applyFilters,
    openPreview,
    closePreview,
    printInvoice,
    downloadInvoice,
    shareInvoice,
  } = useInvoices();

  const safeInvoices = Array.isArray(allInvoices) ? allInvoices : [];

  const totalSales = safeInvoices.reduce(
    (sum, inv) => sum + (inv.totalAmount || 0),
    0
  );

  return (
    <AppLayout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ================= HEADER ================= */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              Invoices & Billing
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage invoices generated from sales
            </p>
          </div>

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-bold">{safeInvoices.length}</p>
            </div>

            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-400">
                ₹{totalSales.toLocaleString()}
              </p>
            </div>

            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground">Cash Payments</p>
              <p className="text-2xl font-bold">
                {safeInvoices.filter(i => i.paymentType === "cash").length}
              </p>
            </div>

            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground">Digital Payments</p>
              <p className="text-2xl font-bold">
                {safeInvoices.filter(i => i.paymentType !== "cash").length}
              </p>
            </div>
          </div>

          {/* ================= FILTERS ================= */}
          <InvoiceFilters onFiltersChange={applyFilters} />

          {/* ================= TABLE ================= */}
          <InvoicesTable
            invoices={invoices}
            onView={openPreview}
            onPrint={(invoice) => {
              openPreview(invoice); // Pehle popup kholenge
              setTimeout(() => window.print(), 300); // 0.3 sec baad print command bhejenge
            }}
            onDownload={downloadInvoice}
            onShare={shareInvoice}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />

          {/* ================= PREVIEW ================= */}
          <InvoicePreview
            invoice={selectedInvoice}
            shopDetails={shopDetails}
            isOpen={isPreviewOpen}
            onClose={closePreview}
            onPrint={printInvoice}
            onDownload={() => selectedInvoice && downloadInvoice(selectedInvoice)}
            onShare={(method) =>
              selectedInvoice && shareInvoice(selectedInvoice, method)
            }
          />
        </div>

        {/* ================= PRINT STYLES ================= */}
        <style>{`
          @media print {
            @page {
              size: A4;
              margin: 0; /* Extra blank page hatane ke liye margin 0 */
            }

            body {
              background: white !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            body * {
              visibility: hidden;
            }

            #invoice-print, #invoice-print * {
              visibility: visible;
            }

            div[role="dialog"], div[data-state="open"] {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              transform: none !important;
              width: 100% !important;
              height: 100% !important;
              overflow: hidden !important;
            }

            #invoice-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 15mm !important; /* Page ke andar padding */
              page-break-after: avoid; /* Extra page rokne ke liye */
              page-break-before: avoid;
            }

            button, nav, header, footer {
              display: none !important;
            }
          }
        `}</style>


      </div>
    </AppLayout>
  );
};

export default Invoices;
