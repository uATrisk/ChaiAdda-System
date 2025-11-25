"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { API_URL, apiGet } from "@/lib/api";

interface Order {
  id: string;
  amount: number;
  paymentStatus: string;
  orderStatus: string;
  utr: string | null;
  createdAt: string;
}

export default function VendorDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    apiGet("/vendor/orders").then((data) => {
      setOrders(data);
    });

    const handleNewOrder = (order: Order) => {
      setOrders((prev) => [order, ...prev]);
    };

    const handleOrderUpdate = (data: { orderId: string; type: string; status?: string }) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === data.orderId) {
            if (data.type === "PAYMENT_VERIFIED") return { ...o, paymentStatus: "VERIFIED", orderStatus: "IN_PROGRESS" };
            if (data.type === "PAYMENT_REJECTED") return { ...o, paymentStatus: "FAILED", orderStatus: "RECEIVED" };
            if (data.type === "STATUS_UPDATED" && data.status) return { ...o, orderStatus: data.status };
          }
          return o;
        })
      );
    };

    socket.on("new-order", handleNewOrder);
    socket.on("order-update", handleOrderUpdate);

    return () => {
      socket.off("new-order", handleNewOrder);
      socket.off("order-update", handleOrderUpdate);
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Vendor Dashboard</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <a
            href={`/vendor/order/${order.id}`}
            key={order.id}
            className="block border p-4 rounded-lg hover:bg-gray-50"
          >
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Amount:</strong> ₹{order.amount}</p>
            <p><strong>Payment:</strong> {order.paymentStatus}</p>
            <p><strong>Status:</strong> {order.orderStatus}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
