import { io } from "../index.js";

export const emitOrderUpdate = (orderId: string, data: any) => {
  io.to(orderId).emit("order-update", data);
};

export const emitNewOrder = (order: any) => {
  io.emit("new-order", order);
};

export const emitItemUpdate = (item: any) => {
  io.emit("item-updated", item);
};
