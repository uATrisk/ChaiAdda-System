"use client";

import { useEffect, useState, use } from "react";
import { socket } from "@/lib/socket";
import { API_URL, apiGet } from "@/lib/api";
import Link from "next/link";
import { Receipt, Camera, Coffee, ArrowLeft } from "lucide-react";

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
        if (data.order) {
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

  const calculateTotal = () => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + item.price, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  // Helper for timeline steps
  const steps = ["RECEIVED", "PREPARING", "READY", "COMPLETED"];
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="min-h-screen bg-brand-bg font-sans p-4 md:p-8 flex items-start justify-center pt-20">
      <Link href="/menu" className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full text-brand-dark font-bold hover:text-brand-orange transition-all shadow-sm hover:shadow-md">
        <ArrowLeft size={24} />
      </Link>

      <div className="relative w-full max-w-md">
        {/* Receipt Container */}
        <div className="bg-white relative shadow-2xl overflow-hidden print:shadow-none animate-slide-up" style={{ borderRadius: '20px 20px 0 0' }}>
          {/* Top Pattern */}
          <div className="h-3 bg-brand-dark opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}>
          </div>

          <div className="p-8 pb-12">
            <div className="text-center mb-8 border-b-2 border-dashed border-gray-200 pb-8">
              <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">CHAI ADDA</h1>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-[0.2em] mb-4">Official Receipt</p>
              <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500 font-bold">ORDER ID:</span>
                <span className="font-mono font-black text-brand-dark tracking-widest">#{orderId.slice(-6).toUpperCase()}</span>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="mb-10">
              <div className="flex justify-between relative z-10">
                {steps.map((step, idx) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${idx <= currentStepIndex ? "bg-brand-orange border-brand-orange text-white scale-110" : "bg-white border-gray-200 text-gray-300"
                      }`}>
                      {idx <= currentStepIndex && <Receipt size={14} />}
                    </div>
                    <span className={`text-[10px] font-bold mt-2 uppercase tracking-wide ${idx <= currentStepIndex ? "text-brand-dark" : "text-gray-300"
                      }`}>{step}</span>
                  </div>
                ))}
              </div>
              {/* Connecting Line */}
              <div className="absolute top-[178px] left-12 right-12 h-0.5 bg-gray-100 -z-0">
                <div className="h-full bg-brand-orange transition-all duration-1000 ease-out" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}></div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {order && order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <div className="flex gap-3">
                    <span className="font-bold text-brand-orange font-mono">x{item.qty}</span>
                    <span className="font-bold text-gray-700 uppercase">{item.item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-gray-900">₹{item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-brand-dark pt-4 flex justify-between items-end mb-8">
              <span className="text-sm font-bold text-gray-500 uppercase">Total Amount</span>
              <span className="text-3xl font-black text-brand-dark">₹{calculateTotal().toFixed(2)}</span>
            </div>

            {/* Payment Status Badge */}
            <div className={`p-4 rounded-xl border-2 text-center mb-6 ${paymentStatus === "VERIFIED" ? "bg-green-50 border-green-500 text-green-700" :
              paymentStatus === "FAILED" ? "bg-red-50 border-red-500 text-red-700" :
                "bg-yellow-50 border-yellow-500 text-yellow-700"
              }`}>
              <p className="text-xs font-black uppercase tracking-widest mb-1">Payment Status</p>
              <p className="text-xl font-black">{paymentStatus}</p>
            </div>

            {/* Upload Proof (if pending) */}
            {paymentStatus === "PENDING" && (
              <div className="text-center">
                <label className="inline-flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="w-16 h-16 bg-brand-dark text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Camera size={28} />
                  </div>
                  <span className="text-sm font-bold text-brand-dark underline decoration-brand-orange decoration-2">Upload Payment Proof</span>
                  <input
                    type="file"
                    className="hidden"
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
                  />
                </label>
              </div>
            )}
          </div>

          {/* Receipt Bottom Tear Effect */}
          <div className="relative h-4 bg-white" style={{
            maskImage: 'radial-gradient(circle at 10px 0, transparent 0, transparent 10px, black 11px)',
            maskSize: '20px 100%',
            maskPosition: '0 0',
            WebkitMaskImage: 'radial-gradient(circle at 10px 0, transparent 0, transparent 10px, black 11px)',
            WebkitMaskSize: '20px 20px',
            WebkitMaskRepeat: 'repeat-x'
          }}></div>
          {/* Bottom jagged edge simulation using css clip-path is tricky, purely svg/mask is better or just multiple divs */}
          {/* Creating a jagged border using css gradient */}
          <div className="h-6 w-full bg-white" style={{
            background: 'linear-gradient(45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%)',
            backgroundSize: '20px 40px',
            backgroundPosition: '0 -20px'
          }}></div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-8 font-mono">
          Generated at {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
