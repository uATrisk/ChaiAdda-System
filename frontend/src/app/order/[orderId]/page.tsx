"use client";

import { useEffect, useState, use } from "react";
import { socket } from "@/lib/socket";
import { API_URL, apiGet } from "@/lib/api";
import Link from "next/link";
import { Receipt, Camera, Coffee } from "lucide-react";

interface OrderPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

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
  orderStatus: "RECEIVED" | "PREPARING" | "READY" | "COMPLETED";
  items: OrderItem[];
};

export default function OrderStatusPage({ params }: OrderPageProps) {
  const { orderId } = use(params);

  const [status, setStatus] = useState<string>("RECEIVED");
  const [paymentStatus, setPaymentStatus] = useState<string>("PENDING");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order data
    apiGet(`/orders/${orderId}`)
      .then((data) => {
        console.log("Order API response:", data);
        if (data.order) {
          console.log("Order data:", data.order);
          console.log("Order items:", data.order.items);
          setOrder(data.order);
          setStatus(data.order.orderStatus);
          setPaymentStatus(data.order.paymentStatus);
        }
      })
      .catch((err) => console.error("Failed to load order:", err))
      .finally(() => setLoading(false));

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

  const getStatusColor = (s: string) => {
    switch (s) {
      case "RECEIVED": return "bg-blue-100 text-blue-800";
      case "PREPARING": return "bg-yellow-100 text-yellow-800";
      case "READY": return "bg-green-100 text-green-800";
      case "COMPLETED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateTotal = () => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + item.price, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <p className="text-xl font-bold text-gray-400 animate-pulse">Loading Order Details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans p-4 md:p-8 flex flex-col items-center justify-center">
      <Link href="/menu" className="absolute top-8 left-8 text-brand-dark font-bold hover:text-brand-orange transition-colors flex items-center gap-2">
        <span>←</span> Back to Menu
      </Link>

      <div className="bg-white rounded-[2rem] shadow-xl p-8 max-w-md w-full border border-gray-100 relative overflow-hidden">
        {/* Receipt Top Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-blue"></div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-dark text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Receipt size={32} />
          </div>
          <h1 className="text-2xl font-black text-brand-dark mb-1">Order Receipt</h1>
          <p className="text-gray-400 text-sm font-mono">{orderId}</p>
        </div>

        <div className="space-y-6">
          {/* Order Items Section */}
          {order && order.items.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-lg font-black text-brand-dark mb-4 border-b border-gray-200 pb-2">Your Order</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center">
                        <Coffee size={20} className="text-brand-dark" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark text-sm">{item.item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <span className="font-bold text-brand-dark">₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="font-black text-brand-dark text-lg">Total</span>
                <span className="font-black text-brand-orange text-xl">₹{calculateTotal()}</span>
              </div>
            </div>
          )}
          {/* Status Section */}
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-gray-500 font-bold text-sm mb-2 uppercase tracking-wider">Order Status</p>
            <span className={`px-4 py-2 rounded-full font-black text-lg ${getStatusColor(status)}`}>
              {status}
            </span>
            <p className="text-xs text-gray-400 mt-4 animate-pulse">
              Live updates enabled...
            </p>
          </div>

          {/* Payment Status */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <span className="font-bold text-gray-600">Payment Status</span>
            <span className={`font-black ${paymentStatus === "VERIFIED" ? "text-green-500" :
              paymentStatus === "FAILED" ? "text-red-500" : "text-brand-orange"
              }`}>
              {paymentStatus}
            </span>
          </div>

          {/* Upload Proof (if pending) */}
          {paymentStatus === "PENDING" && (
            <div className="bg-brand-blue/10 rounded-2xl p-6 border border-brand-blue/20">
              <h2 className="font-bold text-brand-dark mb-2 flex items-center gap-2">
                <Camera size={20} className="inline mr-2" />Upload Payment Proof
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Forgot to upload screenshot? Do it here.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  const file = e.target.files[0];
                  const formData = new FormData();
                  formData.append("proof", file);

                  try {
                    const token = localStorage.getItem("token");
                    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

                    const res = await fetch(`${API_URL}/orders/${orderId}/upload-proof`, {
                      method: "POST",
                      headers: headers,
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
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-brand-dark transition-all"
              />
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs">
            Thank you for ordering with Chai Adda!
          </p>
        </div>
      </div>
    </div>
  );
}
