import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./socket.js";

import { prisma } from "./prisma.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:3000",
    process.env.FRONTEND_URL || "https://your-project.vercel.app",
    /\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json());

const server = http.createServer(app);

export const io = initSocket(server);

import authRoutes from "./routes/auth.routes.js";
import itemRoutes from "./routes/item.routes.js";
import orderRoutes from "./routes/order.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import reviewRoutes from "./routes/review.routes.js";

app.use("/auth", authRoutes);
app.use("/items", itemRoutes);
app.use("/orders", orderRoutes);
app.use("/vendor", vendorRoutes);
app.use("/reviews", reviewRoutes);
app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/test-db", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ message: "DB working", users });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
