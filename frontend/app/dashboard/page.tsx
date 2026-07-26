'use client'

import { useEffect, useState } from 'react'
import { Trophy, Users, Wallet, TrendingUp, Calendar, Award } from 'lucide-react'

interface DashboardStats {
  tournaments_played: number
  tournaments_won: number
  total_winnings: number
  team_name: string
  upcoming_tournaments: any[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4655]"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Welcome Back! 👋</h1>
        <p className="text-gray-400">Here's what's happening with your esports journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tournaments Played</p>
              <p className="text-2xl font-bold">{stats?.tournaments_played || 0}</p>
            </div>
            <div className="w-12 h-12 bg-[#FF4655]/10 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[#FF4655]" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tournaments Won</p>
              <p className="text-2xl font-bold">{stats?.tournaments_won || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Winnings</p>
              <p className="text-2xl font-bold text-green-500">
                ${stats?.total_winnings || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Team</p>
              <p className="text-lg font-bold truncate">
                {stats?.team_name || 'No Team'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tournaments */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold">Upcoming Tournaments</h2>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        {stats?.upcoming_tournaments?.length ? (
          <div className="space-y-3">
            {stats.upcoming_tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
              >
                <div>
                  <p className="font-medium">{tournament.title}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-500">
                    ${tournament.prize_pool}
                  </p>
                  <p className="text-xs text-gray-400">
                    {tournament.current_teams}/{tournament.max_teams} Teams
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-6">
            No upcoming tournaments. Check back later!
          </p>
        )}
      </div>
    </div>
  )
}
