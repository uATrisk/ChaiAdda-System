"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { User, LogOut, ShoppingCart, Menu, X, ChevronDown, LayoutDashboard, ShoppingBag } from "lucide-react";

export default function Navbar() {
    const { cart } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
    };

    return (
        <nav className="relative z-50">
            <div className="flex justify-between items-center mb-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center text-white font-black text-lg">
                        C
                    </div>
                    <span className="font-black text-xl tracking-tight">CHAI ADDA</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-8 font-medium text-gray-600">
                    <Link href="/menu" className="hover:text-black transition-colors">Menu</Link>
                    <Link href="/about" className="hover:text-black transition-colors">About</Link>
                    <Link href="/orders" className="hover:text-black transition-colors">Orders</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/cart" className="bg-brand-dark text-white px-6 py-2 rounded-full font-bold hover:bg-black transition-colors flex items-center gap-2">
                        <ShoppingCart size={20} />
                        <span className="hidden sm:inline">CART</span>
                        {cart.length > 0 && (
                            <span className="bg-brand-orange text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    {/* Profile Section */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-brand-dark hover:bg-brand-yellow/20 transition-colors border border-gray-200"
                            >
                                <User size={20} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-50">
                                    <div className="p-4 border-b border-gray-50">
                                        <p className="font-bold text-brand-dark truncate">{user.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <Link
                                            href="/orders"
                                            className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <ShoppingBag size={16} />
                                            My Orders
                                        </Link>
                                        {user.role === "ADMIN" && (
                                            <Link
                                                href="/vendor/dashboard"
                                                className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <LayoutDashboard size={16} />
                                                Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="font-bold text-brand-dark hover:text-brand-orange transition-colors flex items-center gap-2"
                        >
                            <User size={20} />
                            <span className="hidden sm:inline">Login</span>
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-brand-dark"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex flex-col gap-4 md:hidden animate-fade-in">
                    <Link
                        href="/menu"
                        className="p-2 font-bold text-gray-600 hover:text-brand-orange hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Menu
                    </Link>
                    <Link
                        href="/about"
                        className="p-2 font-bold text-gray-600 hover:text-brand-orange hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        About
                    </Link>
                    <Link
                        href="/orders"
                        className="p-2 font-bold text-gray-600 hover:text-brand-orange hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Orders
                    </Link>
                    {user ? (
                        <>
                            <div className="border-t border-gray-100 my-2"></div>
                            <div className="px-2 py-1">
                                <p className="font-bold text-sm text-brand-dark">{user.name}</p>
                                <p className="font-bold text-sm text-brand-dark">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                            {user.role === "ADMIN" && (
                                <Link
                                    href="/vendor/dashboard"
                                    className="p-2 font-bold text-gray-600 hover:text-brand-orange hover:bg-gray-50 rounded-lg transition-colors block"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="p-2 font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="p-2 font-bold text-brand-dark hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
