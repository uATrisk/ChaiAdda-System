import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { AuthRequest } from "../types/auth.types.js";

export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.item.findMany();
    return res.json(items);
  } catch (error) {
    console.error("Get items error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const addItem = async (req: AuthRequest, res: Response) => {
  try {
    const { name, price } = req.body;

    const item = await prisma.item.create({
      data: { name, price }
    });

    return res.status(201).json({ message: "Item added", item });
  } catch (error) {
    console.error("Add item error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id)
    
    const { name, price, available } = req.body;

    const updated = await prisma.item.update({
      where: { id },
      data: { name, price, available }
    });

    return res.json({ message: "Item updated", item: updated });
  } catch (error) {
    console.error("Update item error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.item.delete({ where: { id } });

    return res.json({ message: "Item deleted" });
  } catch (error) {
    console.error("Delete item error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

