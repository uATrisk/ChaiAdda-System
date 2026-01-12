import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
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

export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      process.env.FRONTEND_URL || "https://your-project.vercel.app",
      /\.vercel\.app$/
    ],
    credentials: true
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-order", (orderId) => {
    socket.join(orderId);
    console.log(`User joined order room: ${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

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


app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url} from origin: ${req.headers.origin}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Backend is running properly. If you see this, the server is reachable.");
});

app.get("/test-db", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ message: "DB working", users });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
