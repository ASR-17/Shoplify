import express from "express";
import { login, registerEmployee, getMe } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/login", login);

router.post(
  "/register-employee",
  authMiddleware,
  roleMiddleware("admin"),
  registerEmployee
);

router.get("/me", authMiddleware, getMe);

export default router;
