"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart, total } = useCart();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Your Cart</h1>

      {cart.map((item) => (
        <div key={item.itemId} className="border p-4 my-3 rounded">
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <p>Price: INR {item.price}</p>
          <p>Qty: {item.qty}</p>

          <div className="mt-2 flex gap-3">
            <button onClick={() => decreaseQty(item.itemId)} className="px-3 py-1 bg-gray-300">-</button>
            <button onClick={() => increaseQty(item.itemId)} className="px-3 py-1 bg-gray-300">+</button>
            <button onClick={() => removeFromCart(item.itemId)} className="px-3 py-1 bg-red-500 text-white">Remove</button>
          </div>
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-4">Total: INR {total}</h2>

      <a
        href="/checkout"
        className="inline-block mt-4 bg-green-600 text-white py-2 px-4 rounded"
      >
        Proceed to Checkout
      </a>
    </div>
  );
}
