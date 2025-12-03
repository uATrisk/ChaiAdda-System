"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { socket } from "@/lib/socket";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Search, Coffee, Plus, UtensilsCrossed, Sandwich, Pizza, Check, Star, X, User } from "lucide-react";

interface Item {
  id: string;
  name: string;
  price: number;
  available: boolean;
  category: string;
  image?: string;
  rating?: number;
  reviews?: any[];
}

export default function MenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const { addToCart, cart } = useCart();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    apiGet("/items").then(setItems);

    const handleItemUpdate = (updatedItem: Item) => {
      setItems((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    };

    socket.on("item-updated", handleItemUpdate);

    return () => {
      socket.off("item-updated", handleItemUpdate);
    };
  }, []);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleAddToCart = (item: Item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to order items!");
      router.push("/login");
      return;
    }

    addToCart({
      itemId: item.id,
      name: item.name,
      price: item.price,
      qty: 1,
    });

    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 2000);
  };

  interface Review {
    id: string;
    rating: number;
    comment: string;
    user: { name: string };
    userId: string;
  }

  const [selectedItemForReview, setSelectedItemForReview] = useState<Item | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const handleOpenReviews = async (item: Item) => {
    setSelectedItemForReview(item);
    const res = await apiGet(`/reviews/${item.id}`);
    setReviews(res);
    setNewReview({ rating: 5, comment: "" });
  };

  const handleSubmitReview = async () => {
    if (!selectedItemForReview) return;
    try {
      await apiPost("/reviews", {
        itemId: selectedItemForReview.id,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      // Refresh reviews
      const res = await apiGet(`/reviews/${selectedItemForReview.id}`);
      setReviews(res);
      setNewReview({ rating: 5, comment: "" });
      alert("Review submitted!");
    } catch (error) {
      console.error("Failed to submit review", error);
      alert("Failed to submit review");
    }
  };

  const categories = [
    "All",
    "Tea & Coffee",
    "Chocolate & Bournvita",
    "Shakes & Juices",
    "Burgers",
    "Sandwiches",
    "Maggi",
    "Wraps",
    "Snacks",
    "Extras",
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  console.log("Active Category:", activeCategory);
  console.log("Search Query:", searchQuery);
  console.log("Items:", items);
  console.log("Filtered Items:", filteredItems);

  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen bg-brand-bg font-sans p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8 sticky top-0 bg-brand-bg/90 backdrop-blur-sm z-20 py-4">
        <Link href="/" className="flex items-center gap-2 group text-brand-dark hover:text-brand-orange transition-colors">
          <ArrowLeft size={24} />
          <span className="font-black text-2xl tracking-tight">Back</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/student/profile" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-dark hover:bg-brand-orange hover:text-white transition-colors shadow-sm">
            <User size={20} />
          </Link>
          <Link href="/cart" className="bg-brand-dark text-white px-6 py-2 rounded-full font-bold hover:bg-black transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <ShoppingCart size={20} />
            CART
            {totalQty > 0 && (
              <span className="bg-brand-orange text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalQty}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main>
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-4">OUR MENU</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
            Freshly brewed chai, crispy snacks, and hearty meals served with love.
          </p>

          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search for chai, snacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 rounded-full border-2 border-gray-100 focus:border-brand-orange focus:outline-none shadow-sm text-lg"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-6 mb-6 justify-start no-scrollbar px-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all ${activeCategory === cat
                ? "bg-brand-dark text-white shadow-md"
                : "bg-white text-gray-500 hover:bg-gray-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, i) => (
            <div
              key={item.id}
              className={`bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-full ${!item.available ? "opacity-75 grayscale" : ""
                }`}
            >
              <div>
                <div className="relative h-48 w-full mb-4 rounded-2xl overflow-hidden bg-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      {i % 4 === 0 ? <Coffee size={48} /> : i % 4 === 1 ? <Sandwich size={48} /> : i % 4 === 2 ? <Pizza size={48} /> : <UtensilsCrossed size={48} />}
                    </div>
                  )}
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-brand-dark px-4 py-1 rounded-full font-bold text-sm">SOLD OUT</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-bold text-brand-dark leading-tight group-hover:text-brand-orange transition-colors">
                      {item.name}
                    </h2>
                    {item.rating !== undefined && item.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-gray-600 text-sm font-bold">{item.rating.toFixed(1)}</span>
                        <span className="text-gray-400 text-xs">({item.reviews?.length || 0})</span>
                      </div>
                    )}
                  </div>
                  <span className="font-black text-lg text-brand-dark whitespace-nowrap ml-2">₹{item.price}</span>
                </div>

                <p className="text-gray-400 text-xs mb-4 uppercase tracking-wider font-bold">
                  {item.category}
                </p>

                <button
                  onClick={() => handleOpenReviews(item)}
                  className="w-full py-2 mb-3 bg-brand-orange/10 text-brand-orange rounded-xl font-bold hover:bg-brand-orange/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Star size={16} />
                  {item.reviews?.length ? `See ${item.reviews.length} Reviews` : "Write a Review"}
                </button>
              </div>

              <div className="mt-auto">
                {item.available ? (
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-brand-orange transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    <span>ADD</span>
                    <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-xs">
                      <Plus size={12} />
                    </span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-bold cursor-not-allowed"
                  >
                    UNAVAILABLE
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-brand-dark text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in-up z-50">
          <div className="bg-green-500 rounded-full p-1">
            <Check size={16} className="text-white" />
          </div>
          <span className="font-bold">Item added to cart!</span>
        </div>
      )}

      {/* Reviews Modal */}
      {selectedItemForReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-fade-in relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setSelectedItemForReview(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-brand-dark mb-2">
              Reviews for {selectedItemForReview.name}
            </h2>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Add Your Review</h3>
              <div className="flex gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-2xl ${star <= newReview.rating ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    <Star size={24} fill="currentColor" />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Write a comment..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl mb-2 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                rows={3}
              />
              <button
                onClick={handleSubmitReview}
                className="w-full bg-brand-dark text-white py-2 rounded-xl font-bold hover:bg-brand-orange transition-colors"
              >
                Submit Review
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Recent Reviews</h3>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-brand-dark">{review.user.name}</span>
                      <div className="flex text-yellow-400 text-sm">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                    {/* Add delete button if current user owns the review (logic needed) */}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
