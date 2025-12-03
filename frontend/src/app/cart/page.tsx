"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Coffee, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart, total } = useCart();

  return (
    <div className="min-h-screen bg-brand-bg font-sans p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 sticky top-0 bg-brand-bg/90 backdrop-blur-sm z-20 py-4">
        <Link href="/menu" className="flex items-center gap-2 text-brand-dark hover:text-brand-orange transition-colors font-bold group">
          <span className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            ←
          </span>
          <span>Back to Menu</span>
        </Link>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">YOUR CART</h1>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-red-500 font-bold hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-full transition-colors text-sm"
          >
            Clear Cart
          </button>
        )}
      </header>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-24 h-24 bg-brand-yellow/20 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart size={48} className="text-brand-orange" />
          </div>
          <h2 className="text-3xl font-black text-brand-dark mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-8 text-lg">Looks like you haven't added anything yet.</p>
          <Link
            href="/menu"
            className="px-8 py-4 bg-brand-orange text-white font-bold rounded-full hover:bg-brand-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            START ORDERING
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="space-y-8">
              {cart.map((item) => (
                <div key={item.itemId} className="flex items-center justify-between border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark mx-auto mb-4">
                      <Coffee size={32} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-brand-dark">{item.name}</h2>
                      <p className="text-brand-orange font-bold">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                      <button
                        onClick={() => decreaseQty(item.itemId)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-brand-dark hover:bg-brand-orange hover:text-white transition-colors font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-brand-dark">{item.qty}</span>
                      <button
                        onClick={() => increaseQty(item.itemId)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-brand-dark hover:bg-brand-orange hover:text-white transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.itemId)}
                      className="text-red-400 hover:text-red-600 font-medium text-xs underline decoration-red-200 hover:decoration-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary & Checkout */}
          <div className="bg-brand-dark text-white rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg text-gray-300">Total Amount</span>
              <span className="text-3xl font-black text-brand-yellow">₹{total}</span>
            </div>

            <Link
              href="/checkout"
              className="block w-full py-3 bg-brand-orange text-white text-center font-bold text-lg rounded-xl hover:bg-white hover:text-brand-orange transition-all shadow-lg transform active:scale-[0.99]"
            >
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
