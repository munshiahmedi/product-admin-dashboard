export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <h1 className="text-3xl font-bold">
          Product Not Found
        </h1>

        <p className="mt-2 text-gray-600">
          The product you are looking for does not exist.
        </p>
      </div>
    </main>
  );
}