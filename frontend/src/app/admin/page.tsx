"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Trophy,
  Users,
  Swords,
  Medal,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    tournaments: 0,
    teams: 0,
    matches: 0,
  });

  const [recent, setRecent] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const tournaments = await api.get("/tournaments");

      setRecent(tournaments.data || []);

      setStats({
        users: 0,
        tournaments: tournaments.data?.length || 0,
        teams: 0,
        matches: 0,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-black">
          Admin Dashboard
        </h1>

        <p className="text-zinc-400 mt-2">
          Welcome to OPBattle Administration Panel
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-zinc-400">
                Users
              </p>

              <h2 className="text-4xl font-black mt-2">
                {stats.users}
              </h2>

            </div>

            <Users className="w-12 h-12 text-green-500" />

          </div>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-zinc-400">
                Tournaments
              </p>

              <h2 className="text-4xl font-black mt-2">
                {stats.tournaments}
              </h2>

            </div>

            <Trophy className="w-12 h-12 text-yellow-500" />

          </div>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-zinc-400">
                Teams
              </p>

              <h2 className="text-4xl font-black mt-2">
                {stats.teams}
              </h2>

            </div>

            <Users className="w-12 h-12 text-blue-500" />

          </div>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-zinc-400">
                Live Matches
              </p>

              <h2 className="text-4xl font-black mt-2">
                {stats.matches}
              </h2>

            </div>

            <Swords className="w-12 h-12 text-red-500" />

          </div>

        </div>

      </div>

      <div className="grid xl:grid-cols-2 gap-8">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-black">
              Recent Tournaments
            </h2>

            <Link
              href="/admin/tournaments"
              className="text-green-400 flex items-center gap-2"
            >
              View All

              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>

          <div className="space-y-4">

            {recent.slice(0, 5).map((item: any) => (
              <div
                key={item.id}
                className="bg-zinc-800 rounded-2xl p-4 flex justify-between"
              >
                <div>

                  <h3 className="font-bold">
                    {item.name}
                  </h3>

                  <p className="text-zinc-400 text-sm">
                    {item.status}
                  </p>

                </div>

                <div className="text-green-400 font-bold">
                  {item.entry_fee}
                </div>

              </div>
            ))}
                        ))}

          </div>

        </div>



        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <h2 className="text-2xl font-black mb-6">
            Quick Actions
          </h2>


          <div className="grid gap-4">


            <Link
              href="/admin/tournaments"
              className="
              bg-green-600
              hover:bg-green-700
              rounded-2xl
              p-5
              font-bold
              flex
              justify-between
              items-center
              "
            >

              Manage Tournaments

              <ArrowRight />

            </Link>



            <Link
              href="/admin/matches"
              className="
              bg-blue-600
              hover:bg-blue-700
              rounded-2xl
              p-5
              font-bold
              flex
              justify-between
              items-center
              "
            >

              Manage Matches

              <ArrowRight />

            </Link>



            <Link
              href="/admin/results"
              className="
              bg-yellow-600
              hover:bg-yellow-700
              rounded-2xl
              p-5
              font-bold
              flex
              justify-between
              items-center
              "
            >

              Match Results

              <ArrowRight />

            </Link>


          </div>


        </div>


      </div>



      <div
        className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-3xl
        p-6
        flex
        items-center
        gap-4
        "
      >

        <Medal className="w-10 h-10 text-green-500" />


        <div>

          <h3 className="font-black text-xl">
            OPBattle Admin
          </h3>

          <p className="text-zinc-400">
            Manage tournaments, teams and competitive matches.
          </p>

        </div>


      </div>


    </div>
  );
}
