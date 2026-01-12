"use client";

import { useCart } from "@/context/CartContext";
import { API_URL } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "react-qr-code";
import { ArrowLeft, CreditCard, Wallet, Banknote, Coffee, AlertCircle, CheckCircle2, Upload } from "lucide-react";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();

  const [utr, setUtr] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const upiId = "9927279293@slc";
  const payeeName = "Chai Adda";

  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${total}&cu=INR`;

  const handlePay = () => {
    window.location.href = upiLink;
  };

  async function handlePlaceOrder() {
    // Validation
    if (!utr) {
      setErrorMsg("Please enter UTR number to verify payment");
      return;
    }
    if (utr.length !== 12 || !/^\d+$/.test(utr)) {
      setErrorMsg("UTR/Reference number must be exactly 12 digits");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const items = cart.map((item) => ({
        itemId: item.itemId,
        qty: item.qty,
        price: item.price,
      }));

      const token = localStorage.getItem("token");
      const headers: HeadersInit = token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : { "Content-Type": "application/json" };

      console.log("Placing order with items:", items);

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ items, amount: total, utr }),
      });

      console.log("Response status:", res.status, res.statusText);
      const text = await res.text();
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        data = { error: "Invalid server response" };
      }

      if (!res.ok) {
        console.error("Order placement failed:", data);
        setLoading(false);
        // If data.error is missing (e.g. empty JSON {}), show status code
        setErrorMsg(data.error || `Order failed (${res.status}): Please try again.`);
        return;
      }

      const orderId = data.order.id;

      if (file) {
        const formData = new FormData();
        formData.append("proof", file);
        const uploadHeaders: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        await fetch(`${API_URL}/orders/${orderId}/upload-proof`, {
          method: "POST",
          headers: uploadHeaders,
          body: formData,
        });
      }

      clearCart();
      router.push(`/order/${orderId}`);
    } catch (err) {
      console.error("Network error during checkout:", err);
      setErrorMsg("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans p-4 md:p-8 max-w-6xl mx-auto">

      <header className="flex justify-between items-center mb-8 sticky top-0 bg-brand-bg/90 backdrop-blur-sm z-20 py-4">
        <Link href="/cart" className="flex items-center gap-2 text-brand-dark hover:text-brand-orange transition-colors font-bold group">
          <span className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <ArrowLeft size={18} />
          </span>
          <span>Back to Cart</span>
        </Link>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">CHECKOUT</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-brand-dark mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((c) => (
                <div key={c.itemId} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-brand-yellow/20 rounded-2xl flex items-center justify-center text-brand-dark shrink-0">
                      <Coffee size={28} />
                    </div>
                    <div>
                      <p className="font-bold text-brand-dark text-lg leading-tight mb-1">{c.name}</p>
                      <p className="text-gray-400 text-sm font-medium">Qty: {c.qty}</p>
                    </div>
                  </div>
                  <span className="font-bold text-brand-dark text-lg">₹{c.qty * c.price}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-500">Total to Pay</span>
              <span className="text-4xl font-black text-brand-orange">₹{total}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 rounded-3xl border border-red-100 font-bold text-center flex items-center justify-center gap-2 animate-pulse">
              <AlertCircle size={20} />
              {errorMsg}
            </div>
          )}

          <div className="bg-brand-blue rounded-[2.5rem] p-8 relative overflow-hidden text-white shadow-xl shadow-brand-blue/30">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-white text-brand-blue rounded-full flex items-center justify-center font-black">1</div>
                <h2 className="text-2xl font-black">MAKE PAYMENT</h2>
              </div>

              <button
                onClick={handlePay}
                className="w-full py-4 bg-white text-brand-blue font-black rounded-2xl hover:bg-brand-orange hover:text-white transition-all shadow-lg mb-6 flex items-center justify-center gap-2 active:scale-95"
              >
                PAY VIA UPI APP <Wallet size={20} />
              </button>

              <div className="text-center">
                <p className="text-white/80 font-bold text-sm mb-4 tracking-wide">OR SCAN QR CODE</p>
                <div className="bg-white p-4 rounded-3xl inline-block shadow-lg">
                  <div className="w-48 h-48 bg-white flex items-center justify-center">
                    <QRCode
                      value={upiLink}
                      size={192}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                </div>
                <div className="mt-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm inline-block">
                  <p className="font-mono font-bold text-lg tracking-wide">{upiId}</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-brand-orange text-white rounded-full flex items-center justify-center font-black">2</div>
              <h2 className="text-2xl font-black text-brand-dark">VERIFY & PLACE</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-bold text-gray-700 ml-1">UTR / Reference No. <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  maxLength={12}
                  value={utr}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                    setUtr(val);
                  }}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all font-mono text-lg tracking-widest placeholder:tracking-normal font-bold text-brand-dark"
                  placeholder="12 digits"
                />
                <p className="text-xs text-gray-400 mt-2 font-medium ml-1 flex justify-between">
                  <span>From your payment app (GooglePe, Paytm, etc.)</span>
                  <span className={utr.length === 12 ? "text-green-600" : ""}>{utr.length}/12</span>
                </p>
              </div>

              <div>
                <label className="block mb-2 font-bold text-gray-700 ml-1">Screenshot (Optional)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="proof-upload"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="proof-upload" className="w-full px-6 py-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-brand-orange hover:bg-brand-orange/5 transition-all flex items-center justify-center gap-2 group">
                    <Upload size={20} className="text-gray-400 group-hover:text-brand-orange transition-colors" />
                    <span className="text-gray-500 font-bold group-hover:text-brand-orange transition-colors truncate">
                      {file ? file.name : "Tap to upload screenshot"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full mt-8 py-5 rounded-2xl text-white font-bold text-xl transition-all shadow-lg transform active:scale-[0.99] flex items-center justify-center gap-2 ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-brand-orange hover:bg-brand-dark hover:shadow-orange-200"
                }`}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  PLACING ORDER...
                </>
              ) : (
                <>
                  PLACE ORDER <CheckCircle2 size={24} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
