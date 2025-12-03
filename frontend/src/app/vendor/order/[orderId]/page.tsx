"use client";

import { useEffect, useState, use } from "react";
import { API_URL, apiGet } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Coffee, Camera, Check, X } from "lucide-react";

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
  utr?: string;
  student?: { email: string };
  items: OrderItem[];
};

export default function VendorOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Import useRouter

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    apiGet(`/orders/${orderId}`)
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setOrder(data.order);
        }
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderId, router]);

  async function updatePayment(status: "VERIFIED" | "FAILED") {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : { "Content-Type": "application/json" };

    await fetch(`${API_URL}/orders/${orderId}/verify-payment`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status }),
    });

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

    apiGet(`/orders/${orderId}`).then((data) => {
      setOrder(data.order);
    });
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <p className="text-xl font-bold text-gray-400 animate-pulse">Loading Order Details...</p>
      </div>
    );

  if (error || !order)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg gap-4">
        <p className="text-xl font-bold text-red-500">{error || "Order not found"}</p>
        <Link href="/vendor/dashboard" className="text-brand-dark font-bold hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-brand-bg font-sans p-4 md:p-8">
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/vendor/dashboard" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand-orange hover:text-white transition-colors">
            ←
          </Link>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">ORDER DETAILS</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        {/* Header Info */}
        <div className="bg-gray-50 p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <p className="text-sm text-gray-500 font-mono mb-1">ID: {order.id}</p>
            <p className="text-2xl font-black text-brand-dark">{order.student?.email}</p>
            {order.utr && (
              <p className="text-sm text-gray-600 font-medium mt-2 bg-white px-3 py-1 rounded-lg inline-block border border-gray-200">
                UTR: <span className="font-mono text-brand-dark">{order.utr}</span>
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <span className={`px-4 py-2 text-sm font-bold rounded-xl ${order.paymentStatus === "VERIFIED" ? "bg-green-100 text-green-800" :
              order.paymentStatus === "FAILED" ? "bg-red-100 text-red-800" :
                "bg-orange-100 text-orange-800"
              }`}>
              {order.paymentStatus}
            </span>
            <span className={`px-4 py-2 text-sm font-bold rounded-xl ${order.orderStatus === "DELIVERED" ? "bg-gray-100 text-gray-800" :
              "bg-blue-100 text-blue-800"
              }`}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          {/* Left Column: Items */}
          <div>
            <h2 className="text-xl font-black text-brand-dark mb-6 border-b border-gray-100 pb-2">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark mx-auto mb-6 animate-pulse">
                      <Coffee size={40} />
                    </div>
                    <div>
                      <p className="font-bold text-brand-dark">{item.item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-bold text-brand-dark">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Payment Proof */}
          <div>
            <h2 className="text-xl font-black text-brand-dark mb-6 border-b border-gray-100 pb-2">Payment Proof</h2>
            {order.paymentProof ? (
              <a href={`${API_URL}/${order.paymentProof}`} target="_blank" rel="noopener noreferrer">
                <img
                  src={`${API_URL}/${order.paymentProof}`}
                  className="w-full rounded-2xl border border-gray-200 shadow-sm hover:opacity-90 transition-opacity"
                  alt="Payment Proof"
                />
              </a>
            ) : (
              <div className="w-full h-48 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                <Camera size={48} className="mb-2" />
                <span className="font-medium">No screenshot uploaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="bg-gray-50 p-8 border-t border-gray-100 space-y-8">
          {/* Payment Actions */}
          {order.paymentStatus === "PENDING" && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Verify Payment</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updatePayment("VERIFIED")}
                  className="py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-lg hover:shadow-green-200 transform active:scale-[0.99]"
                >
                  <Check size={20} className="inline mr-2" />Verify Payment
                </button>
                <button
                  onClick={() => updatePayment("FAILED")}
                  className="py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200 transform active:scale-[0.99]"
                >
                  <X size={20} className="inline mr-2" />Reject Payment
                </button>
              </div>
            </div>
          )}

          {/* Status Actions */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Update Order Status</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => updateStatus("IN_PROGRESS")}
                className={`py-3 text-sm font-bold rounded-2xl border-2 transition-all ${order.orderStatus === "IN_PROGRESS"
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-500 hover:text-blue-600"
                  }`}
              >
                In Progress
              </button>
              <button
                onClick={() => updateStatus("READY")}
                className={`py-3 text-sm font-bold rounded-2xl border-2 transition-all ${order.orderStatus === "READY"
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-500 hover:text-orange-500"
                  }`}
              >
                Ready
              </button>
              <button
                onClick={() => updateStatus("DELIVERED")}
                className={`py-3 text-sm font-bold rounded-2xl border-2 transition-all ${order.orderStatus === "DELIVERED"
                  ? "bg-gray-800 text-white border-gray-800 shadow-lg"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-800 hover:text-gray-800"
                  }`}
              >
                Delivered
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
