import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { AuthRequest } from "../types/auth.types.js";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, amount, utr } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Items are required" });
    }

    const order = await prisma.order.create({
      data: {
        studentId: req.user!.userId,
        amount,
        utr,
        items: {
          create: items.map((it: any) => ({
            itemId: it.itemId,
            qty: it.qty,
            price: it.price
          }))
        }
      },
      include: { items: true }
    });

    return res.json({ message: "Order created", order });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
