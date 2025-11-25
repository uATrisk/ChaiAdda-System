"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useCart } from "@/context/CartContext";

interface Item {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export default function MenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    apiGet("/items").then(setItems);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Menu</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-gray-600">INR {item.price}</p>

            <button
              disabled={!item.available}
              onClick={() =>
                addToCart({
                  itemId: item.id,
                  name: item.name,
                  price: item.price,
                  qty: 1,
                })
              }
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {item.available ? "Add to Cart" : "Not Available"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
