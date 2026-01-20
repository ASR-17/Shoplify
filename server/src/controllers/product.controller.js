import Product from "../models/product.model.js";

/* 🔔 NOTIFICATIONS */
import {
  notifyLowStock,
  notifyOutOfStock,
  notifyProductCreated,
} from "../utils/notificationTriggers.js";

/* ================================
   CREATE PRODUCT (ADMIN)
================================ */
export const createProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found",
      });
    }

    const product = await Product.create({
      ...req.body,
      createdBy: req.user.id,
    });

    /* 🔔 Notify product added */
    await notifyProductCreated(product, req.user.id);

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================================
   GET ALL PRODUCTS
================================ */
export const getProducts = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================================
   GET SINGLE PRODUCT
================================ */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================================
   UPDATE FULL PRODUCT
================================ */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    /* 🔔 Stock-based notifications */
    if (product.quantity === 0) {
      await notifyOutOfStock(product, req.user.id);
    } else if (product.quantity <= 5) {
      await notifyLowStock(product, req.user.id);
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================================
   UPDATE ONLY QUANTITY
================================ */
export const updateProductQuantity = async (req, res) => {
  try {
    const { adjustment } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    product.quantity += Number(adjustment);
    if (product.quantity < 0) product.quantity = 0;

    await product.save();

    /* 🔔 Quantity alerts */
    if (product.quantity === 0) {
      await notifyOutOfStock(product, req.user.id);
    } else if (product.quantity <= 5) {
      await notifyLowStock(product, req.user.id);
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================================
   DELETE PRODUCT
================================ */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
