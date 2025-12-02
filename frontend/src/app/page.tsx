"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { Coffee, ArrowRight, Star, Clock, ShieldCheck, Sandwich, Pizza, UtensilsCrossed, X } from "lucide-react";

export default function Home() {
  const { cart } = useCart();
  const [activeDeal, setActiveDeal] = useState<'COMBO' | 'STUDENT' | null>(null);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-brand-yellow rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden min-h-[500px] flex flex-col justify-center group">
          <div className="relative z-10 max-w-lg transition-transform duration-500 group-hover:scale-105">
            <div className="flex gap-2 mb-4">
              <span className="bg-white/30 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold text-brand-dark flex items-center gap-2">
                <Star size={14} fill="currentColor" /> Since 2024
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-6 drop-shadow-sm">
              CHAI<br />ADDA
            </h1>
            <div className="bg-brand-dark text-white inline-block px-6 py-3 rounded-full text-xl font-bold transform -rotate-2 shadow-lg">
              STARTS @ ₹10
            </div>
          </div>

          <div className="absolute top-10 right-10 text-white/20 animate-spin-slow">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
            </svg>
          </div>

          <div className="absolute -right-10 -bottom-10 md:-right-20 md:-bottom-20 w-[120%] h-[120%] md:w-[800px] md:h-[800px] pointer-events-none">
            <img
              src="/hero-chai.png"
              alt="Chai and Bun Maska"
              className="w-full h-full object-contain drop-shadow-2xl animate-float"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div
            onClick={() => setActiveDeal('STUDENT')}
            className="cursor-pointer flex-1 bg-brand-blue rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-between min-h-[240px] group hover:shadow-lg transition-all"
          >
            <div className="relative z-10">
              <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-lg text-xs font-bold text-brand-dark mb-2">
                STUDENT SPECIAL
              </div>
              <h2 className="text-4xl font-black text-brand-dark mb-2 leading-tight">
                10% OFF
              </h2>
              <p className="text-brand-dark/80 font-bold text-lg">
                For Rishihood Students 🎓
              </p>
            </div>

            <div className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold w-fit group-hover:scale-105 transition-transform flex items-center gap-2">
              View Details <ArrowRight size={18} />
            </div>

            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
          </div>

          <div
            onClick={() => setActiveDeal('COMBO')}
            className="cursor-pointer flex-1 bg-brand-orange rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-between min-h-[240px] group hover:shadow-lg transition-all"
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-brand-dark mb-1">PERFECT COMBO</h2>
              <p className="text-white font-bold text-lg opacity-90">Chai + Bun Maska</p>
              <div className="mt-3 bg-white text-brand-orange px-4 py-1 rounded-full text-xl font-black w-fit shadow-sm transform group-hover:-rotate-2 transition-transform">
                ONLY ₹40
              </div>
            </div>

            <div className="absolute right-4 bottom-4">
              <div className="w-20 h-20 bg-brand-dark/10 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Coffee size={32} className="text-brand-dark" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="text-center mb-12">
          <span className="text-brand-orange font-bold tracking-wider text-sm uppercase">Why Choose Us</span>
          <h2 className="text-4xl font-black text-brand-dark">THE CHAI ADDA EXPERIENCE</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Lightning Fast", desc: "Order ahead and skip the queue. Your time matters.", icon: <Clock size={32} /> },
            { title: "Pocket Friendly", desc: "Prices designed for student budgets. No hidden costs.", icon: <ShieldCheck size={32} /> },
            { title: "Made with Love", desc: "Fresh ingredients and authentic recipes in every sip.", icon: <Star size={32} /> },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-brand-orange/30 hover:shadow-xl transition-all group text-center">
              <div className="w-16 h-16 bg-brand-yellow/20 text-brand-dark rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="text-3xl font-black text-brand-dark flex items-center gap-3">
            <span className="w-3 h-8 bg-brand-orange rounded-full"></span>
            Trending Favorites
          </h2>
          <Link href="/menu" className="group flex items-center gap-2 text-brand-dark font-bold hover:text-brand-orange transition-colors">
            View All <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { name: "Masala Chai", desc: "Spiced tea", price: "₹20", color: "bg-brand-orange", icon: <Coffee size={40} /> },
            { name: "Bun Maska", desc: "Fresh bun", price: "₹30", color: "bg-brand-yellow", icon: <Sandwich size={40} /> },
            { name: "Samosa", desc: "Crispy pastry", price: "₹15", color: "bg-brand-blue", icon: <Pizza size={40} /> },
            { name: "Iced Tea", desc: "Lemon chilled", price: "₹40", color: "bg-brand-dark", icon: <UtensilsCrossed size={40} /> },
            { name: "Maggi", desc: "Masala noodles", price: "₹35", color: "bg-red-400", icon: <UtensilsCrossed size={40} /> },
          ].map((item, i) => (
            <div key={i} className="group relative bg-white rounded-[2rem] p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-32 ${item.color} opacity-10 group-hover:opacity-20 transition-opacity rounded-t-[2rem]`}></div>

              <div className={`w-20 h-20 ${item.color} rounded-full flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                {item.icon}
              </div>

              <h3 className="font-black text-xl text-brand-dark mb-1 relative z-10">{item.name}</h3>
              <p className="text-gray-400 text-sm font-medium mb-4 relative z-10">{item.desc}</p>

              <div className="mt-auto flex items-center justify-between w-full relative z-10 bg-gray-50 rounded-xl p-2">
                <span className="font-black text-lg text-brand-dark px-2">{item.price}</span>
                <button className="w-10 h-10 bg-white text-brand-dark rounded-lg flex items-center justify-center shadow-sm hover:bg-brand-dark hover:text-white transition-colors">
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-dark rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-12">CAMPUS VIBES 💬</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "The Bun Maska here is literally a lifesaver during morning lectures!", author: "Priya, MBA" },
              { text: "Best place to chill after exams. The vibes are unmatched.", author: "Rahul, B.Tech" },
              { text: "Finally a place that doesn't burn a hole in my pocket. Love it!", author: "Sneha, Design" },
            ].map((review, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl text-left hover:bg-white/20 transition-colors">
                <div className="flex gap-1 text-brand-yellow mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-white/90 text-lg font-medium mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold">
                    {review.author[0]}
                  </div>
                  <span className="text-white font-bold">{review.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-blue rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-orange rounded-full blur-[100px]"></div>
        </div>
      </div>

      <div className="bg-brand-yellow rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-brand-dark mb-6 leading-tight">
            HUNGRY?<br />WE'VE GOT YOU.
          </h2>
          <p className="text-xl text-brand-dark/80 font-bold mb-10">
            Skip the line, order online, and enjoy the best chai on campus.
          </p>
          <Link href="/menu" className="inline-flex items-center gap-3 bg-brand-dark text-white px-10 py-5 rounded-full text-xl font-black hover:scale-105 hover:shadow-2xl transition-all">
            ORDER NOW <ArrowRight size={24} />
          </Link>
        </div>
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {activeDeal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setActiveDeal(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>

            {activeDeal === 'COMBO' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                  <Coffee size={40} />
                </div>
                <h3 className="text-3xl font-black text-brand-dark mb-2">PERFECT COMBO</h3>
                <p className="text-gray-500 font-medium mb-8">The ultimate evening snack.</p>

                <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium text-gray-600">Masala Chai</span>
                    <span className="font-bold text-gray-400 line-through">₹20</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium text-gray-600">Bun Maska</span>
                    <span className="font-bold text-gray-400 line-through">₹30</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between items-center text-xl font-black text-brand-dark">
                    <span>You Pay</span>
                    <span className="text-brand-orange">₹40</span>
                  </div>
                  <div className="text-xs font-bold text-green-600 bg-green-100 py-1 px-3 rounded-full w-fit mx-auto">
                    YOU SAVE ₹10
                  </div>
                </div>

                <Link href="/menu" className="block w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-brand-orange transition-colors shadow-lg">
                  Order Combo Now
                </Link>
              </div>
            )}

            {activeDeal === 'STUDENT' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-3xl font-black text-brand-dark mb-2">STUDENT DISCOUNT</h3>
                <p className="text-gray-500 font-medium mb-8">Exclusive for Rishihood Students.</p>

                <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs mt-0.5">1</div>
                    <p className="text-blue-900 font-medium">Visit the Chai Adda counter.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs mt-0.5">2</div>
                    <p className="text-blue-900 font-medium">Show your valid Rishihood ID card.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs mt-0.5">3</div>
                    <p className="text-blue-900 font-medium">Get flat <span className="font-black">10% OFF</span> on your order!</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveDeal(null)}
                  className="block w-full bg-brand-blue text-brand-dark py-4 rounded-xl font-bold hover:bg-blue-400 transition-colors shadow-lg"
                >
                  Got it!
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
