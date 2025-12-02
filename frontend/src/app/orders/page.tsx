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
            <div className="min-h-screen flex items-center justify-center bg-brand-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg font-sans p-4 md:p-8 max-w-3xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <Link href="/menu" className="flex items-center gap-2 text-brand-dark font-bold hover:text-brand-orange transition-colors">
                    <ArrowLeft size={24} /> Back to Menu
                </Link>
                <h1 className="text-3xl font-black text-brand-dark">MY ORDERS</h1>
            </header>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Link href={`/order/${order.id}`} key={order.id} className="block">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-mono text-gray-400">#{order.id.slice(-6)}</span>
                                        <span className="text-xs text-gray-400">• {new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-xl text-brand-dark">₹{order.amount}</h3>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black ${order.orderStatus === "READY" ? "bg-green-100 text-green-700" :
                                        order.orderStatus === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                                            "bg-brand-yellow/20 text-brand-dark"
                                        }`}>
                                        {order.orderStatus}
                                    </span>
                                    <span className={`text-xs font-bold ${order.paymentStatus === "VERIFIED" ? "text-green-500" :
                                        order.paymentStatus === "FAILED" ? "text-red-500" :
                                            "text-brand-orange"
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm text-gray-600">
                                        <span>{item.item.name}</span>
                                        <span className="font-bold">x{item.qty}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4 text-gray-300 flex justify-center">
                            <UtensilsCrossed size={64} />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-dark mb-2">No orders yet</h2>
                        <p className="text-gray-400 mb-8">Hungry? Order something delicious!</p>
                        <Link href="/menu" className="bg-brand-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-orange transition-colors shadow-lg">
                            Browse Menu
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
