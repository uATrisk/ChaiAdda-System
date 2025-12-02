"use client";

import Link from "next/link";
import { ArrowLeft, Target, Lightbulb, Code, Palette, Settings, Mail, Rocket, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-brand-bg font-sans p-4 md:p-8 max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-12">
                <Link href="/" className="flex items-center gap-2 text-brand-dark font-bold hover:text-brand-orange transition-colors">
                    <ArrowLeft size={24} /> Back to Home
                </Link>
                <h1 className="text-2xl md:text-4xl font-black text-brand-dark">ABOUT US</h1>
            </header>

            <main className="space-y-8">
                {/* Hero Section */}
                <section className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-2xl font-black text-brand-dark mb-4">Brewing Happiness.</h2>
                        <p className="text-gray-500 text-base leading-relaxed mb-6">
                            Chai Adda is a community hub designed to solve crowded canteens with a seamless, digital-first ordering experience.
                        </p>
                        <div className="flex gap-4">
                            <div className="bg-brand-yellow/20 text-brand-dark px-6 py-3 rounded-full font-bold flex items-center gap-2">
                                <Rocket size={20} /> Fast Ordering
                            </div>
                            <div className="bg-brand-blue/20 text-brand-dark px-6 py-3 rounded-full font-bold flex items-center gap-2">
                                <Heart size={20} /> Made with Love
                            </div>
                        </div>
                    </div>

                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </section>

                {/* Mission & Vision Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-brand-dark text-white rounded-[2rem] p-6 md:p-8">
                        <div className="mb-3 text-brand-orange">
                            <Target size={40} />
                        </div>
                        <h3 className="text-xl font-black mb-3">Our Mission</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Eliminating long queues and waiting times, ensuring every student gets their break-time fuel stress-free.
                        </p>
                    </section>

                    <section className="bg-brand-orange text-white rounded-[2rem] p-6 md:p-8">
                        <div className="mb-3 text-brand-dark">
                            <Lightbulb size={40} />
                        </div>
                        <h3 className="text-xl font-black mb-3">Our Vision</h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                            To become the go-to digital platform for campus eateries, fostering efficiency and delight.
                        </p>
                    </section>
                </div>

                {/* Team Section */}
                <section>
                    <h2 className="text-2xl font-black text-brand-dark mb-6 text-center">MEET THE DEVELOPER</h2>
                    <div className="max-w-xs mx-auto">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 text-center hover:shadow-lg transition-all group">
                            <div className="w-20 h-20 bg-gray-50 rounded-full mx-auto mb-4 flex items-center justify-center text-brand-dark group-hover:scale-110 transition-transform">
                                <Code size={40} />
                            </div>
                            <h3 className="text-lg font-bold text-brand-dark">Ansh Tomar</h3>
                            <p className="text-gray-400 text-sm font-medium">Full Stack Developer</p>
                        </div>
                    </div>
                </section>

                {/* Contact/Footer */}
                <section className="bg-brand-blue rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-brand-dark mb-4">Got Feedback?</h2>
                        <p className="text-brand-dark/70 mb-8 max-w-lg mx-auto">
                            We are constantly improving. If you have any suggestions or found a bug, let us know!
                        </p>
                        <a href="mailto:contact@chaiadda.com" className="bg-brand-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-colors inline-block shadow-lg">
                            Contact Us
                        </a>
                    </div>
                    <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
                </section>
            </main>
        </div>
    );
}
