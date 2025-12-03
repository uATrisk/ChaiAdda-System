import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
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

    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
