'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Trophy,
  Sword,
  Wallet,
  Video,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  UserCheck,
  DollarSign,
} from 'lucide-react'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/players', label: 'Players', icon: UserCheck },
  { href: '/admin/players/verify', label: 'Verifications', icon: Shield },
  { href: '/admin/tournaments', label: 'Tournaments', icon: Trophy },
  { href: '/admin/matches', label: 'Matches', icon: Sword },
  { href: '/admin/wallet', label: 'Wallet', icon: Wallet },
  { href: '/admin/wallet/withdrawals', label: 'Withdrawals', icon: DollarSign },
  { href: '/admin/livestreams', label: 'Live Streams', icon: Video },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.role !== 'admin' && data.role !== 'super_admin') {
          toast.error('Admin access required')
          router.push('/dashboard')
          return
        }
        setUser(data)
      })
      .catch(() => {
        router.push('/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4655]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Mobile Toggle */}
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
        <div className="flex items-center gap-2 mb-8 px-2">
          <Shield className="w-8 h-8 text-[#FF4655]" />
          <span className="text-xl font-bold">Op<span className="text-[#FF4655]">Admin</span></span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition group ${
                  isActive
                    ? 'bg-[#FF4655]/10 text-[#FF4655]'
                    : 'hover:bg-white/5 text-gray-300 hover:text-white'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF4655]' : 'text-gray-400 group-hover:text-white'}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-white/5 transition group"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-[#FF4655]" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-white">Logout</span>
          </button>
          <div className="px-4 py-2 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400">{user?.email || 'Admin'}</p>
            <p className="text-xs text-[#FF4655] capitalize">{user?.role || 'Admin'}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  )
}
