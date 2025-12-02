"use client";

import dynamic from "next/dynamic";

const DashboardContent = dynamic(() => import("./DashboardContent"), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-dark font-bold">Loading Dashboard...</div>,
});

export default function VendorDashboardPage() {
  return <DashboardContent />;
}
