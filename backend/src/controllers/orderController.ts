import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { AuthRequest } from "../types/auth.types.js";
import { emitNewOrder, emitOrderUpdate } from "../utils/socketEmitter.js";

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
      include: { items: { include: { item: true } }, student: true }
    });

    emitNewOrder(order);


    return res.json({ message: "Order created", order });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const orders = await prisma.order.findMany({
      where: { studentId: userId },
      include: { items: { include: { item: true } } },
      orderBy: { createdAt: "desc" }
    });

    return res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { item: true } }, student: true }
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    return res.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { paymentStatus: status, orderStatus: status === "VERIFIED" ? "IN_PROGRESS" : "RECEIVED" }
    });

    emitOrderUpdate(id, { type: status === "VERIFIED" ? "PAYMENT_VERIFIED" : "PAYMENT_REJECTED", orderId: id });

    return res.json({ message: "Payment updated", order });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { orderStatus: status }
    });

    emitOrderUpdate(id, { type: "STATUS_UPDATED", status, orderId: id });

    return res.json({ message: "Status updated", order });
  } catch (error) {
    console.error("Update status error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
