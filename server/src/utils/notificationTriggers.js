import { createNotification } from "../services/notification.service.js";

/* ===============================
   SALE CREATED
================================ */
export const notifyNewSale = async (sale) => {
  await createNotification({
    user: sale.createdBy,
    type: "new_sale",
    title: `New Sale Recorded – ₹${sale.totalAmount}`,
    description: `Payment via ${sale.paymentType}`,
    severity: "info",
    actionLabel: "View Sale",
    actionUrl: "/sales/records",
    metadata: { saleId: sale._id },
  });
};

/* ===============================
   INVOICE GENERATED
================================ */
export const notifyInvoiceGenerated = async (invoice) => {
  await createNotification({
    user: invoice.createdBy,
    type: "invoice_generated",
    title: `Invoice Generated – ${invoice.invoiceNumber}`,
    description: "Invoice is ready for download",
    severity: "info",
    actionLabel: "View Invoice",
    actionUrl: "/invoices",
    metadata: { invoiceId: invoice._id },
  });
};

/* ===============================
   LOW STOCK
================================ */
export const notifyLowStock = async (product, userId) => {
  await createNotification({
    user: userId,
    type: "low_stock",
    title: `Low Stock – ${product.name}`,
    description: `Only ${product.quantity} units remaining`,
    severity: "warning",
    actionLabel: "View Inventory",
    actionUrl: "/inventory",
    metadata: { productId: product._id },
  });
};

/* ===============================
   OUT OF STOCK (CRITICAL)
================================ */
export const notifyOutOfStock = async (product, userId) => {
  await createNotification({
    user: userId,
    type: "out_of_stock",
    title: `Out of Stock – ${product.name}`,
    description: "Stock depleted. Immediate restock required.",
    severity: "critical",
    actionLabel: "Restock Now",
    actionUrl: "/inventory",
    metadata: { productId: product._id },
  });
};

/* ===============================
   PRODUCT CREATED
================================ */
export const notifyProductCreated = async (product, userId) => {
  await createNotification({
    user: userId,
    type: "product_created",
    title: "New Product Added",
    description: `Product "${product.name}" added to inventory`,
    severity: "info",
    actionLabel: "View Product",
    actionUrl: "/inventory",
    metadata: { productId: product._id },
  });
};
