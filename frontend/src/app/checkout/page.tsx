"use client";

import { useCart } from "@/context/CartContext";
import { API_URL } from "@/lib/api";
import { useState } from "react";

import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, total } = useCart();
  const router = useRouter();

  const [utr, setUtr] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const upiId = "chaiadda@upi";
  const payeeName = "Chai Adda";

  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${total}&cu=INR`;

  const handlePay = () => {
    window.location.href = upiLink;
  };

  async function handlePlaceOrder() {
    if (!utr) {
      setErrorMsg("Please enter UTR number");
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

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ items, amount: total, utr }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setErrorMsg(data.error || "Something went wrong!");
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

      alert("Order Placed Successfully!");

      router.push(`/order/${orderId}`);
    } catch (err) {
      setErrorMsg("Network error. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {errorMsg && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{errorMsg}</p>
      )}

      <div className="border p-4 rounded shadow-sm">
        <h2 className="font-semibold mb-2">Your Items:</h2>

        {cart.map((c) => (
          <p key={c.itemId}>
            {c.name} x {c.qty} = INR {c.qty * c.price}
          </p>
        ))}

        <h2 className="mt-4 font-semibold text-lg">
          Total: <span className="text-green-700">INR {total}</span>
        </h2>
      </div>

      <button
        onClick={handlePay}
        className="bg-blue-500 mt-5 w-full text-white py-2 rounded"
      >
        Pay via UPI
      </button>

      <div className="mt-5">
        <label className="block mb-1 font-medium">Enter UTR Number:</label>
        <input
          type="text"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Example: 123456789"
        />
      </div>

      <div className="mt-4">
        <label className="block mb-1 font-medium">Payment Screenshot:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className={`mt-5 w-full py-2 rounded text-white ${loading ? "bg-gray-500" : "bg-green-600"
          }`}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
