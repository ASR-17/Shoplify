import express from "express";
import {
  addExpense,
  getExpenses,
  getExpenseSummary,
  updateExpense,
  deleteExpense,
} from "../controllers/expense.controller.js";

import auth from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", auth, upload.single("receipt"), addExpense);
router.get("/", auth, getExpenses);
router.get("/summary", auth, getExpenseSummary);
router.put("/:id", auth, adminOnly, upload.single("receipt"), updateExpense);
router.delete("/:id", auth, adminOnly, deleteExpense);

export default router;
