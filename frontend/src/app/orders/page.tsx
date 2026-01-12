"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, XCircle, ShoppingBag, ChevronRight, Receipt } from "lucide-react";

interface Order {
    id: string;
    amount: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
    items: { item: { name: string; image?: string }; qty: number }[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        apiGet("/orders/my-orders")
            .then((data) => {
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "READY":
                return "bg-green-100 text-green-700 border-green-200";
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "COMPLETED":
                return "bg-gray-100 text-gray-700 border-gray-200";
            case "CANCELLED":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-orange-50 text-orange-700 border-orange-100";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "READY":
                return <CheckCircle2 size={14} />;
            case "IN_PROGRESS":
                return <Clock size={14} className="animate-spin-slow" />;
            case "CANCELLED":
                return <XCircle size={14} />;
            default:
                return <Clock size={14} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans pb-24">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-100 transition-all duration-200">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/menu" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700 hover:bg-brand-orange hover:text-white transition-all active:scale-95">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-black text-brand-dark tracking-tight">MY ORDERS</h1>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500">
                        {orders.length} Orders
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
                {orders.map((order) => (
                    <Link href={`/order/${order.id}`} key={order.id} className="block group">
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-orange/20 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">

                            {/* Status Badge */}
                            <div className="flex justify-between items-start mb-4">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.orderStatus)}`}>
                                    {getStatusIcon(order.orderStatus)}
                                    {order.orderStatus.replace("_", " ")}
                                </div>
                                <span className="text-xs font-bold text-gray-400">
                                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {/* Order Content */}
                            <div className="flex gap-4">
                                {/* Item Images Stack (Visual Only) */}
                                <div className="flex -space-x-3 self-center">
                                    {order.items.slice(0, 3).map((i, idx) => (
                                        <div key={idx} className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                            {/* Ideally render real image if available, else icon */}
                                            <ShoppingBag size={20} className="text-gray-300" />
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 shadow-sm">
                                            +{order.items.length - 3}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-brand-dark truncate pr-4">
                                        {order.items.map(i => i.item.name).join(", ")}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium mt-0.5">
                                        Order ID: <span className="font-mono text-gray-400">#{order.id.slice(-6).toUpperCase()}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-5 pt-4 border-t border-gray-50 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Amount</span>
                                    <span className="text-xl font-black text-brand-dark">₹{order.amount}</span>
                                </div>

                                <div className="flex items-center gap-2 text-brand-orange font-bold text-sm group-hover:gap-3 transition-all">
                                    View Details <ChevronRight size={16} />
                                </div>
                            </div>

                            {/* Decorative Background Blur */}
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/10 transition-colors"></div>
                        </div>
                    </Link>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-20 px-6">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100 animate-bounce-slow">
                            <Receipt size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-black text-brand-dark mb-2">No Past Orders</h2>
                        <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                            It looks like you haven't laid your hands on our delicious menu yet.
                        </p>
                        <Link href="/menu" className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-orange transition-all shadow-xl shadow-brand-dark/20 inline-flex items-center gap-2 active:scale-95">
                            Start Ordering <ChevronRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

// Add custom styles for slow spin if not in global css
const style = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
`;
