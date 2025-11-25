"use client";

import { useEffect, useState } from "react";
import { API_URL, apiGet } from "@/lib/api";

type OrderItem = {
  id: string;
  qty: number;
  price: number;
  item: {
    name: string;
  };
};

type Order = {
  id: string;
  paymentStatus: "PENDING" | "VERIFIED" | "FAILED";
  orderStatus: "RECEIVED" | "IN_PROGRESS" | "READY" | "DELIVERED";
  paymentProof?: string;
  student?: { email: string };
  items: OrderItem[];
};



export default function VendorOrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const orderId = params.orderId;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    apiGet(`/orders/${orderId}`).then((data) => {
      setOrder(data.order);
      setLoading(false);
    });
  }, [orderId]);

  async function updatePayment(status: "VERIFIED" | "FAILED") {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : { "Content-Type": "application/json" };

    await fetch(`${API_URL}/orders/${orderId}/verify-payment`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status }),
    });

    alert(status === "VERIFIED" ? "Payment Verified" : "Payment Rejected");

    apiGet(`/orders/${orderId}`).then((data) => {
      setOrder(data.order);
    });
  }


  async function updateStatus(status: Order["orderStatus"]) {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : { "Content-Type": "application/json" };

    await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status }),
    });

    alert("Status Updated!");

    apiGet(`/orders/${orderId}`).then((data) => {
      setOrder(data.order);
    });
  }

  if (loading || !order)
    return <p className="p-6 text-gray-600">Loading...</p>;


  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      <div className="bg-white shadow p-5 rounded-lg border">
        {/* Order Info */}
        <p className="text-sm text-gray-500 mb-2">Order ID: {order.id}</p>
        <p className="text-gray-700 font-medium">
          Student: {order.student?.email}
        </p>

        {/* Items */}
        <h2 className="font-semibold mt-4 mb-2">Items:</h2>
        {order.items.map((item) => (
          <p key={item.id}>
            {item.item.name} × {item.qty} = ₹{item.price}
          </p>
        ))}

        {/* Payment Status */}
        <div className="mt-4">
          <span
            className={`px-3 py-1 text-sm rounded text-white ${order.paymentStatus === "VERIFIED"
              ? "bg-green-600"
              : order.paymentStatus === "FAILED"
                ? "bg-red-600"
                : "bg-yellow-500"
              }`}
          >
            Payment: {order.paymentStatus}
          </span>
        </div>

        {/* Order Status */}
        <div className="mt-2">
          <span
            className={`px-3 py-1 text-sm rounded text-white ${order.orderStatus === "READY"
              ? "bg-blue-600"
              : order.orderStatus === "IN_PROGRESS"
                ? "bg-orange-500"
                : order.orderStatus === "DELIVERED"
                  ? "bg-gray-600"
                  : "bg-purple-600"
              }`}
          >
            Status: {order.orderStatus}
          </span>
        </div>

        {/* Screenshot Image */}
        {order.paymentProof && (
          <div className="mt-6">
            <p className="font-semibold mb-2">Payment Screenshot:</p>
            <img
              src={`${API_URL}/${order.paymentProof}`}
              className="w-72 rounded border shadow-sm"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-4">
          {/* Payment buttons */}
          {order.paymentStatus === "PENDING" && (
            <>
              <button
                onClick={() => updatePayment("VERIFIED")}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Verify Payment
              </button>

              <button
                onClick={() => updatePayment("FAILED")}
                className="w-full bg-red-600 text-white py-2 rounded"
              >
                Reject Payment
              </button>
            </>
          )}

          {/* Status update */}
          <button
            onClick={() => updateStatus("IN_PROGRESS")}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Mark In Progress
          </button>

          <button
            onClick={() => updateStatus("READY")}
            className="w-full bg-orange-500 text-white py-2 rounded"
          >
            Mark Ready
          </button>

          <button
            onClick={() => updateStatus("DELIVERED")}
            className="w-full bg-gray-700 text-white py-2 rounded"
          >
            Mark Delivered
          </button>
        </div>
      </div>
    </div>
  );
}
