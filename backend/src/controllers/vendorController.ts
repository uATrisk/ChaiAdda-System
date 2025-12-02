import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { AuthRequest } from "../types/auth.types.js";
import { emitOrderUpdate } from "../utils/socketEmitter.js";

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { item: true } }, student: true },
      orderBy: { createdAt: "desc" }
    });

    return res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getPendingPayments = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { paymentStatus: "PENDING" },
      include: { items: { include: { item: true } }, student: true }
    });

    return res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: "VERIFIED",
        orderStatus: "IN_PROGRESS"
      }
    });

    emitOrderUpdate(id, {
      type: "PAYMENT_VERIFIED",
      orderId: id
    });

    return res.json({ message: "Payment verified", order: updated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const rejectPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: "FAILED",
        orderStatus: "RECEIVED"
      }
    });

    emitOrderUpdate(id, {
      type: "PAYMENT_REJECTED",
      orderId: id
    });

    return res.json({ message: "Payment rejected", order: updated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.order.update({
      where: { id },
      data: { orderStatus: status }
    });

    emitOrderUpdate(id, {
      type: "STATUS_UPDATED",
      orderId: id,
      status: status
    });

    return res.json({ message: "Status updated", order: updated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
