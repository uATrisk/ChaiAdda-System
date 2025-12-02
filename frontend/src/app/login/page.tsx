"use client";

import Link from "next/link";
import { Coffee, Store, User } from "lucide-react";

export default function LoginSelectionPage() {
    return (
        <div className="min-h-screen flex bg-brand-bg font-sans">
            {/* Left Side - Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-brand-yellow relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-brand-orange/20 mix-blend-multiply"></div>
                <div className="relative z-10 text-center p-12">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-brand-dark mx-auto mb-8 shadow-xl animate-bounce-slow">
                        <Coffee size={64} />
                    </div>
                    <h1 className="text-6xl font-black text-brand-dark mb-4 tracking-tight">CHAI ADDA</h1>
                    <p className="text-2xl text-brand-dark/80 font-bold">Your daily dose of happiness.</p>
                </div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side - Selection */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white lg:rounded-l-[3rem] shadow-2xl z-10">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl font-black text-brand-dark mb-2">Welcome Back!</h2>
                        <p className="text-gray-400 text-lg">Choose your portal to continue.</p>
                    </div>

                    <div className="space-y-4">
                        <Link href="/login/student" className="block group">
                            <div className="flex items-center gap-6 p-6 rounded-2xl border-2 border-gray-100 hover:border-brand-orange hover:bg-brand-yellow/10 transition-all cursor-pointer">
                                <div className="w-16 h-16 bg-brand-yellow/20 rounded-full flex items-center justify-center text-brand-dark group-hover:scale-110 transition-transform">
                                    <User size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-brand-dark">Student Login</h3>
                                    <p className="text-gray-400 text-sm">Order food & track status</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/login/vendor" className="block group">
                            <div className="flex items-center gap-6 p-6 rounded-2xl border-2 border-gray-100 hover:border-brand-dark hover:bg-gray-50 transition-all cursor-pointer">
                                <div className="w-16 h-16 bg-brand-dark/10 rounded-full flex items-center justify-center text-brand-dark group-hover:scale-110 transition-transform">
                                    <Store size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-brand-dark">Vendor Login</h3>
                                    <p className="text-gray-400 text-sm">Manage orders & menu</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <p className="text-center text-gray-500 font-medium">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-brand-orange font-bold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
