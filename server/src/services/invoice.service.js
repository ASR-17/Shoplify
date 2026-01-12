import Invoice from "../models/Invoice.model.js";
import generateInvoiceNumber from "../utils/generateInvoiceNumber.js";

export const createInvoiceFromSale = async (sale, userId) => {
  const invoiceNumber = await generateInvoiceNumber();

  const items = [
    {
      productName: sale.productName,
      quantity: sale.quantity,
      pricePerItem: sale.pricePerItem,
      total: sale.totalAmount,
    },
  ];

  const invoice = await Invoice.create({
    invoiceNumber,
    sale: sale._id,
    customerName: sale.customerName,
    items,
    totalAmount: sale.totalAmount,
    paymentType: sale.paymentType,
    createdBy: userId,
  });

  return invoice;
};
