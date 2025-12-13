"use client";

import Link from "next/link";
import { ArrowLeft, Target, Lightbulb, Code, Palette, Settings, Mail, Rocket, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-brand-dark">
            {/* Header */}
            <div className="bg-brand-dark text-white pt-8 pb-16 px-4 md:px-8 relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                    <header className="flex justify-between items-center mb-12">
                        <Link href="/" className="flex items-center gap-2 font-bold hover:text-brand-orange transition-colors">
                            <ArrowLeft size={24} /> Back
                        </Link>
                        <span className="font-black tracking-widest text-brand-orange">CHAI ADDA</span>
                    </header>
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                            Revolutionizing Your <span className="text-brand-orange">Chai Break.</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                            No more waiting in lines. Chai Adda brings the canteen to your fingertips with a seamless, digital-first ordering experience.
                        </p>
                    </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <main className="max-w-5xl mx-auto px-4 md:px-8 -mt-10 relative z-20 space-y-12 pb-20">
                {/* Stats/Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center mb-3">
                            <Rocket size={24} />
                        </div>
                        <h3 className="font-bold text-lg">Lightning Fast</h3>
                        <p className="text-gray-500 text-sm">Order in seconds, pick up in minutes.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-3">
                            <Heart size={24} />
                        </div>
                        <h3 className="font-bold text-lg">Made with Love</h3>
                        <p className="text-gray-500 text-sm">Crafted for the ultimate chai lovers.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-3">
                            <Code size={24} />
                        </div>
                        <h3 className="font-bold text-lg">Modern Tech</h3>
                        <p className="text-gray-500 text-sm">Built with the latest web technologies.</p>
                    </div>
                </div>

                {/* Mission Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-brand-dark p-3 rounded-xl text-white mt-1">
                                <Target size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-2">Our Mission</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    To eliminate the chaos of crowded canteens. We want every student to spend their break enjoying their food, not waiting for it.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-brand-orange p-3 rounded-xl text-white mt-1">
                                <Lightbulb size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-2">Our Vision</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    A campus where technology enhances the simplest joys of life—like sharing a cup of chai with friends.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 relative overflow-hidden text-center">
                        {/* Developer Profile */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl"></div>
                        <h2 className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-6">Built By</h2>
                        <div className="inline-block relative">
                            <div className="w-24 h-24 bg-brand-dark text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-white">
                                <Code size={40} />
                            </div>
                            <div className="absolute bottom-4 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                        </div>
                        <h3 className="text-2xl font-black text-brand-dark">Ansh Tomar</h3>
                        <p className="text-gray-500 font-medium mb-4">Full Stack Developer</p>

                        <div className="flex flex-col gap-2 text-sm text-gray-600 mb-6 font-medium">
                            <a href="mailto:anshtomarrr@gmail.com" className="flex items-center justify-center gap-2 hover:text-brand-orange transition-colors">
                                <Mail size={16} /> anshtomarrr@gmail.com
                            </a>
                            <div className="flex items-center justify-center gap-2">
                                <span className="font-bold">📞</span> 9927279293
                            </div>
                            <a href="https://www.linkedin.com/in/ansh-tomar-03a493302/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                                <span>LinkedIn Profile</span>
                            </a>
                        </div>

                        <div className="flex justify-center gap-3">
                            <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold text-gray-600">React</span>
                            <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold text-gray-600">Node.js</span>
                            <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold text-gray-600">Prisma</span>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="bg-brand-dark rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-4">Have Feedback?</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            We are constantly evolving. If you have ideas or spotted a bug, drop us a line.
                        </p>
                        <a href="mailto:anshtomarrr@gmail.com" className="bg-brand-orange text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-brand-orange transition-colors inline-flex items-center gap-2">
                            <Mail size={18} /> Contact Developer
                        </a>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-orange/20 to-transparent"></div>
                </div>
            </main>
        </div>
    );
}
