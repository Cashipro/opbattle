"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {

  return (
    <>
      <Navbar />

      <main className="min-h-screen flex items-center justify-center py-20">

        <div className="w-full max-w-md game-card p-8">

          <div className="text-center mb-8">

            <div className="w-20 h-20 rounded-3xl bg-[#00FF84] flex items-center justify-center text-black font-black text-3xl mx-auto">
              O
            </div>

            <h1 className="text-3xl font-black mt-6">
              Welcome Back
            </h1>

            <p className="text-gray-400 mt-2">
              Login to your OpBattle account
            </p>

          </div>

          <form className="space-y-5">

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
            />

            <Button
              title="Login"
              className="w-full"
            />

          </form>

          <div className="text-center mt-8">

            <p className="text-gray-400">

              Don't have an account?

            </p>

            <Link
              href="/register"
              className="text-[#00FF84] font-bold mt-2 inline-block"
            >
              Create Account
            </Link>

          </div>

        </div>

      </main>

      <Footer />

    </>
  );
}
