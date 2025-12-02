"use client";

import React, { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { Menu, Coffee, BarChart, ShoppingBag, UtensilsCrossed, TrendingUp, Star, Tag, LogOut, IndianRupee, Clock, Construction } from "lucide-react";
import { apiGet, API_URL } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Order {
    id: string;
    amount: number;
    paymentStatus: string;
    orderStatus: string;
    utr: string | null;
    createdAt: string;
    items: { item: { name: string }; qty: number }[];
}

interface Item {
    id: string;
    name: string;
    price: number;
    available: boolean;
}

const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, router }: any) => (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block shadow-2xl`}>
        <div className="p-8">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark">
                    <Coffee size={24} />
                </div>
                <h1 className="text-2xl font-black tracking-tight">CHAI ADDA</h1>
            </div>

            <nav className="space-y-2">
                {[
                    { id: "overview", label: "Overview", icon: <BarChart size={20} /> },
                    { id: "orders", label: "Orders", icon: <ShoppingBag size={20} /> },
                    { id: "menu", label: "Menu", icon: <UtensilsCrossed size={20} /> },
                    { id: "analytics", label: "Analytics", icon: <TrendingUp size={20} /> },
                    { id: "reviews", label: "Reviews", icon: <Star size={20} /> },
                    { id: "offers", label: "Offers", icon: <Tag size={20} /> },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id ? "bg-brand-orange text-white shadow-lg" : "text-gray-400 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>

        <div className="absolute bottom-8 left-0 w-full px-8">
            <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); router.push("/login"); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-white/5 transition-all">
                <span><LogOut size={20} /></span> Logout
            </button>
        </div>
    </aside>
);

const StatCard = ({ title, value, icon, color }: any) => (
    <div className={`bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all`}>
        <div className="relative z-10">
            <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-2">{title}</p>
            <p className="text-4xl font-black text-brand-dark">{value}</p>
        </div>
        <div className={`absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform ${color}`}>
            {icon}
        </div>
    </div>
);

const OrderCard = ({ order, updateOrderStatus }: { order: Order; updateOrderStatus: (id: string, status: string) => void }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all mb-4">
        <div className="flex justify-between items-start mb-4">
            <div>
                <span className="text-xs font-mono text-gray-400">#{order.id.slice(-6)}</span>
                <p className="font-bold text-lg text-brand-dark">₹{order.amount}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${order.orderStatus === "READY" ? "bg-green-100 text-green-700" :
                order.orderStatus === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                    "bg-brand-yellow/20 text-brand-dark"
                }`}>
                {order.orderStatus}
            </span>
        </div>

        <div className="space-y-2 mb-4">
            {order.items?.map((i, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-600">
                    <span>{i.item?.name || "Unknown Item"}</span>
                    <span className="font-bold">x{i.qty}</span>
                </div>
            ))}
        </div>

        <div className="flex gap-2 mt-4">
            {order.orderStatus === "RECEIVED" && (
                <button onClick={() => updateOrderStatus(order.id, "IN_PROGRESS")} className="flex-1 bg-brand-dark text-white py-2 rounded-lg font-bold text-sm hover:bg-brand-orange transition-colors">
                    Accept
                </button>
            )}
            {order.orderStatus === "IN_PROGRESS" && (
                <button onClick={() => updateOrderStatus(order.id, "READY")} className="flex-1 bg-brand-blue text-brand-dark py-2 rounded-lg font-bold text-sm hover:bg-blue-300 transition-colors">
                    Mark Ready
                </button>
            )}
            {order.orderStatus === "READY" && (
                <button onClick={() => updateOrderStatus(order.id, "DELIVERED")} className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-green-600 transition-colors">
                    Complete
                </button>
            )}
            <Link href={`/vendor/order/${order.id}`} className="px-3 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
                ➔
            </Link>
        </div>
    </div>
);

