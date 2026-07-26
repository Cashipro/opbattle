'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  UserCheck,
  Trophy,
  DollarSign,
  Shield,
  Video,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface DashboardStats {
  stats: {
    totalUsers: number
    totalPlayers: number
    totalTeams: number
    totalTournaments: number
    totalMatches: number
    totalTransactions: number
    pendingWithdrawals: number
    pendingVerifications: number
    liveTournaments: number
  }
  recentTransactions: any[]
  recentUsers: any[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4655]"></div>
      </div>
    )
  }

  const { stats } = data || { stats: {} }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Total Players', value: stats?.totalPlayers || 0, icon: UserCheck, color: 'text-green-500' },
    { label: 'Tournaments', value: stats?.totalTournaments || 0, icon: Trophy, color: 'text-yellow-500' },
    { label: 'Live Now', value: stats?.liveTournaments || 0, icon: Clock, color: 'text-red-500' },
    { label: 'Pending Verifications', value: stats?.pendingVerifications || 0, icon: Shield, color: 'text-orange-500' },
    { label: 'Pending Withdrawals', value: stats?.pendingWithdrawals || 0, icon: DollarSign, color: 'text-purple-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <p className="text-gray-400">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="glass-card p-4 text-center">
              <div className={`${card.color} flex justify-center mb-2`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-gray-400">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-heading font-bold mb-4">Recent Users</h2>
          {data?.recentUsers?.length ? (
            <div className="space-y-3">
              {data.recentUsers.slice(0, 5).map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No recent users</p>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-heading font-bold mb-4">Recent Transactions</h2>
          {data?.recentTransactions?.length ? (
            <div className="space-y-3">
              {data.recentTransactions.slice(0, 5).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium">{tx.type}</p>
                    <p className="text-xs text-gray-400">{tx.description || 'No description'}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.type === 'DEPOSIT' ? 'text-green-500' : 'text-red-500'}`}>
                      ${Number(tx.amount).toFixed(2)}
                    </p>
                    <span className={`text-xs ${tx.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No recent transactions</p>
          )}
        </div>
      </div>
    </div>
  )
}
