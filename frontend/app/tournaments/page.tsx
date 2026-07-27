'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, Calendar, Users, DollarSign, Gamepad2, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

interface Tournament {
  id: string
  title: string
  description: string
  game: string
  mode: string
  country: string
  entry_fee: number
  prize_pool: number
  max_teams: number
  current_teams: number
  start_date: string
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
  is_registered: boolean
  can_register: boolean
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers: HeadersInit = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments`, { headers })
      const data = await res.json()
      setTournaments(data.tournaments || [])
    } catch (error) {
      toast.error('Failed to load tournaments')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please login first')
        return
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        toast.success('Successfully joined tournament! 🎉')
        fetchTournaments()
      } else {
        const data = await res.json()
        toast.error(data.message || 'Failed to join')
      }
    } catch (error) {
      toast.error('Failed to join tournament')
    }
  }

  const getStatusBadge = (status: string) => {
    const labels: Record<string, string> = {
      UPCOMING: '📅 Upcoming',
      LIVE: '🔴 LIVE',
      COMPLETED: '✅ Completed',
      CANCELLED: '❌ Cancelled',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      UPCOMING: 'text-yellow-500 bg-yellow-500/10',
      LIVE: 'text-green-500 bg-green-500/10 animate-pulse',
      COMPLETED: 'text-blue-500 bg-blue-500/10',
      CANCELLED: 'text-red-500 bg-red-500/10',
    }
    return colors[status] || 'text-gray-400 bg-gray-500/10'
  }

  const filteredTournaments = filter === 'all' 
    ? tournaments 
    : tournaments.filter(t => t.status === filter.toUpperCase())

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4655]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold">Tournaments</h1>
            <p className="text-gray-400">Compete and win real prizes</p>
          </div>
          <div className="flex gap-2">
            {['all', 'upcoming', 'live', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg transition text-sm ${
                  filter === f 
                    ? 'bg-[#FF4655] text-white' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-400'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tournament List */}
        {filteredTournaments.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold mb-2">No Tournaments</h3>
            <p className="text-gray-400">Check back later for new tournaments</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <div key={tournament.id} className="glass-card p-6 hover:border-[#FF4655]/30 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                    {getStatusBadge(tournament.status)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {tournament.current_teams}/{tournament.max_teams} Teams
                  </span>
                </div>

                <h3 className="text-xl font-heading font-bold mb-2">{tournament.title}</h3>

                <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Gamepad2 className="w-4 h-4" />
                    {tournament.game}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {tournament.country || 'Global'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-gray-400">Prize Pool</p>
                    <p className="text-lg font-bold text-yellow-500">${tournament.prize_pool}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Entry Fee</p>
                    <p className="text-lg font-bold text-[#FF4655]">${tournament.entry_fee}</p>
                  </div>
                </div>

                <div className="mt-4">
                  {tournament.status === 'UPCOMING' && (
                    tournament.is_registered ? (
                      <button className="w-full py-2 bg-green-500/20 text-green-500 rounded-lg font-medium cursor-not-allowed">
                        ✓ Registered
                      </button>
                    ) : !tournament.can_register ? (
                      <button className="w-full py-2 bg-gray-500/20 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                        Registration Closed
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoin(tournament.id)}
                        className="w-full py-2 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-medium transition"
                      >
                        Join Tournament
                      </button>
                    )
                  )}
                  {tournament.status === 'LIVE' && (
                    <button className="w-full py-2 bg-green-500/20 text-green-500 rounded-lg font-medium cursor-not-allowed animate-pulse">
                      🔴 LIVE
                    </button>
                  )}
                  {tournament.status === 'COMPLETED' && (
                    <Link
                      href={`/tournaments/${tournament.id}`}
                      className="block w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition text-center"
                    >
                      View Results
                    </Link>
                  )}
                  {tournament.status === 'CANCELLED' && (
                    <button className="w-full py-2 bg-red-500/20 text-red-500 rounded-lg font-medium cursor-not-allowed">
                      Cancelled
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
