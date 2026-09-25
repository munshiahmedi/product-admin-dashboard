"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
} from "../../api/products";

import AuthGuard from "../../components/AuthGuard";
import Navbar from "../../components/Navbar";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawPage = searchParams.get("page");
  const rawLimit = searchParams.get("limit");

  const parsedPage = Number(rawPage);
  const parsedLimit = Number(rawLimit);

  const urlPage =
    Number.isInteger(parsedPage) && parsedPage >= 1
      ? parsedPage
      : 1;

  const urlLimit = [10, 20, 50].includes(parsedLimit)
    ? parsedLimit
    : 10;

  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlSortBy = searchParams.get("sortBy") || "";

  const urlSortOrder =
    searchParams.get("sortOrder") === "desc"
      ? "desc"
      : "asc";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(urlPage);
  const [limit, setLimit] = useState(urlLimit);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState(urlSearch);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(urlCategory);

  const [sortBy, setSortBy] = useState(urlSortBy);
  const [sortOrder, setSortOrder] = useState(urlSortOrder);

  const latestRequest = useRef(0);
  const isInitialSearchRender = useRef(true);

  const totalPages = Math.ceil(total / limit);

  const updateUrl = (
    newPage,
    newLimit,
    newSearch = search,
    newCategory = category,
    newSortBy = sortBy,
    newSortOrder = sortOrder
  ) => {
    const params = new URLSearchParams();

    params.set("page", newPage);
    params.set("limit", newLimit);

    if (newSearch.trim()) {
      params.set("search", newSearch.trim());
    }

    if (newCategory) {
      params.set("category", newCategory);
    }

    if (newSortBy) {
      params.set("sortBy", newSortBy);
      params.set("sortOrder", newSortOrder);
    }

    router.replace(`/products?${params.toString()}`);
  };

  useEffect(() => {
    setPage(urlPage);
    setLimit(urlLimit);
    setSearch(urlSearch);
    setCategory(urlCategory);
    setSortBy(urlSortBy);
    setSortOrder(urlSortOrder);
  }, [
    urlPage,
    urlLimit,
    urlSearch,
    urlCategory,
    urlSortBy,
    urlSortOrder,
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      }
    };

    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const requestId = ++latestRequest.current;

    try {
      setLoading(true);
      setError("");

      const skip = (page - 1) * limit;

      let data;

      if (search.trim()) {
        data = await searchProducts({
          query: search,
          limit,
          skip,
          sortBy,
          sortOrder,
        });
      } else if (category) {
        data = await getProductsByCategory({
          category,
          limit,
          skip,
          sortBy,
          sortOrder,
        });
      } else {
        data = await getProducts({
          limit,
          skip,
          sortBy,
          sortOrder,
        });
      }

      if (requestId !== latestRequest.current) {
        return;
      }

      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error(
        "Failed to load products:",
        error
      );

      if (requestId !== latestRequest.current) {
        return;
      }

      setError(
        "Failed to load products. Please try again."
      );
    } finally {
      if (requestId === latestRequest.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(
      () => {
        fetchProducts();
      },
      search.trim() ? 500 : 0
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    search,
    category,
    page,
    limit,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    if (isInitialSearchRender.current) {
      isInitialSearchRender.current = false;
      return;
    }

    setPage(1);

    const timer = setTimeout(() => {
      updateUrl(
        1,
        limit,
        search,
        category,
        sortBy,
        sortOrder
      );
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    if (
      totalPages > 0 &&
      page > totalPages
    ) {
      setPage(1);

      updateUrl(
        1,
        limit,
        search,
        category,
        sortBy,
        sortOrder
      );
    }
  }, [totalPages, page]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <div className="p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Product Dashboard
            </h1>
            <p className="mt-1 text-slate-400">
              Manage your product inventory
            </p>
          </div>

          <Link
            href="/products/add"
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm text-white font-medium shadow-lg hover:shadow-purple-500/50 transition-all duration-200 transform hover:scale-105 active:scale-95"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Product
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                className="h-5 w-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Search products..."
              className="w-full rounded-xl border-0 bg-white/10 px-12 py-3 text-white placeholder-slate-400 focus:bg-white/20 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            />
          </div>

          <select
              value={category}
              onChange={(event) => {
                const newCategory =
                  event.target.value;

                setCategory(newCategory);
                setPage(1);

                updateUrl(
                  1,
                  limit,
                  search,
                  newCategory,
                  sortBy,
                  sortOrder
                );
              }}
              className="rounded-xl border-0 bg-white/10 px-4 py-3 text-white focus:bg-white/20 focus:ring-2 focus:ring-purple-500 transition-all duration-200 [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="">
                All Categories
              </option>

              {categories.map((item) => (
                <option
                  key={item.slug}
                  value={item.slug}
                >
                  {item.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) => {
                const newSortBy =
                  event.target.value;

                setSortBy(newSortBy);
                setPage(1);

                updateUrl(
                  1,
                  limit,
                  search,
                  category,
                  newSortBy,
                  sortOrder
                );
              }}
              className="rounded-xl border-0 bg-white/10 px-4 py-3 text-white focus:bg-white/20 focus:ring-2 focus:ring-purple-500 transition-all duration-200 [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="">
                Sort By
              </option>

              <option value="price">
                Price
              </option>

              <option value="rating">
                Rating
              </option>

              <option value="title">
                Title
              </option>
            </select>

            <select
              value={sortOrder}
              onChange={(event) => {
                const newSortOrder =
                  event.target.value;

                setSortOrder(newSortOrder);
                setPage(1);

                updateUrl(
                  1,
                  limit,
                  search,
                  category,
                  sortBy,
                  newSortOrder
                );
              }}
              disabled={!sortBy}
              className="rounded-xl border-0 bg-white/10 px-4 py-3 text-white focus:bg-white/20 focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="asc">
                Ascending
              </option>

              <option value="desc">
                Descending
              </option>
            </select>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white/10 backdrop-blur-lg p-12 text-center border border-white/20">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
              <svg
                className="animate-spin h-8 w-8 text-purple-500"
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
            </div>
            <p className="text-slate-300">
              Loading products...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-red-500/20 backdrop-blur-lg p-12 text-center border border-red-500/50">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
              <svg
                className="h-8 w-8 text-red-400"
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
            </div>
            <p className="text-red-300">
              {error}
            </p>

            <button
              onClick={fetchProducts}
              className="mt-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-white font-medium shadow-lg hover:shadow-purple-500/50 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="rounded-2xl bg-white/10 backdrop-blur-lg p-12 text-center border border-white/20">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <svg
                  className="h-10 w-10 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">
                No products found
              </h2>

              <p className="mt-2 text-slate-400">
                Try changing your search or filters.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          products.length > 0 && (
            <>
              <div className="hidden overflow-x-auto rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20 md:block">
                <table className="w-full text-left">
                  <thead className="border-b border-white/10 bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                        Product
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                        Category
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                        Price
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                        Rating
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                        Stock
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="h-14 w-14 rounded-xl object-cover shadow-lg"
                            />

                            <span className="font-medium text-white">
                              {product.title}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {product.category}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-green-500/20 px-3 py-1 text-green-400 font-semibold">
                            ${product.price}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          <div className="flex items-center gap-1">
                            <svg
                              className="h-4 w-4 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {product.rating}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {product.stock}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/products/${product.id}`}
                              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-200 transform hover:scale-105 active:scale-95"
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </Link>
                            <Link
                              href={`/products/${product.id}/edit`}
                              className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-105 active:scale-95"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 md:hidden">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl bg-white/10 backdrop-blur-lg p-6 border border-white/20 shadow-xl"
                  >
                    <div className="flex gap-4">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-24 w-24 rounded-xl object-cover shadow-lg"
                      />

                      <div className="flex-1">
                        <h2 className="font-semibold text-white">
                          {product.title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                          {product.category}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-white/5 p-3">
                        <p className="text-slate-400">
                          Price
                        </p>
                        <p className="font-semibold text-green-400">
                          ${product.price}
                        </p>
                      </div>

                      <div className="rounded-lg bg-white/5 p-3">
                        <p className="text-slate-400">
                          Rating
                        </p>
                        <p className="font-semibold text-white">
                          {product.rating}
                        </p>
                      </div>

                      <div className="rounded-lg bg-white/5 p-3">
                        <p className="text-slate-400">
                          Stock
                        </p>
                        <p className="font-semibold text-white">
                          {product.stock}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Link
                        href={`/products/${product.id}`}
                        className="flex-1 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-3 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="flex-1 flex items-center justify-center rounded-lg border border-white/20 bg-white/10 p-3 text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-xl bg-white/5 backdrop-blur-lg p-4 border border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-400">
                  {total === 0
                    ? 0
                    : (page - 1) * limit + 1}
                  –
                  {Math.min(
                    page * limit,
                    total
                  )}{" "}
                  of {total}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={limit}
                    onChange={(event) => {
                      const newLimit =
                        Number(
                          event.target.value
                        );

                      setLimit(newLimit);
                      setPage(1);

                      updateUrl(
                        1,
                        newLimit,
                        search,
                        category,
                        sortBy,
                        sortOrder
                      );
                    }}
                    className="rounded-lg border-0 bg-white/10 px-2 py-1 text-xs text-white focus:bg-white/20 focus:ring-2 focus:ring-purple-500 transition-all duration-200 [&>option]:bg-slate-800 [&>option]:text-white"
                  >
                    <option value={10}>
                      10
                    </option>

                    <option value={20}>
                      20
                    </option>

                    <option value={50}>
                      50
                    </option>
                  </select>

                  <button
                    onClick={() => {
                      const newPage = page - 1;

                      if (newPage < 1) {
                        return;
                      }

                      setPage(newPage);

                      updateUrl(
                        newPage,
                        limit,
                        search,
                        category,
                        sortBy,
                        sortOrder
                      );
                    }}
                    disabled={page === 1}
                    className="rounded-lg border-0 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20 focus:bg-white/20 focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ←
                  </button>

                  {Array.from(
                    {
                      length: Math.min(totalPages, 5),
                    },
                    (_, index) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = index + 1;
                      } else if (page <= 3) {
                        pageNumber = index + 1;
                      } else if (page >= totalPages - 2) {
                        pageNumber = totalPages - 4 + index;
                      } else {
                        pageNumber = page - 2 + index;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => {
                            setPage(pageNumber);

                            updateUrl(
                              pageNumber,
                              limit,
                              search,
                              category,
                              sortBy,
                              sortOrder
                            );
                          }}
                          className={`rounded-lg border-0 px-3 py-1 text-xs transition-all duration-200 ${
                            page === pageNumber
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                              : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}

                  {totalPages > 5 && (
                    <span className="text-xs text-slate-400">
                      ...
                    </span>
                  )}

                  <button
                    onClick={() => {
                      const newPage = page + 1;

                      if (
                        totalPages === 0 ||
                        newPage > totalPages
                      ) {
                        return;
                      }

                      setPage(newPage);

                      updateUrl(
                        newPage,
                        limit,
                        search,
                        category,
                        sortBy,
                        sortOrder
                      );
                    }}
                    disabled={
                      totalPages === 0 ||
                      page === totalPages
                    }
                    className="rounded-lg border-0 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20 focus:bg-white/20 focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          )}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <svg
                className="animate-spin h-10 w-10 text-purple-500"
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
            </div>
            <p className="text-lg text-slate-300">
              Loading products...
            </p>
          </div>
        </main>
      }
    >
      <AuthGuard>
        <ProductsPageContent />
      </AuthGuard>
    </Suspense>
  );
}