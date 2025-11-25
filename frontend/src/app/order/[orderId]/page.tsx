"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { API_URL } from "@/lib/api";

interface OrderPageProps {
  params: {
    orderId: string;
  };
}

export default function OrderStatusPage({ params }: OrderPageProps) {
  const { orderId } = params;

  const [status, setStatus] = useState<string>("RECEIVED");
  const [paymentStatus, setPaymentStatus] = useState<string>("PENDING");

  useEffect(() => {
    socket.emit("join-order", orderId);

    const handleUpdate = (data: {
      type: string;
      orderId: string;
      status?: string;
    }) => {
      if (data.orderId === orderId) {
        if (data.type === "PAYMENT_VERIFIED") {
          setPaymentStatus("VERIFIED");
        }

        if (data.type === "PAYMENT_REJECTED") {
          setPaymentStatus("FAILED");
        }

        if (data.type === "STATUS_UPDATED" && data.status) {
          setStatus(data.status);
        }
      }
    };

    socket.on("order-update", handleUpdate);

    return () => {
      socket.off("order-update", handleUpdate);
    };
  }, [orderId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Order Tracking</h1>

      <p>
        <strong>Order ID:</strong> {orderId}
      </p>

      <p className="mt-4">
        <strong>Payment Status:</strong>{" "}
        <span className={`font-bold ${paymentStatus === "VERIFIED" ? "text-green-600" : paymentStatus === "FAILED" ? "text-red-600" : "text-blue-600"}`}>
          {paymentStatus}
        </span>
      </p>

      <p className="mt-2">
        <strong>Order Status:</strong>{" "}
        <span className="text-green-600 font-bold">{status}</span>
      </p>

      {paymentStatus === "PENDING" && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Upload Payment Proof</h2>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;
              const file = e.target.files[0];
              const formData = new FormData();
              formData.append("proof", file);

              try {
                const res = await fetch(`${API_URL}/orders/${orderId}/upload-proof`, {
                  method: "POST",
                  headers: {

                  },
                  body: formData,
                });
                if (res.ok) {
                  alert("Proof uploaded successfully!");
                } else {
                  alert("Upload failed.");
                }
              } catch (err) {
                console.error(err);
                alert("Error uploading proof.");
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-1">Upload screenshot of UPI payment.</p>
        </div>
      )}

      <p className="mt-6 text-gray-500 text-sm">
        Status will update automatically without refreshing.
      </p>
    </div>
  );
}
