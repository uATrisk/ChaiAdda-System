import { getIo } from "../socket.js";

export const emitOrderUpdate = (orderId: string, data: any) => {
  getIo().to(orderId).emit("order-update", data);
};

export const emitNewOrder = (order: any) => {
  getIo().emit("new-order", order);
};

export const emitItemUpdate = (item: any) => {
  getIo().emit("item-updated", item);
};
