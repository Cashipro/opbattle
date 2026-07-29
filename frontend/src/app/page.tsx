import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>

        {/* HERO */}

        <section className="relative overflow-hidden">

          <div className="container py-28 lg:py-40">

            <div className="max-w-3xl">

              <span className="badge">
                PUBG Mobile Esports Platform
              </span>

              <h1 className="mt-8 text-5xl lg:text-7xl font-black leading-tight">

                Join

                <span className="text-[#00FF84]">
                  {" "}Professional{" "}
                </span>

                PUBG

                <br />

                Tournaments

              </h1>

              <p className="mt-8 text-gray-400 text-lg leading-8">

                Play competitive PUBG tournaments, create your team,
                join rooms, qualify through multiple rounds and
                compete for exciting prize pools.

              </p>

              <div className="mt-10 flex flex-wrap gap-4">

                <Link href="/register">

                  <Button
                    title="Create Account"
                  />

                </Link>

                <Link href="/tournaments">

                  <button className="secondary-btn">

                    Browse Tournaments

                  </button>

                </Link>

              </div>

            </div>

          </div>

        </section>

        {/* STATS */}

        <section className="container py-20">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="game-card p-8">

              <h2 className="text-5xl font-black text-[#00FF84]">
                0
              </h2>

              <p className="mt-3 text-gray-400">
                Active Players
              </p>

            </div>

            <div className="game-card p-8">

              <h2 className="text-5xl font-black text-[#00CFFF]">
                0
              </h2>

              <p className="mt-3 text-gray-400">
                Live Tournaments
              </p>

            </div>

            <div className="game-card p-8">

              <h2 className="text-5xl font-black text-[#FFD700]">
                0
              </h2>

              <p className="mt-3 text-gray-400">
                Total Matches
              </p>

            </div>

            <div className="game-card p-8">

              <h2 className="text-5xl font-black text-[#FF4D4F]">
                0
              </h2>

              <p className="mt-3 text-gray-400">
                Prize Pools
              </p>

            </div>

          </div>

        </section>

        {/* FEATURES */}

        <section className="container py-20">

          <h2 className="text-4xl font-black mb-12">

            Why Choose

            <span className="text-[#00FF84]">

              {" "}OpBattle

            </span>

          </h2>

          <div className="grid lg:grid-cols-3 gap-8">

            <div className="game-card p-8">

              <h3 className="text-2xl font-bold">

                Fair Matches

              </h3>

              <p className="mt-4 text-gray-400 leading-7">

                Automatic tournament planning,
                balanced match distribution,
                and transparent qualification.

              </p>

            </div>

            <div className="game-card p-8">

              <h3 className="text-2xl font-bold">

                Team Management

              </h3>

              <p className="mt-4 text-gray-400 leading-7">

                Create your squad,
                manage teammates,
                edit team names,
                and join tournaments together.

              </p>

            </div>

            <div className="game-card p-8">

              <h3 className="text-2xl font-bold">

                Live Results

              </h3>

              <p className="mt-4 text-gray-400 leading-7">

                Every round,
                every kill,
                every qualification,
                and final rankings updated live.

              </p>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
