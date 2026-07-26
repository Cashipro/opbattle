'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Trophy,
  Calendar,
  Users,
  DollarSign,
  Search,
  Filter,
  Gamepad2,
  MapPin,
  ChevronDown,
  X,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
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
  registration_deadline: string
}

export default function TournamentsPage() {
  const router = useRouter()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    game: '',
    country: '',
    status: '',
    minPrize: '',
    maxFee: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers: HeadersInit = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments`, {
        headers,
      })
      const data = await res.json()
      setTournaments(data)
      setFilteredTournaments(data)
    } catch (error) {
      toast.error('Failed to load tournaments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = tournaments

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filters.game) {
      filtered = filtered.filter((t) => t.game === filters.game)
    }
    if (filters.country) {
      filtered = filtered.filter((t) => t.country === filters.country)
    }
    if (filters.status) {
      filtered = filtered.filter((t) => t.status === filters.status)
    }
    if (filters.minPrize) {
      filtered = filtered.filter((t) => t.prize_pool >= parseInt(filters.minPrize))
    }
    if (filters.maxFee) {
      filtered = filtered.filter((t) => t.entry_fee <= parseInt(filters.maxFee))
    }

    setFilteredTournaments(filtered)
  }, [searchQuery, filters, tournaments])

  const handleJoinTournament = async (tournamentId: string) => {
    if (!isLoggedIn) {
      toast.error('Please login first')
      router.push('/login')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tournaments/${tournamentId}/register`,
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
        fetchTournaments()
      } else {
        throw new Error(data.message || 'Failed to join tournament')
      }
    } catch (error: any) {
      toast.error(error.message)
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

  const getStatusBadge = (status: string) => {
    const labels: Record<string, string> = {
      UPCOMING: '📅 Upcoming',
      LIVE: '🔴 LIVE',
      COMPLETED: '✅ Completed',
      CANCELLED: '❌ Cancelled',
    }
    return labels[status as keyof typeof labels] || status
  }

  const getProgressColor = (current: number, max: number) => {
    const percent = (current / max) * 100
    if (percent >= 90) return 'bg-red-500'
    if (percent >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const uniqueGames = Array.from(new Set(tournaments.map((t) => t.game)))
  const uniqueCountries = Array.from(new Set(tournaments.map((t) => t.country)))

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4655]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-8 h-8 text-[#FF4655]" />
              <h1 className="text-2xl font-heading font-bold">Tournaments</h1>
              <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">
                {filteredTournaments.length} tournaments
              </span>
            </div>

            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  showFilters ? 'bg-[#FF4655]/20 text-[#FF4655]' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Game</label>
                  <select
                    value={filters.game}
                    onChange={(e) => setFilters({ ...filters, game: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition text-sm"
                  >
                    <option value="">All Games</option>
                    {uniqueGames.map((game) => (
                      <option key={game} value={game}>
                        {game}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Country</label>
                  <select
                    value={filters.country}
                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition text-sm"
                  >
                    <option value="">All Countries</option>
                    {uniqueCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="UPCOMING">📅 Upcoming</option>
                    <option value="LIVE">🔴 Live</option>
                    <option value="COMPLETED">✅ Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Min Prize</label>
                  <input
                    type="number"
                    placeholder="Min $"
                    value={filters.minPrize}
                    onChange={(e) => setFilters({ ...filters, minPrize: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Max Entry Fee</label>
                  <input
                    type="number"
                    placeholder="Max $"
                    value={filters.maxFee}
                    onChange={(e) => setFilters({ ...filters, maxFee: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition text-sm"
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  setFilters({
                    game: '',
                    country: '',
                    status: '',
                    minPrize: '',
                    maxFee: '',
                  })
                }
                className="mt-3 text-sm text-[#FF4655] hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredTournaments.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold mb-2">No Tournaments Found</h3>
            <p className="text-gray-400">
              {searchQuery || Object.values(filters).some((v) => v)
                ? 'Try adjusting your filters'
                : 'Check back later for new tournaments'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => {
              const progress = (tournament.current_teams / tournament.max_teams) * 100
              const isFull = tournament.current_teams >= tournament.max_teams
              const isRegistrationOpen = tournament.status === 'UPCOMING' && 
                new Date() < new Date(tournament.registration_deadline)

              return (
                <Link
                  key={tournament.id}
                  href={`/tournaments/${tournament.id}`}
                  className="glass-card p-6 hover:border-[#FF4655]/30 transition group block"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        tournament.status
                      )}`}
                    >
                      {getStatusBadge(tournament.status)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {tournament.current_teams}/{tournament.max_teams} Teams
                    </span>
                  </div>

                  <div className="w-full h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getProgressColor(
                        tournament.current_teams,
                        tournament.max_teams
                      )}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-[#FF4655] transition line-clamp-1">
                    {tournament.title}
                  </h3>

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

                  {tournament.description && (
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {tournament.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-xs text-gray-400">Prize Pool</p>
                      <p className="text-lg font-bold text-yellow-500">
                        ${tournament.prize_pool}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Entry Fee</p>
                      <p className="text-lg font-bold text-[#FF4655]">
                        ${tournament.entry_fee}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    {tournament.status === 'UPCOMING' && (
                      <div className="flex items-center gap-2 text-xs">
                        {isRegistrationOpen ? (
                          <>
                            <Clock className="w-3 h-3 text-yellow-500" />
                            <span className="text-yellow-500">
                              Registration closes {new Date(tournament.registration_deadline).toLocaleDateString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-red-500">Registration closed</span>
                        )}
                        {isFull && (
                          <span className="text-red-500 bg-red-500/20 px-2 py-0.5 rounded-full ml-2">
                            FULL
                          </span>
                        )}
                      </div>
                    )}
                    {tournament.status === 'LIVE' && (
                      <div className="flex items-center gap-2 text-xs text-green-500">
                        <AlertCircle className="w-3 h-3 animate-pulse" />
                        <span>Live now!</span>
                      </div>
                    )}
                    {tournament.is_registered && (
                      <div className="flex items-center gap-2 text-xs text-green-500 mt-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>You are registered!</span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
