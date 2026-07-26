'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  Trophy,
  Calendar,
  Users,
  DollarSign,
  Gamepad2,
  MapPin,
  ArrowLeft,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface TournamentDetail {
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
  rules: string
  prize_distribution: string
  registered_teams: {
    id: string
    name: string
    members: number
  }[]
  matches: {
    id: string
    match_number: number
    status: string
    team1: string
    team2: string
    winner: string
  }[]
  is_registered: boolean
  can_register: boolean
  registration_deadline: string
}

export default function TournamentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [tournament, setTournament] = useState<TournamentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRules, setShowRules] = useState(false)
  const [showTeams, setShowTeams] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    fetchTournament()
  }, [params.id])

  const fetchTournament = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers: HeadersInit = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tournaments/${params.id}`,
        { headers }
      )
      if (!res.ok) throw new Error('Tournament not found')
      const data = await res.json()
      setTournament(data)
    } catch (error) {
      toast.error('Failed to load tournament')
      router.push('/tournaments')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login first')
      router.push('/login')
      return
    }

    setIsJoining(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tournaments/${params.id}/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()

      if (res.ok) {
        toast.success('Successfully joined tournament! 🎉')
        fetchTournament()
      } else {
        throw new Error(data.message || 'Failed to join')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsJoining(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      UPCOMING: 'text-yellow-500 bg-yellow-500/10',
      LIVE: 'text-green-500 bg-green-500/10 animate-pulse',
      COMPLETED: 'text-blue-500 bg-blue-500/10',
      CANCELLED: 'text-red-500 bg-red-500/10',
    }
    return colors[status] || 'text-gray-400 bg-gray-500/10'
  }

  const getStatusBadge = (status: string) => {
    const labels = {
      UPCOMING: 'Upcoming',
      LIVE: '🔴 LIVE',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4655]"></div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold mb-2">Tournament Not Found</h2>
          <Link
            href="/tournaments"
            className="text-[#FF4655] hover:underline flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tournaments
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Link
          href="/tournaments"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tournaments
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="glass-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        tournament.status
                      )}`}
                    >
                      {getStatusBadge(tournament.status)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {tournament.mode} • {tournament.game}
                    </span>
                  </div>
                  <h1 className="text-3xl font-heading font-bold mb-2">
                    {tournament.title}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {tournament.country || 'Global'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(tournament.start_date).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {tournament.current_teams}/{tournament.max_teams} Teams
                    </span>
                    {tournament.registration_deadline && (
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Clock className="w-4 h-4" />
                        Reg closes: {new Date(tournament.registration_deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {tournament.description && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-heading font-bold mb-2">About</h3>
                <p className="text-gray-400">{tournament.description}</p>
              </div>
            )}

            {/* Rules */}
            {tournament.rules && (
              <div className="glass-card p-6">
                <button
                  onClick={() => setShowRules(!showRules)}
                  className="flex items-center justify-between w-full"
                >
                  <h3 className="text-lg font-heading font-bold">Rules & Format</h3>
                  {showRules ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {showRules && (
                  <div className="mt-4 text-gray-400 whitespace-pre-wrap">
                    {tournament.rules}
                  </div>
                )}
              </div>
            )}

            {/* Prize Distribution */}
            {tournament.prize_distribution && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-heading font-bold mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Prize Distribution
                </h3>
                <div className="text-gray-400 whitespace-pre-wrap">
                  {tournament.prize_distribution}
                </div>
              </div>
            )}

            {/* Matches */}
            {tournament.matches && tournament.matches.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-heading font-bold mb-4">Matches</h3>
                <div className="space-y-3">
                  {tournament.matches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Match #{match.match_number}</p>
                        <p className="text-xs text-gray-400">
                          {match.team1} vs {match.team2}
                        </p>
                      </div>
                      <div className="text-right">
                        {match.winner ? (
                          <span className="text-green-500 text-sm font-medium">
                            Winner: {match.winner}
                          </span>
                        ) : (
                          <span className="text-yellow-500 text-sm">
                            {match.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Registered Teams */}
            {tournament.registered_teams && tournament.registered_teams.length > 0 && (
              <div className="glass-card p-6">
                <button
                  onClick={() => setShowTeams(!showTeams)}
                  className="flex items-center justify-between w-full"
                >
                  <h3 className="text-lg font-heading font-bold">
                    Registered Teams ({tournament.current_teams})
                  </h3>
                  {showTeams ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {showTeams && (
                  <div className="mt-4 space-y-2">
                    {tournament.registered_teams.map((team) => (
                      <div
                        key={team.id}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                      >
                        <span className="font-medium">{team.name}</span>
                        <span className="text-xs text-gray-400">
                          {team.members} players
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tournament Card */}
            <div className="glass-card p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400">Prize Pool</p>
                <p className="text-4xl font-bold text-yellow-500">
                  ${tournament.prize_pool}
                </p>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <span className="text-sm text-gray-400">Entry Fee</span>
                <span className="text-lg font-bold text-[#FF4655]">
                  ${tournament.entry_fee}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <span className="text-sm text-gray-400">Teams</span>
                <span>
                  {tournament.current_teams}/{tournament.max_teams}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <span className="text-sm text-gray-400">Mode</span>
                <span className="font-medium">{tournament.mode}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <span className="text-sm text-gray-400">Game</span>
                <span>{tournament.game}</span>
              </div>

              {/* Join Button */}
              <div className="mt-6">
                {tournament.status === 'UPCOMING' && tournament.can_register && (
                  <>
                    {tournament.is_registered ? (
                      <button
                        disabled
                        className="w-full py-3 bg-green-500/20 text-green-500 rounded-lg font-semibold cursor-not-allowed"
                      >
                        ✓ Registered
                      </button>
                    ) : (
                      <button
                        onClick={handleJoin}
                        disabled={isJoining || tournament.current_teams >= tournament.max_teams}
                        className="w-full py-3 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-semibold transition disabled:opacity-50"
                      >
                        {isJoining
                          ? 'Joining...'
                          : tournament.current_teams >= tournament.max_teams
                          ? 'FULL'
                          : 'Join Tournament'}
                      </button>
                    )}
                  </>
                )}

                {tournament.status === 'LIVE' && (
                  <button
                    disabled
                    className="w-full py-3 bg-green-500/20 text-green-500 rounded-lg font-semibold cursor-not-allowed animate-pulse"
                  >
                    🔴 LIVE
                  </button>
                )}

                {tournament.status === 'COMPLETED' && (
                  <button
                    disabled
                    className="w-full py-3 bg-white/5 text-gray-400 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Completed
                  </button>
                )}

                {tournament.status === 'CANCELLED' && (
                  <button
                    disabled
                    className="w-full py-3 bg-red-500/20 text-red-500 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Cancelled
                  </button>
                )}
              </div>

              {!localStorage.getItem('token') && (
                <p className="mt-3 text-center text-sm text-gray-400">
                  <Link href="/login" className="text-[#FF4655] hover:underline">
                    Login
                  </Link>{' '}
                  to join this tournament
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
