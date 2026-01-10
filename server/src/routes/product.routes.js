import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateProductQuantity,
  deleteProduct,
} from "../controllers/product.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

/* VIEW */
router.get("/", authMiddleware, getProducts);

/* ADMIN ONLY */
router.post("/", authMiddleware, roleMiddleware("admin"), createProduct);
router.get("/:id", authMiddleware, roleMiddleware("admin"), getProductById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateProduct);
router.patch(
  "/:id/quantity",
  authMiddleware,
  roleMiddleware("admin"),
  updateProductQuantity
);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteProduct);

export default router;
