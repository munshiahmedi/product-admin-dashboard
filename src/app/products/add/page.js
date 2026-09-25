
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "../../../api/products";
import Navbar from "../../../components/Navbar";
import AuthGuard from "../../../components/AuthGuard";

function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");

    if (!form.title.trim()) {
      setError("Product title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    try {
      setSaving(true);

      await createProduct({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
      });

      router.replace("/products");
    } catch (error) {
      console.error(error);
      setError("Failed to create product.");
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="mb-6 flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-all duration-200"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Products
          </button>

          <div className="rounded-2xl bg-white/10 backdrop-blur-lg p-8 shadow-2xl border border-white/20">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">
                Add New Product
              </h1>
              <p className="mt-2 text-slate-400">
                Fill in the details to add a new product to your inventory
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Product Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border-0 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:bg-white/20 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  placeholder="Enter product title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-xl border-0 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:bg-white/20 focus:ring-2 focus:ring-purple-500 transition-all duration-200 resize-none"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Price ($)
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="text-slate-400">$</span>
                    </div>
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full rounded-xl border-0 bg-white/10 px-4 py-3 pl-8 text-white placeholder-slate-400 focus:bg-white/20 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Stock Quantity
                  </label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full rounded-xl border-0 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:bg-white/20 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Category
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border-0 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:bg-white/20 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  placeholder="Enter product category"
                />
              </div>

              {error && (
                <div className="flex items-center rounded-xl bg-red-500/20 border border-red-500/50 p-4">
                  <svg
                    className="h-5 w-5 text-red-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-300">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white font-semibold shadow-lg hover:shadow-purple-500/50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving Product...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Product
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AddProductPageWrapper() {
  return (
    <AuthGuard>
      <AddProductPage />
    </AuthGuard>
  );
}

