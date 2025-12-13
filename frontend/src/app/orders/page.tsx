"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";

interface Order {
    id: string;
    amount: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
    items: { item: { name: string }; qty: number }[];
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
                setOrders(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-24">
            {/* Header */}
            <div className="bg-white pt-8 pb-6 px-6 sticky top-0 z-20 border-b border-gray-100/50 backdrop-blur-xl bg-white/80">
                <div className="max-w-2xl mx-auto flex justify-between items-center">
                    <Link href="/menu" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-brand-dark hover:bg-brand-orange hover:text-white transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-black text-brand-dark tracking-tight">YOUR ORDERS</h1>
                    <div className="w-10"></div> {/* Spacer for balance */}
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
                {orders.map((order) => (
                    <Link href={`/order/${order.id}`} key={order.id} className="block group">
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                            {/* Top Row: Date & Status */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${order.orderStatus === 'READY' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${order.orderStatus === "READY" ? "bg-green-100 text-green-700" :
                                        order.orderStatus === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                                            "bg-gray-100 text-gray-500"
                                    }`}>
                                    {order.orderStatus.replace("_", " ")}
                                </span>
                            </div>

                            {/* Middle Row: Items & Price */}
                            <div className="flex justify-between items-end mb-4">
                                <div className="space-y-1 flex-1">
                                    <h3 className="text-lg font-bold text-brand-dark leading-tight">
                                        {order.items.map(i => i.item.name).slice(0, 2).join(", ")}
                                        {order.items.length > 2 && <span className="text-gray-400 font-normal"> +{order.items.length - 2} more</span>}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-medium">Order #{order.id.slice(-4).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-black text-brand-dark tracking-tight">₹{order.amount}</span>
                                </div>
                            </div>

                            {/* Bottom Row: Action Hint */}
                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center group-hover:border-gray-100 transition-colors">
                                <span className={`text-xs font-bold flex items-center gap-1 ${order.paymentStatus === "VERIFIED" ? "text-green-600" :
                                        order.paymentStatus === "FAILED" ? "text-red-500" : "text-brand-orange"
                                    }`}>
                                    {order.paymentStatus === "VERIFIED" ? "Paid via UPI" : "Payment Pending"}
                                </span>
                                <span className="text-xs font-bold text-gray-400 group-hover:text-brand-orange transition-colors flex items-center gap-1">
                                    View Receipt <ArrowLeft size={14} className="rotate-180" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-32 px-6">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <UtensilsCrossed size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-brand-dark mb-2">No Past Orders</h2>
                        <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                            It feels a bit empty here. Why not fill it with some delicious memories?
                        </p>
                        <Link href="/menu" className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-orange transition-all shadow-xl shadow-brand-dark/20 inline-flex items-center gap-2">
                            Explore Menu <ArrowLeft size={18} className="rotate-180" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
