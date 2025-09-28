// src/app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">

      {/* Hero */}
      <section className="flex flex-col-reverse lg:flex-row items-center px-8 py-20 max-w-6xl mx-auto">
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Want to know secrets tips & tricks?<br/> <span className="text-blue-600">Tipstor Worm is here!</span>
          </h2>
          <Link
            href="/login"
            className="inline-block mt-8 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700"
          >
            Browse
          </Link>
        </div>
        <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
        </div>
      </section>

    </main>
  );
}
