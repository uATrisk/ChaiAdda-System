import express from "express";
import { auth } from "../middleware/auth.js";
import { createOrder } from "../controllers/orderController.js";
import multer from "multer";
import { prisma } from "../prisma.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", auth(["STUDENT", "ADMIN"]), createOrder);

router.post(
  "/:id/upload-proof",
  auth(["STUDENT"]),
  upload.single("proof"),
  async (req, res) => {
    try {
      const orderId = req.params.id;

      const updated = await prisma.order.update({
        where: { id: orderId },
        data: { paymentProof: req.file?.path }
      });

      return res.json({ message: "Payment proof uploaded", order: updated });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;
