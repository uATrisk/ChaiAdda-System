"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { Store } from "lucide-react";

export default function VendorSignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role: "ADMIN" }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Signup failed");
                setLoading(false);
                return;
            }

            router.push("/login/vendor");
        } catch (err) {
            setError("Network error");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-brand-bg font-sans">
            {/* Left Side */}
            <div className="hidden lg:flex lg:w-1/2 bg-brand-dark relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-brand-orange/10 mix-blend-overlay"></div>
                <div className="relative z-10 text-center p-12">
                    <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl border border-white/20">
                        <Store size={64} />
                    </div>
                    <h1 className="text-6xl font-black text-white mb-4 tracking-tight">CHAI ADDA</h1>
                    <p className="text-2xl text-white/80 font-bold">Join as a Vendor</p>
                </div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-orange/20 rounded-full blur-3xl"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white lg:rounded-l-[3rem] shadow-2xl z-10">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl font-black text-brand-dark mb-2">Vendor Signup</h2>
                        <p className="text-gray-400 text-lg">Create your store account.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 font-bold text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1">Store Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all font-medium"
                                placeholder="My Chai Shop"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all font-medium"
                                placeholder="vendor@chaiadda.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl text-white font-bold text-xl transition-all shadow-lg transform active:scale-[0.99] ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-brand-dark hover:bg-brand-orange hover:shadow-orange-200"
                                }`}
                        >
                            {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 font-medium">
                        Already have an account?{" "}
                        <Link href="/login/vendor" className="text-brand-orange font-bold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
