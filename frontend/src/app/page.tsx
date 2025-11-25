import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">Welcome to Chai Adda</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
        <Link href="/menu" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2">Browse Menu</h2>
          <p className="text-gray-600">Check out our delicious snacks and beverages.</p>
        </Link>

        <Link href="/login" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2">Login</h2>
          <p className="text-gray-600">Sign in to place orders and track status.</p>
        </Link>

        <Link href="/signup" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2">Sign Up</h2>
          <p className="text-gray-600">New here? Create an account with your college ID.</p>
        </Link>

        <Link href="/vendor/dashboard" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2">Vendor Dashboard</h2>
          <p className="text-gray-600">For staff only. Manage orders and payments.</p>
        </Link>
      </div>
    </div>
  );
}
