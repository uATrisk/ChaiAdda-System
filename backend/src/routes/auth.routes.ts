import express from "express";
import { signup, login, updateProfile, deleteAccount } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/profile", auth([]), updateProfile);
router.delete("/account", auth([]), deleteAccount);

export default router;
