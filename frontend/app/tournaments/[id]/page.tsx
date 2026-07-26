'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'  // ✅ IMPORT ADD KARO
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
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface TeamMember {
  id: string
  player_id: string
  player_name: string
  pubg_uid: string
  avatar_url: string | null
  is_captain: boolean
  joined_at: string
}

interface Team {
  id: string
  name: string
  logo_url: string | null
  members: TeamMember[]
  status: string
  position: number | null
  prize_won: number
}

interface Match {
  id: string
  match_number: number
  room_id: string | null
  room_password: string | null
  map_name: string | null
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
  started_at: string | null
  completed_at: string | null
  results: {
    team_id: string
    team_name: string
    position: number
    kills: number
    points: number
    prize_amount: number
    is_winner: boolean
  }[]
}

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
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
  rules: string | null
  prize_distribution: string | null
  registered_teams: Team[]
  matches: Match[]
  is_registered: boolean
  can_register: boolean
  is_full: boolean
}

export default function TournamentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [tournament, setTournament] = useState<TournamentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTeams, setShowTeams] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [showMatches, setShowMatches] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchTournament()
  }, [params.id])

  useEffect(() => {
    if (tournament?.status === 'LIVE') {
      const interval = setInterval(() => {
        fetchTournament(true)
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [tournament?.status])

  const fetchTournament = async (silent = false) => {
    if (!silent) setLoading(true)
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
      if (!silent) {
        toast.error('Failed to load tournament')
        router.push('/tournaments')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchTournament(false)
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
    const colors: Record<string, string> = {
      UPCOMING: 'text-yellow-500 bg-yellow-500/10',
      LIVE: 'text-green-500 bg-green-500/10 animate-pulse',
      COMPLETED: 'text-blue-500 bg-blue-500/10',
      CANCELLED: 'text-red-500 bg-red-500/10',
      SCHEDULED: 'text-gray-400 bg-gray-500/10',
    }
    return colors[status as keyof typeof colors] || 'text-gray-400 bg-gray-500/10'
  }

  const getStatusBadge = (status: string) => {
    const labels: Record<string, string> = {
      UPCOMING: '📅 Upcoming',
      LIVE: '🔴 LIVE',
      COMPLETED: '✅ Completed',
      CANCELLED: '❌ Cancelled',
      SCHEDULED: '⏳ Scheduled',
    }
    return labels[status as keyof typeof labels] || status
  }

  const getMatchStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      SCHEDULED: 'bg-gray-500/20 text-gray-400',
      LIVE: 'bg-green-500/20 text-green-500 animate-pulse',
      COMPLETED: 'bg-blue-500/20 text-blue-500',
      CANCELLED: 'bg-red-500/20 text-red-500',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
  }

  const getRegistrationStatus = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-500/20 text-yellow-500',
      APPROVED: 'bg-green-500/20 text-green-500',
      REJECTED: 'bg-red-500/20 text-red-500',
      CANCELLED: 'bg-gray-500/20 text-gray-400',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'
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
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Link
          href="/tournaments"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tournaments
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
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
                    <button
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="ml-2 p-1 hover:bg-white/10 rounded-lg transition"
                    >
                      <RefreshCw className={`w-4 h-4 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
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

            {tournament.description && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-heading font-bold mb-2">About</h3>
                <p className="text-gray-400">{tournament.description}</p>
              </div>
            )}

            <div className="glass-card p-6">
              <button
                onClick={() => setShowTeams(!showTeams)}
                className="flex items-center justify-between w-full"
              >
                <div>
                  <h3 className="text-lg font-heading font-bold">
                    Registered Teams ({tournament.current_teams}/{tournament.max_teams})
                  </h3>
                  <p className="text-xs text-gray-400">
                    {tournament.status === 'UPCOMING' ? 'Teams waiting to battle' : 
                     tournament.status === 'LIVE' ? '⚔️ Battle in progress' : 
                     '🏆 Tournament finished'}
                  </p>
                </div>
                {showTeams ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {showTeams && (
                <div className="mt-4 space-y-4">
                  {tournament.registered_teams.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No teams registered yet</p>
                  ) : (
                    tournament.registered_teams.map((team) => (
                      <div key={team.id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FF4655]/20 flex items-center justify-center">
                              {team.logo_url ? (
                                <img src={team.logo_url} alt={team.name} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <span className="text-[#FF4655] font-bold text-sm">
                                  {team.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold">{team.name}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getRegistrationStatus(team.status)}`}>
                                {team.status}
                              </span>
                              {team.position && (
                                <span className="ml-2 text-xs text-yellow-500">
                                  #{team.position} • ${team.prize_won}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            {team.members?.length || 0}/4 players
                          </span>
                        </div>

                        {team.members && team.members.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {team.members.map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-xs"
                              >
                                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                  {member.avatar_url ? (
                                    <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <User className="w-3 h-3 text-gray-400" />
                                  )}
                                </div>
                                <span>{member.player_name}</span>
                                {member.is_captain && (
                                  <span className="text-yellow-500 text-[10px]">👑</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {tournament.matches && tournament.matches.length > 0 && (
              <div className="glass-card p-6">
                <button
                  onClick={() => setShowMatches(!showMatches)}
                  className="flex items-center justify-between w-full"
                >
                  <div>
                    <h3 className="text-lg font-heading font-bold">
                      Matches ({tournament.matches.length})
                    </h3>
                    <p className="text-xs text-gray-400">
                      {tournament.status === 'LIVE' ? '🔴 Live matches in progress' : 
                       tournament.status === 'COMPLETED' ? '✅ All matches completed' : 
                       '📅 Scheduled matches'}
                    </p>
                  </div>
                  {showMatches ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {showMatches && (
                  <div className="mt-4 space-y-4">
                    {tournament.matches.map((match) => (
                      <div key={match.id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Match #{match.match_number}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getMatchStatusBadge(match.status)}`}>
                              {match.status}
                            </span>
                            {match.map_name && (
                              <span className="ml-2 text-xs text-gray-400">📍 {match.map_name}</span>
                            )}
                          </div>
                          <div className="text-right">
                            {match.room_id && (
                              <p className="text-xs text-gray-400">
                                Room: {match.room_id}
                                {match.room_password && ` | Pass: ${match.room_password}`}
                              </p>
                            )}
                            {match.started_at && (
                              <p className="text-xs text-gray-500">
                                Started: {new Date(match.started_at).toLocaleTimeString()}
                              </p>
                            )}
                          </div>
                        </div>

                        {match.results && match.results.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {match.results
                              .sort((a, b) => a.position - b.position)
                              .map((result) => (
                                <div
                                  key={result.team_id}
                                  className={`flex items-center justify-between px-3 py-1 rounded-lg text-sm ${
                                    result.is_winner ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/5'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-400">#{result.position}</span>
                                    <span>{result.team_name}</span>
                                    {result.is_winner && (
                                      <span className="text-yellow-500 text-xs">🏆 WINNER</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span>💀 {result.kills} kills</span>
                                    <span>⭐ {result.points} pts</span>
                                    {result.prize_amount > 0 && (
                                      <span className="text-green-500 font-semibold">
                                        +${result.prize_amount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400">Prize Pool</p>
                <p className="text-4xl font-bold text-yellow-500">
                  ${tournament.prize_pool}
                </p>
                {tournament.prize_distribution && (
                  <p className="text-xs text-gray-500 mt-1">Distribution: {tournament.prize_distribution}</p>
                )}
              </div>

              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <span className="text-sm text-gray-400">Entry Fee</span>
                <span className="text-lg font-bold text-[#FF4655]">
                  ${tournament.entry_fee}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <span className="text-sm text-gray-400">Teams</span>
                <span className="flex items-center gap-2">
                  <span className="font-medium">{tournament.current_teams}</span>
                  <span className="text-gray-400">/ {tournament.max_teams}</span>
                  {tournament.is_full && (
                    <span className="text-xs text-red-500 bg-red-500/20 px-2 py-0.5 rounded-full">FULL</span>
                  )}
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

              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <span className="text-sm text-gray-400">Status</span>
                <span className={`text-sm font-medium ${tournament.status === 'LIVE' ? 'text-green-500' : tournament.status === 'COMPLETED' ? 'text-blue-500' : tournament.status === 'CANCELLED' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {tournament.status}
                </span>
              </div>

              <div className="mt-6">
                {tournament.status === 'UPCOMING' && tournament.can_register && (
                  <>
                    {tournament.is_registered ? (
                      <button
                        disabled
                        className="w-full py-3 bg-green-500/20 text-green-500 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Registered
                      </button>
                    ) : tournament.is_full ? (
                      <button
                        disabled
                        className="w-full py-3 bg-red-500/20 text-red-500 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Tournament Full
                      </button>
                    ) : (
                      <button
                        onClick={handleJoin}
                        disabled={isJoining}
                        className="w-full py-3 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isJoining ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            Joining...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Join Tournament
                          </>
                        )}
                      </button>
                    )}
                  </>
                )}

                {tournament.status === 'LIVE' && (
                  <button
                    disabled
                    className="w-full py-3 bg-green-500/20 text-green-500 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2 animate-pulse"
                  >
                    <AlertCircle className="w-5 h-5" />
                    🔴 LIVE
                  </button>
                )}

                {tournament.status === 'COMPLETED' && (
                  <button
                    disabled
                    className="w-full py-3 bg-white/5 text-gray-400 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-5 h-5" />
                    Completed
                  </button>
                )}

                {tournament.status === 'CANCELLED' && (
                  <button
                    disabled
                    className="w-full py-3 bg-red-500/20 text-red-500 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
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
