"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  Swords,
  Users,
  Medal,
  UserCircle,
  LogOut,
  Shield,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Tournaments",
    href: "/admin/tournaments",
    icon: Trophy,
  },
  {
    title: "Matches",
    href: "/admin/matches",
    icon: Swords,
  },
  {
    title: "Teams",
    href: "/admin/teams",
    icon: Users,
  },
  {
    title: "Results",
    href: "/admin/results",
    icon: Medal,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: UserCircle,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; Max-Age=0; path=/";
    window.location.href = "/login";
  }

  return (
    <aside
      className="
      w-72
      min-h-screen
      bg-zinc-950
      border-r
      border-zinc-800
      flex
      flex-col
      "
    >
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div
            className="
            h-12
            w-12
            rounded-2xl
            bg-green-600
            flex
            items-center
            justify-center
            "
          >
            <Shield className="w-7 h-7 text-white" />
          </div>

          <div>
            <h1 className="text-white text-xl font-black">
              OPBattle
            </h1>

            <p className="text-zinc-400 text-sm">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2">
        {menus.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
              flex
              items-center
              gap-4
              rounded-2xl
              px-4
              py-4
              transition
              duration-200

              ${
                active
                  ? "bg-green-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }
              `}
            >
              <Icon className="w-6 h-6" />

              <span className="font-semibold">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>

      <div
        className="
        border-t
        border-zinc-800
        p-5
        "
      >
        <button
          onClick={logout}
          className="
          w-full
          flex
          items-center
          justify-center
          gap-3
          bg-red-600
          hover:bg-red-700
          rounded-2xl
          py-4
          font-bold
          transition
          "
        >
          <LogOut className="w-5 h-5" />

          Logout
        </button>
      </div>
          </aside>
  );
}
