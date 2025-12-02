import express, { Request, Response } from "express";
import { auth } from "../middleware/auth.js";
import { createOrder, getOrder, verifyPayment, updateStatus, getMyOrders } from "../controllers/orderController.js";
import { upload } from "../utils/upload.js";
import { prisma } from "../prisma.js";

const router = express.Router();


router.post("/", auth(["STUDENT", "ADMIN"]), createOrder);
router.get("/my-orders", auth(["STUDENT", "ADMIN"]), getMyOrders);
router.get("/:id", auth(["STUDENT", "ADMIN"]), getOrder);
router.put("/:id/verify-payment", auth(["ADMIN"]), verifyPayment);
router.put("/:id/status", auth(["ADMIN"]), updateStatus);

router.post(
  "/:id/upload-proof",
  auth(["STUDENT"]),
  upload.single("proof"),
  async (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { paymentProof: req.file.path },
      });

      return res.json({
        message: "Payment proof uploaded successfully",
        proof: req.file.path,
        order: updatedOrder,
      });
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      return res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;
