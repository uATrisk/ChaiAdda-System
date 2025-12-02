import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { AuthRequest } from "../types/auth.types.js";
import { emitItemUpdate } from "../utils/socketEmitter.js";

export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      } as any,
    });

    const itemsWithRating = items.map((item: any) => {
      const totalRating = item.reviews?.reduce((sum: number, review: any) => sum + review.rating, 0) || 0;
      const avgRating = item.reviews?.length > 0 ? totalRating / item.reviews.length : 0;
      const { reviews, ...itemData } = item;
      return { ...itemData, rating: avgRating };
    });

    return res.json(itemsWithRating);
  } catch (error) {
    console.error("Get items error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const addItem = async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, category } = req.body;
    let image = null;

    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      image = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const item = await prisma.item.create({
      data: {
        name,
        price: parseFloat(price),
        category: category || "Other",
        image
      }
    });

    return res.status(201).json({ message: "Item added", item: { ...item, rating: 0 } });
  } catch (error) {
    console.error("Add item error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, available, category } = req.body;

    const data: any = {};
    if (name) data.name = name;
    if (price) data.price = parseFloat(price);
    if (available !== undefined) data.available = String(available) === "true";
    if (category) data.category = category;

    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      data.image = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const updated = await prisma.item.update({
      where: { id },
      data
    });

    const updatedItemWithReviews = await prisma.item.findUnique({
      where: { id },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      } as any,
    });

    if (!updatedItemWithReviews) {
      return res.status(404).json({ error: "Item not found after update" });
    }

    const itemAny = updatedItemWithReviews as any;
    const totalRating = itemAny.reviews?.reduce((sum: number, review: any) => sum + review.rating, 0) || 0;
    const avgRating = itemAny.reviews?.length > 0 ? totalRating / itemAny.reviews.length : 0;
    const { reviews, ...itemData } = itemAny;
    const finalItem = { ...itemData, rating: avgRating };

    emitItemUpdate(finalItem);

    return res.json({ message: "Item updated", item: finalItem });
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

