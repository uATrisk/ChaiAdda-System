import express from "express";
import { auth } from "../middleware/auth.js";
import {
    addReview,
    getReviewsByItem,
    deleteReview,
    getUserReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", auth(["STUDENT"]), addReview);
router.get("/user/me", auth(["STUDENT"]), getUserReviews);
router.get("/:itemId", getReviewsByItem);
router.delete("/:id", auth(["STUDENT"]), deleteReview);

export default router;
