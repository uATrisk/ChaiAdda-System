import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getAllOrders,
  getPendingPayments,
  verifyPayment,
  rejectPayment,
  updateStatus
} from "../controllers/vendorController.js";

const router = express.Router();

router.get("/orders", auth(["ADMIN"]), getAllOrders);

router.get("/orders/pending", auth(["ADMIN"]), getPendingPayments);

router.put("/orders/:id/verify", auth(["ADMIN"]), verifyPayment);

router.put("/orders/:id/reject", auth(["ADMIN"]), rejectPayment);

router.put("/orders/:id/status", auth(["ADMIN"]), updateStatus);

export default router;
