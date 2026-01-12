import api from "./api";

/**
 * Fetch invoices (generated from sales)
 */
const getInvoices = async (params = {}) => {
  const { data } = await api.get("/invoices", { params });
  return data;
};

/**
 * Download invoice PDF
 */
const downloadInvoicePDF = async (invoiceId) => {
  const response = await api.get(`/invoices/${invoiceId}/pdf`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${invoiceId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

/**
 * Share invoice (email / whatsapp)
 */
const shareInvoice = async (invoiceId, method) => {
  const { data } = await api.post(`/invoices/${invoiceId}/share`, {
    method,
  });
  return data;
};

export default {
  getInvoices,
  downloadInvoicePDF,
  shareInvoice,
};
