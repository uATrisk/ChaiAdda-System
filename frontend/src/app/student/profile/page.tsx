"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPut, apiDelete } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Edit2, Trash2, Star, Package, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Review {
    id: string;
    rating: number;
    comment: string;
    item: { name: string };
    itemId: string;
    createdAt: string;
}

interface OrderItem {
    id: string;
    qty: number;
    price: number;
    item: { name: string };
}

interface Order {
    id: string;
    amount: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
    items: OrderItem[];
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/login");
            return;
        }
        const userData = JSON.parse(userStr);
        setUser(userData);
        setNewName(userData.name);



        apiGet("/reviews/user/me")
            .then((data) => {
                if (Array.isArray(data)) {
                    setReviews(data);
                } else {
                    console.error("Reviews data is not an array:", data);
                    setReviews([]);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch reviews", err);
                setReviews([]);
            });

        apiGet("/orders/my-orders")
            .then((data) => {
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error("Orders data is not an array:", data);
                    setOrders([]);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch orders", err);
                setOrders([]);
            });
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const res = await apiPut("/auth/profile", { name: newName });
            if (res.user) {
                localStorage.setItem("user", JSON.stringify(res.user));
                setUser(res.user);
                setIsEditing(false);
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            alert("Failed to update profile");
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm("Are you sure you want to delete this review?")) {
            return;
        }

        try {
            await apiDelete(`/reviews/${reviewId}`);
            setReviews(reviews.filter(r => r.id !== reviewId));
            alert("Review deleted successfully!");
        } catch (error) {
            console.error("Delete review error:", error);
            alert("Failed to delete review");
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone and will delete all your orders and reviews.")) {
            return;
        }

        if (!confirm("This is your final warning. Your account will be permanently deleted. Continue?")) {
            return;
        }

        try {
            await apiDelete("/auth/account");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            alert("Account deleted successfully");
            router.push("/login");
        } catch (error) {
            console.error("Delete account error:", error);
            alert("Failed to delete account");
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg font-sans p-4 md:p-8 max-w-4xl mx-auto">
            <header className="flex items-center gap-4 mb-8">
                <Link href="/menu" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-dark hover:bg-brand-orange hover:text-white transition-colors shadow-sm">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-black text-brand-dark tracking-tight">MY PROFILE</h1>
            </header>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
                        <User size={40} />
                    </div>
                    <div className="flex-1">
                        {isEditing ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                />
                                <button
                                    onClick={handleUpdateProfile}
                                    className="bg-brand-dark text-white px-4 py-2 rounded-xl font-bold hover:bg-brand-orange transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-bold text-brand-dark">{user?.name}</h2>
                                <p className="text-gray-500">{user?.email}</p>
                            </div>
                        )}
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-gray-400 hover:text-brand-orange transition-colors"
                        >
                            <Edit2 size={20} />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-red-100 mb-8">
                <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-gray-600 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button
                    onClick={handleDeleteAccount}
                    className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition-colors"
                >
                    Delete Account
                </button>
            </div>

            <h2 className="text-xl font-black text-brand-dark mb-4 px-2">CURRENT ORDERS</h2>
            <div className="space-y-4">
                {orders.filter(o => o.orderStatus !== "DELIVERED").length === 0 ? (
                    <p className="text-gray-500 text-center py-8 bg-white rounded-[2rem]">No current orders.</p>
                ) : (
                    orders.filter(o => o.orderStatus !== "DELIVERED").map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center">
                                        <Package size={24} className="text-brand-orange" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-brand-dark">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-brand-dark">₹{order.amount}</p>
                                    <div className="flex gap-2 mt-1">
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${order.paymentStatus === "VERIFIED" ? "bg-green-100 text-green-700" :
                                                order.paymentStatus === "FAILED" ? "bg-red-100 text-red-700" :
                                                    "bg-orange-100 text-orange-700"
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${order.orderStatus === "READY" ? "bg-green-100 text-green-700" :
                                                order.orderStatus === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                                                    "bg-gray-100 text-gray-700"
                                            }`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-3 mt-3">
                                <p className="text-sm text-gray-600 mb-2">Items:</p>
                                <div className="space-y-1">
                                    {order.items.map((item) => (
                                        <p key={item.id} className="text-sm text-gray-700">
                                            {item.item.name} x {item.qty}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <Link
                                href={`/order/${order.id}`}
                                className="mt-4 block text-center py-2 bg-brand-dark text-white rounded-xl font-bold hover:bg-brand-orange transition-colors"
                            >
                                View Details
                            </Link>
                        </div>
                    ))
                )}
            </div>

            <h2 className="text-xl font-black text-brand-dark mb-4 px-2 mt-8">COMPLETED ORDERS</h2>
            <div className="space-y-4">
                {orders.filter(o => o.orderStatus === "DELIVERED").length === 0 ? (
                    <p className="text-gray-500 text-center py-8 bg-white rounded-[2rem]">No completed orders yet.</p>
                ) : (
                    orders.filter(o => o.orderStatus === "DELIVERED").map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 opacity-75">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle size={24} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-brand-dark">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className="font-black text-brand-dark">₹{order.amount}</p>
                            </div>
                            <div className="border-t border-gray-100 pt-3 mt-3">
                                <p className="text-sm text-gray-600 mb-2">Items:</p>
                                <div className="space-y-1">
                                    {order.items.map((item) => (
                                        <p key={item.id} className="text-sm text-gray-700">
                                            {item.item.name} x {item.qty}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <h2 className="text-xl font-black text-brand-dark mb-4 px-2 mt-8">MY REVIEWS</h2>
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 bg-white rounded-[2rem]">You haven't written any reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-brand-dark">{review.item.name}</h3>
                                <div className="flex text-yellow-400 text-sm">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 mb-4">{review.comment}</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
