'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, Calendar, Users, DollarSign, Gamepad2 } from 'lucide-react'

interface Tournament {
  id: string
  title: string
  description: string
  entry_fee: number
  prize_pool: number
  max_teams: number
  current_teams: number
  start_date: string
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
  game: string
  mode: string
}

export default function MyTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (!res.ok) {
        throw new Error('Failed to fetch tournaments')
      }
      
      const data = await res.json()
      setTournaments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch tournaments:', error)
      setTournaments([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      UPCOMING: 'text-yellow-500 bg-yellow-500/10',
      LIVE: 'text-green-500 bg-green-500/10 animate-pulse',
      COMPLETED: 'text-blue-500 bg-blue-500/10',
      CANCELLED: 'text-red-500 bg-red-500/10',
    }
    return colors[status as keyof typeof colors] || 'text-gray-400 bg-gray-500/10'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4655]"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">My Tournaments</h1>
          <p className="text-gray-400">Track your tournament history</p>
        </div>
        <Link
          href="/tournaments"
          className="px-4 py-2 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-medium transition"
        >
          Browse All
        </Link>
      </div>

      {tournaments.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold mb-2">No Tournaments Yet</h3>
          <p className="text-gray-400 mb-4">Join your first tournament to start competing!</p>
          <Link
            href="/tournaments"
            className="px-6 py-2 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-medium transition inline-block"
          >
            Find Tournaments
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tournaments.map((tournament) => (
            <Link
              key={tournament.id}
              href={`/tournaments/${tournament.id}`}
              className="block glass-card p-6 hover:border-[#FF4655]/30 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-lg font-semibold">{tournament.title || 'Untitled'}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        tournament.status || 'UPCOMING'
                      )}`}
                    >
                      {tournament.status || 'UPCOMING'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Gamepad2 className="w-4 h-4" />
                      {tournament.game || 'PUBG'} • {tournament.mode || 'Squad'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'TBD'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {tournament.current_teams || 0}/{tournament.max_teams || 0} Teams
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${tournament.prize_pool || 0}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Entry Fee</p>
                  <p className="text-[#FF4655] font-bold">${tournament.entry_fee || 0}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
