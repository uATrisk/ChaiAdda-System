import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

if (process.env.NODE_ENV === "production" && SOCKET_URL.includes("localhost")) {
  console.warn(
    "WARNING: You are running in production mode but connecting to localhost socket. " +
    "Please set the NEXT_PUBLIC_API_URL environment variable."
  );
}

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

