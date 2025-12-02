import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { AuthRequest } from "../types/auth.types.js";

export const addReview = async (req: AuthRequest, res: Response) => {
    try {
        const { itemId, rating, comment } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const review = await prisma.review.create({
            data: {
                rating: parseInt(rating),
                comment,
                itemId,
                userId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return res.status(201).json(review);
    } catch (error) {
        console.error("Add review error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

export const getReviewsByItem = async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params;

        const reviews = await prisma.review.findMany({
            where: { itemId },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.json(reviews);
    } catch (error) {
        console.error("Get reviews error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const review = await prisma.review.findUnique({ where: { id } });

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await prisma.review.delete({ where: { id } });

        return res.json({ message: "Review deleted" });
    } catch (error) {
        console.error("Delete review error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};


export const getUserReviews = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const reviews = await prisma.review.findMany({
            where: { userId },
            include: {
                item: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        console.log("User reviews:", reviews);
        return res.json(reviews);
    } catch (error) {
        console.error("Get user reviews error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};
