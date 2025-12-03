"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPut, apiDelete } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, User, Edit2, Trash2, LogOut, ShoppingBag, Heart, MapPin, Phone, Star } from "lucide-react";
import Link from "next/link";

interface Review {
    id: string;
    rating: number;
    comment: string;
    item: { name: string };
    itemId: string;
    createdAt: string;
}

type ViewState = "MENU" | "NAME" | "CONTACT" | "ADDRESS" | "ORDERS" | "FAVOURITES" | "REVIEWS";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [currentView, setCurrentView] = useState<ViewState>("MENU");
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
            .then((data) => setReviews(Array.isArray(data) ? data : []))
            .catch(() => setReviews([]));

        apiGet("/orders/my-orders")
            .then((data) => setOrders(Array.isArray(data) ? data : []))
            .catch(() => setOrders([]));
    }, []);

    const activeOrders = orders.filter(o => ["RECEIVED", "IN_PROGRESS", "READY"].includes(o.orderStatus));
    const completedOrders = orders.filter(o => ["DELIVERED", "CANCELLED"].includes(o.orderStatus));

    const handleUpdateProfile = async () => {
        try {
            const res = await apiPut("/auth/profile", { name: newName });
            if (res.user) {
                localStorage.setItem("user", JSON.stringify(res.user));
                setUser(res.user);
                alert("Profile updated successfully!");
                setCurrentView("MENU");
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            alert("Failed to update profile");
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            await apiDelete(`/reviews/${reviewId}`);
            setReviews(reviews.filter(r => r.id !== reviewId));
            alert("Review deleted successfully!");
        } catch (error) {
            alert("Failed to delete review");
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("⚠️ Are you sure you want to delete your account? This action cannot be undone.")) return;
        if (!confirm("Final warning. Delete account?")) return;
        try {
            await apiDelete("/auth/account");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
        } catch (error) {
            alert("Failed to delete account");
        }
    };

    const MenuItem = ({ icon: Icon, label, onClick, danger = false }: { icon: any, label: string, onClick: () => void, danger?: boolean }) => (
        <button
            onClick={onClick}
            className={`w-full bg-white p-4 flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${danger ? 'text-red-500' : 'text-brand-dark'}`}
        >
            <div className="flex items-center gap-4">
                <Icon size={20} className={danger ? "text-red-500" : "text-gray-400"} />
                <span className="font-medium text-lg">{label}</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
        </button>
    );

    const renderContent = () => {
        switch (currentView) {
            case "NAME":
                return (
                    <div className="bg-white p-6 rounded-3xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Change Name</h2>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                            placeholder="Enter your name"
                        />
                        <button onClick={handleUpdateProfile} className="w-full bg-brand-dark text-white py-3 rounded-xl font-bold">Save Changes</button>
                    </div>
                );
            case "CONTACT":
                return (
                    <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
                        <Phone size={48} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-bold mb-2">Contact Details</h2>
                        <p className="text-gray-500 mb-4">Email: {user?.email}</p>
                        <p className="text-sm text-gray-400">Contact updates are currently disabled.</p>
                    </div>
                );
            case "ADDRESS":
                return (
                    <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
                        <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-bold mb-2">Manage Address</h2>
                        <p className="text-gray-500">Address management coming soon!</p>
                    </div>
                );
            case "ORDERS":
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-gray-500 mb-3 px-2">ACTIVE ORDERS</h3>
                            {activeOrders.length === 0 ? <p className="text-center text-gray-400 py-4">No active orders</p> :
                                activeOrders.map(order => (
                                    <Link key={order.id} href={`/order/${order.id}`} className="block bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold">#{order.id.slice(0, 8)}</span>
                                            <span className="text-brand-orange font-bold">{order.orderStatus}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{order.items.map((i: any) => `${i.qty}x ${i.item.name}`).join(", ")}</p>
                                        <p className="text-xs text-gray-400 mt-2">{new Date(order.createdAt).toLocaleDateString()} • ₹{order.amount}</p>
                                    </Link>
                                ))
                            }
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-500 mb-3 px-2">PAST ORDERS</h3>
                            {completedOrders.length === 0 ? <p className="text-center text-gray-400 py-4">No past orders</p> :
                                completedOrders.map(order => (
                                    <div key={order.id} className="bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100 opacity-75">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold">#{order.id.slice(0, 8)}</span>
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{order.orderStatus}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{order.items.map((i: any) => `${i.qty}x ${i.item.name}`).join(", ")}</p>
                                        <p className="text-xs text-gray-400 mt-2">{new Date(order.createdAt).toLocaleDateString()} • ₹{order.amount}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                );
            case "FAVOURITES":
                return (
                    <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
                        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-bold mb-2">My Favourites</h2>
                        <p className="text-gray-500">Save your favourite items here soon!</p>
                    </div>
                );
            case "REVIEWS":
                return (
                    <div className="space-y-4">
                        {reviews.length === 0 ? <p className="text-center text-gray-400 py-8">No reviews yet</p> :
                            reviews.map(review => (
                                <div key={review.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold">{review.item.name}</h4>
                                        <div className="flex text-yellow-400 text-xs">
                                            {Array.from({ length: review.rating }).map((_, i) => <span key={i}>★</span>)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{review.comment}</p>
                                    <button onClick={() => handleDeleteReview(review.id)} className="text-red-500 text-xs flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded">
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg font-sans p-4 md:p-8 max-w-md mx-auto">
            <header className="flex items-center gap-4 mb-8">
                {currentView === "MENU" ? (
                    <Link href="/menu" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-dark hover:bg-brand-orange hover:text-white transition-colors shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                ) : (
                    <button onClick={() => setCurrentView("MENU")} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-dark hover:bg-brand-orange hover:text-white transition-colors shadow-sm">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <h1 className="text-2xl font-black text-brand-dark tracking-tight">
                    {currentView === "MENU" ? "MY PROFILE" :
                        currentView === "NAME" ? "CHANGE NAME" :
                            currentView === "CONTACT" ? "CONTACT INFO" :
                                currentView === "ADDRESS" ? "ADDRESS" :
                                    currentView === "ORDERS" ? "MY ORDERS" :
                                        currentView === "FAVOURITES" ? "FAVOURITES" : "MY REVIEWS"}
                </h1>
            </header>

            {currentView === "MENU" ? (
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
                        <MenuItem icon={User} label="Change Name" onClick={() => setCurrentView("NAME")} />
                        <MenuItem icon={Phone} label="Change Mobile Number / Email" onClick={() => setCurrentView("CONTACT")} />
                        <MenuItem icon={MapPin} label="Manage Address" onClick={() => setCurrentView("ADDRESS")} />
                    </div>

                    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
                        <MenuItem icon={ShoppingBag} label="My Orders" onClick={() => setCurrentView("ORDERS")} />
                        <MenuItem icon={Heart} label="My Favourites" onClick={() => setCurrentView("FAVOURITES")} />
                        <MenuItem icon={Star} label="My Reviews" onClick={() => setCurrentView("REVIEWS")} />
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            router.push("/login");
                        }}
                        className="w-full bg-white p-4 rounded-[2rem] flex items-center justify-center gap-2 text-brand-dark font-bold shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <LogOut size={20} /> Logout
                    </button>

                    <button
                        onClick={handleDeleteAccount}
                        className="w-full text-red-500 text-sm font-medium py-2 hover:underline"
                    >
                        Delete Account
                    </button>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    {renderContent()}
                </div>
            )}
        </div>
    );
}
