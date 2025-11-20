import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getItems,
  addItem,
  updateItem,
  deleteItem
} from "../controllers/itemController.js";

const router = express.Router();

router.get("/", getItems); // public (student)
router.post("/", auth(["ADMIN"]), addItem);
router.put("/:id", auth(["ADMIN"]), updateItem);
router.delete("/:id", auth(["ADMIN"]), deleteItem);

export default router;
