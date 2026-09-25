import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "../../../api/products";
import DeleteProductButton from "../../../components/DeleteProductButton";
import Navbar from "../../../components/Navbar";

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;

  try {
    const product = await getProductById(id);

    if (!product || !product.id) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        
        <div className="p-6">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/products"
              className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-all duration-200"
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
            </Link>

            <div className="rounded-2xl bg-white/10 backdrop-blur-lg p-8 shadow-2xl border border-white/20">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-96 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <span className="inline-block rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
                      {product.category}
                    </span>
                  </div>

                  <h1 className="text-4xl font-bold text-white">
                    {product.title}
                  </h1>

                  <p className="mt-4 text-slate-300 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-green-400">
                      ${product.price}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/5 p-4">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-2xl font-bold text-white">
                          {product.rating}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        Customer Rating
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-5 w-5 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        <span className="text-2xl font-bold text-white">
                          {product.stock}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        In Stock
                      </p>
                    </div>
                  </div>

                  {product.brand && (
                    <div className="mt-4 rounded-xl bg-white/5 p-4">
                      <p className="text-sm text-slate-400">
                        Brand
                      </p>
                      <p className="font-semibold text-white">
                        {product.brand}
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex flex-wrap gap-3">
                    <DeleteProductButton
                      productId={product.id}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="mb-6 text-2xl font-bold text-white">
                  Customer Reviews
                </h2>

                <div className="space-y-4">
                  {product.reviews?.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="rounded-xl bg-white/5 p-6 border border-white/10"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                              <span className="text-sm font-bold text-white">
                                {review.reviewerName?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {review.reviewerName}
                              </p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400'
                                        : 'text-slate-600'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                <span className="ml-2 text-sm text-slate-400">
                                  {review.rating}/5
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 text-slate-300 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl bg-white/5 p-8 text-center border border-white/10">
                      <svg
                        className="mx-auto h-12 w-12 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <p className="mt-4 text-slate-400">
                        No reviews available for this product.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    notFound();
  }
}