import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";
import { isCollegeEmail } from "../utils/emailValidator.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role: requestedRole } = req.body;

    let role = "STUDENT";

    if (requestedRole === "ADMIN") {
      role = "ADMIN";
    } else {
      role = "STUDENT";
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role as any }
    });

    return res.status(201).json({
      message: "Signup successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Signup error detailed:", error);
    if (error instanceof Error) {
      console.error("Stack:", error.stack);
    }
    return res.status(500).json({ error: "Server error", details: error instanceof Error ? error.message : String(error) });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;


    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Email not registered" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    return res.json({
      message: "Profile updated",
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteAccount = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Delete in order to respect foreign key constraints

    // 1. Delete user's reviews
    await prisma.review.deleteMany({
      where: { userId }
    });

    // 2. Get user's orders
    const orders = await prisma.order.findMany({
      where: { studentId: userId },
      select: { id: true }
    });
    const orderIds = orders.map(o => o.id);

    // 3. Delete order items
    if (orderIds.length > 0) {
      await prisma.orderItem.deleteMany({
        where: { orderId: { in: orderIds } }
      });
    }

    // 4. Delete orders
    await prisma.order.deleteMany({
      where: { studentId: userId }
    });

    // 5. Finally delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    return res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
