'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Home,
  User,
  Users,
  Trophy,
  Wallet,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Gamepad2,
} from 'lucide-react'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/team', label: 'My Team', icon: Users },
  { href: '/dashboard/tournaments', label: 'My Tournaments', icon: Trophy },
  { href: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    // Fetch user data
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => router.push('/login'))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4655]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/5 rounded-lg"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 bg-[#1a1a2e]/95 backdrop-blur-lg border-r border-white/10 p-4 transition-transform duration-300 z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <Gamepad2 className="w-8 h-8 text-[#FF4655]" />
          <span className="text-xl font-bold">Op<span className="text-[#FF4655]">Battle</span></span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition group"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-[#FF4655] transition" />
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-white/5 transition group"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-[#FF4655] transition" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">
              Logout
            </span>
          </button>
          <div className="px-4 py-2 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400">{user?.email || 'Guest'}</p>
            <p className="text-xs text-[#FF4655] capitalize">{user?.role || 'Player'}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  )
}
