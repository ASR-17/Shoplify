import Counter from "../models/Counter.model.js";

const generateInvoiceNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "invoice" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `INV-${String(counter.seq).padStart(3, "0")}`;
};

export default generateInvoiceNumber;
