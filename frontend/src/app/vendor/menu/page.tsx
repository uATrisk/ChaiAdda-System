"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPut, apiDelete } from "@/lib/api";
import { API_URL } from "@/lib/api";
import { Plus, Edit2, X, Coffee, Ban, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Item {
    id: string;
    name: string;
    price: number;
    available: boolean;
    category: string;
    image?: string;
    rating?: number;
}

const CATEGORIES = [
    "Tea & Coffee",
    "Chocolate & Bournvita",
    "Shakes & Juices",
    "Burgers",
    "Sandwiches",
    "Maggi",
    "Wraps",
    "Snacks",
    "Extras",
];

export default function VendorMenuPage() {
    const [items, setItems] = useState<Item[]>([]);
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "Tea & Coffee",
        image: null as File | null,
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Reset to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const fetchItems = () => {
        apiGet("/items").then(setItems);
    };

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

        fetchItems();
    }, []);



    const handleOpenModal = (item?: Item) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                price: item.price.toString(),
                category: item.category || "Tea & Coffee",
                image: null,
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: "",
                price: "",
                category: "Tea & Coffee",
                image: null,
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("price", formData.price);
            data.append("category", formData.category);
            if (formData.image) {
                data.append("image", formData.image);
            }

            const token = localStorage.getItem("token");
            const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

            let res;
            if (editingItem) {
                res = await fetch(`${API_URL}/items/${editingItem.id}`, {
                    method: "PUT",
                    headers,
                    body: data,
                });
            } else {
                res = await fetch(`${API_URL}/items`, {
                    method: "POST",
                    headers,
                    body: data,
                });
            }

            if (res.ok) {
                setIsModalOpen(false);
                fetchItems();
                alert(editingItem ? "Item updated!" : "Item added!");
            } else {
                alert("Failed to save item");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving item");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            await apiDelete(`/items/${id}`);
            setItems((prev) => prev.filter((item) => item.id !== id));
            alert("Item deleted successfully");
        } catch (error) {
            console.error("Failed to delete item", error);
            alert("Failed to delete item");
        }
    };

    const toggleAvailability = async (item: Item) => {
        try {
            const updatedItem = { ...item, available: !item.available };

            setItems((prev) =>
                prev.map((i) => (i.id === item.id ? updatedItem : i))
            );

            await apiPut(`/items/${item.id}`, {
                name: item.name,
                price: item.price,
                available: updatedItem.available,
            });
        } catch (error) {
            console.error("Failed to update item", error);
            setItems((prev) =>
                prev.map((i) => (i.id === item.id ? item : i))
            );
            alert("Failed to update item availability");
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg font-sans p-4 md:p-8">
            <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/vendor/dashboard" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand-orange hover:text-white transition-colors">
                        ←
                    </Link>
                    <h1 className="text-2xl font-black text-brand-dark tracking-tight">MANAGE MENU</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-orange w-64 transition-all"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold hover:bg-brand-orange transition-colors shadow-lg flex items-center gap-2"
                    >
                        <Plus size={20} /> Add Item
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden p-8">
                    <div className="space-y-4">
                        {currentItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-brand-dark ${item.available ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400 grayscale"
                                        }`}>
                                        {item.available ? <Coffee size={24} /> : <Ban size={24} />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-bold text-lg ${item.available ? "text-brand-dark" : "text-gray-400"}`}>
                                            {item.name}
                                        </h3>
                                        {item.rating !== undefined && item.rating > 0 && (
                                            <div className="flex items-center bg-yellow-100 px-2 py-0.5 rounded-full">
                                                <span className="text-yellow-600 text-xs font-bold mr-1">★</span>
                                                <span className="text-yellow-700 text-xs font-bold">{item.rating.toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">₹{item.price}</p>
                                </div>


                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(item)}
                                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors flex items-center gap-2"
                                    >
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => toggleAvailability(item)}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${item.available
                                            ? "bg-white border border-red-100 text-red-500 hover:bg-red-50"
                                            : "bg-green-500 text-white hover:bg-green-600 shadow-green-200"
                                            }`}
                                    >
                                        {item.available ? "Disable" : "Enable"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {items.length === 0 && (
                        <div className="p-12 text-center text-gray-400 font-medium">
                            Loading menu items...
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredItems.length > itemsPerPage && (
                        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-gray-500 font-medium">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-brand-dark text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-orange transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main >

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-fade-in relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-black text-brand-dark mb-6">
                            {editingItem ? "Edit Item" : "Add New Item"}
                        </h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-brand-dark transition-all"
                                />
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-brand-orange transition-colors shadow-lg"
                                >
                                    Save Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )
            }
        </div >
    );
}
