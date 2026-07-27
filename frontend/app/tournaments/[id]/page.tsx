'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
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
  User,
  AlertCircle,
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
  registration_deadline: string
  status: string
  rules: string | null
  prize_distribution: string | null
  registered_teams: any[]
  is_registered: boolean
  can_register: boolean
  join_message: string
}

export default function TournamentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [tournament, setTournament] = useState<TournamentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTeams, setShowTeams] = useState(true)
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    fetchTournament()
  }, [params.id])

  const fetchTournament = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers: HeadersInit = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

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
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login first')
      router.push('/login')
      return
    }

    setIsJoining(true)
    try {
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
        toast.success(data.message || 'Successfully joined! 🎉')
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
    const colors: Record<string, string> = {
      UPCOMING: 'text-yellow-500 bg-yellow-500/10',
      LIVE: 'text-green-500 bg-green-500/10 animate-pulse',
      COMPLETED: 'text-blue-500 bg-blue-500/10',
      CANCELLED: 'text-red-500 bg-red-500/10',
    }
    return colors[status] || 'text-gray-400 bg-gray-500/10'
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

  const getModeBadge = (mode: string) => {
    const colors: Record<string, string> = {
      SOLO: 'bg-blue-500/20 text-blue-500',
      DUO: 'bg-green-500/20 text-green-500',
      SQUAD: 'bg-purple-500/20 text-purple-500',
    }
    return colors[mode] || 'bg-gray-500/20 text-gray-400'
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
          <Link href="/tournaments" className="text-[#FF4655] hover:underline">
            Back to Tournaments
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/tournaments" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Tournaments
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                  {getStatusBadge(tournament.status)}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getModeBadge(tournament.mode)}`}>
                  {tournament.mode}
                </span>
                <span className="text-xs text-gray-400">{tournament.game}</span>
              </div>
              <h1 className="text-3xl font-heading font-bold mb-3">{tournament.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{tournament.country || 'Global'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(tournament.start_date).toLocaleString()}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{tournament.current_teams}/{tournament.max_teams} Teams</span>
                {tournament.registration_deadline && (
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Clock className="w-4 h-4" />
                    Reg closes: {new Date(tournament.registration_deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {tournament.description && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-heading font-bold mb-2">About</h3>
                <p className="text-gray-400">{tournament.description}</p>
              </div>
            )}

            {/* Teams / Participants */}
            <div className="glass-card p-6">
              <button onClick={() => setShowTeams(!showTeams)} className="flex items-center justify-between w-full">
                <div>
                  <h3 className="text-lg font-heading font-bold">
                    {tournament.mode === 'SOLO' ? 'Registered Players' : 'Registered Teams'} 
                    ({tournament.current_teams}/{tournament.max_teams})
                  </h3>
                </div>
                {showTeams ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {showTeams && (
                <div className="mt-4 space-y-3">
                  {tournament.registered_teams.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No participants yet</p>
                  ) : (
                    tournament.registered_teams.map((team, index) => (
                      <div key={team.id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400">#{index + 1}</span>
                            <div>
                              <p className="font-semibold">
                                {tournament.mode === 'SOLO' ? team.name || 'Solo Player' : team.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {tournament.mode === 'SOLO' ? 'Player' : `${team.members || 0} players`}
                              </p>
                            </div>
                          </div>
                          {team.position && (
                            <span className="text-sm text-yellow-500">#{team.position}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {tournament.rules && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-heading font-bold mb-2">Rules</h3>
                <div className="text-gray-400 whitespace-pre-wrap">{tournament.rules}</div>
              </div>
            )}

            {tournament.prize_distribution && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-heading font-bold mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Prize Distribution
                </h3>
                <div className="text-gray-400 whitespace-pre-wrap">{tournament.prize_distribution}</div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400">Prize Pool</p>
                <p className="text-4xl font-bold text-yellow-500">${tournament.prize_pool}</p>
                <p className="text-xs text-gray-500 mt-1">{tournament.mode} Mode</p>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <span className="text-sm text-gray-400">Entry Fee</span>
                <span className="text-lg font-bold text-[#FF4655]">${tournament.entry_fee}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <span className="text-sm text-gray-400">Teams</span>
                <span>{tournament.current_teams}/{tournament.max_teams}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <span className="text-sm text-gray-400">Mode</span>
                <span className="font-medium">{tournament.mode}</span>
              </div>

              {tournament.join_message && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{tournament.join_message}</span>
                  </div>
                </div>
              )}

              <div className="mt-6">
                {tournament.status === 'UPCOMING' && (
                  tournament.is_registered ? (
                    <button className="w-full py-3 bg-green-500/20 text-green-500 rounded-lg font-semibold cursor-not-allowed">
                      ✓ Registered
                    </button>
                  ) : !tournament.can_register ? (
                    <button className="w-full py-3 bg-gray-500/20 text-gray-400 rounded-lg font-semibold cursor-not-allowed">
                      {tournament.join_message || 'Cannot Join'}
                    </button>
                  ) : (
                    <button
                      onClick={handleJoin}
                      disabled={isJoining}
                      className="w-full py-3 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                      {isJoining ? 'Joining...' : 'Join Tournament'}
                    </button>
                  )
                )}
                {tournament.status === 'LIVE' && (
                  <button className="w-full py-3 bg-green-500/20 text-green-500 rounded-lg font-semibold cursor-not-allowed animate-pulse">
                    🔴 LIVE
                  </button>
                )}
                {tournament.status === 'COMPLETED' && (
                  <button className="w-full py-3 bg-white/5 text-gray-400 rounded-lg font-semibold cursor-not-allowed">
                    Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
