import { useEffect, useMemo, useState } from "react";
import invoiceService from "@/services/invoice.service";

const useInvoices = () => {
  /* ================= STATE ================= */
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 10;

  /* ================= FETCH ================= */
  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const data = await invoiceService.getInvoices();

      const normalized = Array.isArray(data)
        ? data.map(inv => ({
            ...inv,
            date: inv.createdAt, // unify date usage
          }))
        : [];

      setInvoices(normalized);
      setFilteredInvoices(normalized);
    } catch (err) {
      console.error("Failed to load invoices", err);
      setInvoices([]);
      setFilteredInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= FILTERS ================= */
const applyFilters = (filters = {}) => {
  let filtered = [...invoices];
  const now = new Date();

  /* PAYMENT */
  if (filters.paymentType !== "all") {
    filtered = filtered.filter(
      (i) => i.paymentType === filters.paymentType
    );
  }

  /* DATE */
  if (filters.dateRange !== "timeline") {
    filtered = filtered.filter((inv) => {
      const date = new Date(inv.createdAt);

      if (filters.dateRange === "today") {
        return date.toDateString() === now.toDateString();
      }

      if (filters.dateRange === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return date >= weekAgo && date <= now;
      }

      if (filters.dateRange === "month") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return date >= start && date <= now;
      }

      if (
        filters.dateRange === "custom" &&
        filters.startDate &&
        filters.endDate
      ) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        return date >= start && date <= end;
      }

      return true;
    });
  }

  setFilteredInvoices(filtered);
  setCurrentPage(1);
};



  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const paginatedInvoices = useMemo(() => {
    return filteredInvoices.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredInvoices, currentPage]);

  /* ================= ACTIONS ================= */
  const openPreview = (invoice) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setSelectedInvoice(null);
    setIsPreviewOpen(false);
  };

  const printInvoice = () => {
    window.print();
  };

  const downloadInvoice = async (invoice) => {
    if (!invoice?._id) return;
    await invoiceService.downloadInvoicePDF(invoice._id);
  };

  const shareInvoice = async (invoice, method) => {
    if (!invoice?._id) return;
    await invoiceService.shareInvoice(invoice._id, method);
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices: paginatedInvoices,
    allInvoices: filteredInvoices,
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

    /** ✅ ADD THIS */
  refetchInvoices: fetchInvoices,
  };
};

export default useInvoices;
