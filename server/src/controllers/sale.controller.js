import Sale from "../models/Sale.model.js";
import Product from "../models/product.model.js";
import Invoice from "../models/Invoice.model.js";
import generateInvoiceNumber from "../utils/generateInvoiceNumber.js";

export const createSale = async (req, res) => {
  try {

    const { productId, quantity, customerName, paymentType } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    if (!product.sellingPrice) {
      return res.status(400).json({
        success: false,
        message: "Product selling price not set",
      });
    }

    product.quantity -= quantity;
    await product.save();

    const pricePerItem = product.sellingPrice;
    const totalAmount = quantity * pricePerItem;

    const sale = await Sale.create({
      productId: product._id,
      productName: product.name,
      quantity,
      pricePerItem,
      totalAmount,
      customerName,
      paymentType,
      createdBy: req.user.id,
    });

    await Invoice.create({
      sale: sale._id,
      invoiceNumber: await generateInvoiceNumber(),
      customerName: customerName || null,
      items: [
        {
          productId: product._id,
          productName: product.name,
          quantity,
          pricePerItem,
          total: totalAmount,
        },
      ],
      paymentType,
      totalAmount,
      createdBy: req.user.id,
      createdAt: sale.createdAt,
    });

    res.status(201).json({ success: true, sale });
  } catch (err) {
    console.error("Create sale error ❌", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};




/* ================================
   GET ALL SALES
================================ */
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .sort({ soldAt: -1 })
      .populate("createdBy", "name email role");

    res.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   GET SINGLE SALE
================================ */
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    res.json({
      success: true,
      sale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   UPDATE SALE (ADMIN)
   🔁 Adjust inventory if quantity changes
================================ */
export const updateSale = async (req, res) => {
  try {
    const existingSale = await Sale.findById(req.params.id);
    if (!existingSale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    const { quantity, pricePerItem } = req.body;

    // 🔁 Inventory adjustment
    if (
      quantity !== undefined &&
      quantity !== existingSale.quantity &&
      existingSale.productId
    ) {
      const product = await Product.findById(existingSale.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Linked product not found",
        });
      }

      const diff = quantity - existingSale.quantity;

      if (product.quantity < diff) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock to increase quantity",
        });
      }

      product.quantity -= diff;
      await product.save();
    }

    // 🔢 Recalculate total
    const finalQuantity = quantity ?? existingSale.quantity;
    const finalPrice = pricePerItem ?? existingSale.pricePerItem;
    const totalAmount = finalQuantity * finalPrice;

    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        totalAmount,
      },
      { new: true }
    );

    res.json({
      success: true,
      sale: updatedSale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   DELETE SALE (ADMIN)
   ♻️ Restore inventory
================================ */
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    // ♻️ Restore stock
    if (sale.productId) {
      const product = await Product.findById(sale.productId);
      if (product) {
        product.quantity += sale.quantity;
        await product.save();
      }
    }

    await sale.deleteOne();

    res.json({
      success: true,
      message: "Sale deleted and inventory restored",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
