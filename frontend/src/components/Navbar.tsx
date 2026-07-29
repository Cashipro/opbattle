"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-[#222] bg-[#050505]/90 backdrop-blur sticky top-0 z-50">
      <div className="container h-20 flex items-center justify-between">

        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#00FF84] flex items-center justify-center text-black font-black text-xl">
            O
          </div>

          <div>
            <h1 className="text-white font-extrabold text-xl">
              OpBattle
            </h1>

            <p className="text-xs text-gray-400">
              PUBG Tournament Platform
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">

          <Link href="/" className="hover:text-[#00FF84]">
            Home
          </Link>

          <Link href="/tournaments" className="hover:text-[#00FF84]">
            Tournaments
          </Link>

          <Link href="/results" className="hover:text-[#00FF84]">
            Results
          </Link>

          <Link href="/login" className="primary-btn">
            Login
          </Link>

        </nav>

      </div>
    </header>
  );
}