export default function DashboardContent() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/login");
            return;
        }

        const user = JSON.parse(userStr);
        if (user.role !== "ADMIN") {
            router.push("/");
            return;
        }

        apiGet("/vendor/orders").then((data) => {
            setOrders(data);
        });

        apiGet("/items").then(setItems);

        const handleNewOrder = (order: Order) => {
            setOrders((prev) => [order, ...prev]);
        };

        const handleOrderUpdate = (data: { orderId: string; type: string; status?: string }) => {
            setOrders((prev) =>
                prev.map((o) => {
                    if (o.id === data.orderId) {
                        if (data.type === "PAYMENT_VERIFIED") return { ...o, paymentStatus: "VERIFIED", orderStatus: "IN_PROGRESS" };
                        if (data.type === "PAYMENT_REJECTED") return { ...o, paymentStatus: "FAILED", orderStatus: "RECEIVED" };
                        if (data.type === "STATUS_UPDATED" && data.status) return { ...o, orderStatus: data.status };
                    }
                    return o;
                })
            );
        };

        socket.on("new-order", handleNewOrder);
        socket.on("order-update", handleOrderUpdate);

        return () => {
            socket.off("new-order", handleNewOrder);
            socket.off("order-update", handleOrderUpdate);
        };
    }, []);

    const updateOrderStatus = async (orderId: string, status: string) => {
        await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status }),
        });
    };

    const today = new Date().toDateString();
    const todaysOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
    const todaysRevenue = todaysOrders.reduce((acc, o) => (o.paymentStatus === "VERIFIED" ? acc + o.amount : acc), 0);
    const pendingOrders = orders.filter((o) => o.orderStatus === "RECEIVED" || o.orderStatus === "IN_PROGRESS").length;

    const itemSales: Record<string, number> = {};
    orders.forEach(order => {
        if (order.items) {
            order.items.forEach(orderItem => {
                const itemName = orderItem.item?.name || "Unknown Item";
                itemSales[itemName] = (itemSales[itemName] || 0) + orderItem.qty;
            });
        }
    });
    const topItems = Object.entries(itemSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-brand-bg font-sans flex">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                router={router}
            />

            <div className="md:hidden fixed top-0 left-0 w-full bg-white z-40 px-6 py-4 flex justify-between items-center shadow-sm">
                <h1 className="font-black text-xl text-brand-dark">CHAI ADDA</h1>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-brand-dark">
                    <Menu size={24} />
                </button>
            </div>

            <main className="flex-1 p-6 md:p-10 mt-16 md:mt-0 overflow-y-auto h-screen">
                {activeTab === "overview" && (
                    <div className="space-y-8 animate-fade-in">
                        <header className="mb-8">
                            <h2 className="text-3xl font-black text-brand-dark">Dashboard Overview</h2>
                            <p className="text-gray-400">Welcome back, here's what's happening today.</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Today's Revenue" value={`₹${todaysRevenue}`} icon={<IndianRupee size={80} />} color="text-green-500" />
                            <StatCard title="Total Orders" value={todaysOrders.length} icon={<ShoppingBag size={80} />} color="text-blue-500" />
                            <StatCard title="Pending" value={pendingOrders} icon={<Clock size={80} />} color="text-orange-500" />
                            <StatCard title="Active Items" value={items.filter(i => i.available).length} icon={<UtensilsCrossed size={80} />} color="text-brand-yellow" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <h3 className="font-bold text-xl text-brand-dark mb-6">Weekly Revenue</h3>
                                <div className="h-64 flex items-end justify-between gap-4">
                                    {[40, 70, 45, 90, 60, 80, 100].map((h, i) => (
                                        <div key={i} className="w-full bg-brand-blue/20 rounded-t-xl relative group hover:bg-brand-orange transition-colors" style={{ height: `${h}%` }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                ₹{h * 100}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-4 text-gray-400 text-sm font-bold">
                                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <h3 className="font-bold text-xl text-brand-dark mb-6">Top Selling</h3>
                                <div className="space-y-4">
                                    {topItems.map(([name, qty], i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</span>
                                                <span className="font-medium text-gray-700">{name}</span>
                                            </div>
                                            <span className="font-bold text-brand-dark">{qty} sold</span>
                                        </div>
                                    ))}
                                    {topItems.length === 0 && <p className="text-gray-400 text-sm">No sales data yet.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="animate-fade-in">
                        <header className="mb-8 flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-black text-brand-dark">Order Management</h2>
                                <p className="text-gray-400">Manage and track all orders.</p>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-3xl">
                                <h3 className="font-bold text-gray-500 mb-4 px-2 flex justify-between">
                                    PENDING <span className="bg-white px-2 rounded-full text-xs flex items-center">{orders.filter(o => o.orderStatus === "RECEIVED").length}</span>
                                </h3>
                                {orders.filter(o => o.orderStatus === "RECEIVED").map(order => <OrderCard key={order.id} order={order} updateOrderStatus={updateOrderStatus} />)}
                            </div>

                            <div className="bg-blue-50/50 p-4 rounded-3xl">
                                <h3 className="font-bold text-blue-500 mb-4 px-2 flex justify-between">
                                    PREPARING <span className="bg-white px-2 rounded-full text-xs flex items-center">{orders.filter(o => o.orderStatus === "IN_PROGRESS").length}</span>
                                </h3>
                                {orders.filter(o => o.orderStatus === "IN_PROGRESS").map(order => <OrderCard key={order.id} order={order} updateOrderStatus={updateOrderStatus} />)}
                            </div>

                            <div className="bg-green-50/50 p-4 rounded-3xl">
                                <h3 className="font-bold text-green-600 mb-4 px-2 flex justify-between">
                                    READY <span className="bg-white px-2 rounded-full text-xs flex items-center">{orders.filter(o => o.orderStatus === "READY").length}</span>
                                </h3>
                                {orders.filter(o => o.orderStatus === "READY").map(order => <OrderCard key={order.id} order={order} updateOrderStatus={updateOrderStatus} />)}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "menu" && (
                    <div className="animate-fade-in text-center py-20">
                        <h2 className="text-3xl font-black text-brand-dark mb-4">Menu Management</h2>
                        <p className="text-gray-500 mb-8">Redirecting to dedicated menu manager...</p>
                        <Link href="/vendor/menu" className="bg-brand-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-orange transition-colors shadow-lg">
                            Open Menu Manager
                        </Link>
                    </div>
                )}

                {(activeTab === "analytics" || activeTab === "reviews" || activeTab === "offers") && (
                    <div className="animate-fade-in flex flex-col items-center justify-center h-[60vh] text-center">
                        <div className="text-gray-300 mb-6">
                            <Construction size={64} />
                        </div>
                        <h2 className="text-3xl font-black text-brand-dark mb-2">Coming Soon</h2>
                        <p className="text-gray-400 max-w-md">
                            This feature is currently under development. Stay tuned for updates!
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
