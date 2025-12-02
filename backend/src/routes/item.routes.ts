import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getItems,
  addItem,
  updateItem,
  deleteItem
} from "../controllers/itemController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getItems);
router.post("/", auth(["ADMIN"]), upload.single("image"), addItem);
router.put("/:id", auth(["ADMIN"]), upload.single("image"), updateItem);
router.delete("/:id", auth(["ADMIN"]), deleteItem);

export default router;
