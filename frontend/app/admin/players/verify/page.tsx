'use client'

import { useState, useEffect } from 'react'
import { Check, X, Search, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface Player {
  id: string
  pubg_uid: string
  player_name: string
  avatar_url: string | null
  verification_status: string
  verification_screenshot_url: string | null
  created_at: string
  user_id: string
}

export default function AdminVerifications() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [stats, setStats] = useState({
    matches_played: 0,
    wins: 0,
    kills: 0,
    kd_ratio: 0,
    level: 1,
  })

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/players/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setPlayers(data)
    } catch (error) {
      toast.error('Failed to fetch pending verifications')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (player: Player) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/players/${player.pubg_uid}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stats,
          screenshot_url: player.verification_screenshot_url,
        }),
      })
      if (res.ok) {
        toast.success('Player verified successfully!')
        fetchPlayers()
        setSelectedPlayer(null)
      } else {
        toast.error('Failed to verify player')
      }
    } catch (error) {
      toast.error('Failed to verify player')
    }
  }

  const handleReject = async (player: Player) => {
    const reason = prompt('Reason for rejection:')
    if (!reason) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/players/${player.pubg_uid}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      })
      if (res.ok) {
        toast.success('Player rejected')
        fetchPlayers()
      } else {
        toast.error('Failed to reject player')
      }
    } catch (error) {
      toast.error('Failed to reject player')
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Player Verifications</h1>
        <p className="text-gray-400">Verify PUBG player identities ({players.length} pending)</p>
      </div>

      {players.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold mb-2">All Verified!</h3>
          <p className="text-gray-400">No pending verifications</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player) => (
            <div key={player.id} className="glass-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  {player.avatar_url ? (
                    <img src={player.avatar_url} alt={player.player_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#FF4655]/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#FF4655]">
                        {player.player_name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold">{player.player_name || 'Unknown'}</p>
                  <p className="text-sm text-gray-400">UID: {player.pubg_uid}</p>
                </div>
              </div>

              {player.verification_screenshot_url && (
                <button
                  onClick={() => {
                    if (player.verification_screenshot_url) {
                      window.open(player.verification_screenshot_url, '_blank')
                    }
                  }}
                  className="w-full py-2 mb-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm flex items-center justify-center gap-2 transition"
                >
                  <Eye className="w-4 h-4" />
                  View Screenshot
                </button>
              )}

              <div className="grid grid-cols-2 gap-2 mb-4">
                <input
                  type="number"
                  placeholder="Matches"
                  value={stats.matches_played || ''}
                  onChange={(e) => setStats({ ...stats, matches_played: parseInt(e.target.value) || 0 })}
                  className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#FF4655]"
                />
                <input
                  type="number"
                  placeholder="Wins"
                  value={stats.wins || ''}
                  onChange={(e) => setStats({ ...stats, wins: parseInt(e.target.value) || 0 })}
                  className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#FF4655]"
                />
                <input
                  type="number"
                  placeholder="Kills"
                  value={stats.kills || ''}
                  onChange={(e) => setStats({ ...stats, kills: parseInt(e.target.value) || 0 })}
                  className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#FF4655]"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="KD"
                  value={stats.kd_ratio || ''}
                  onChange={(e) => setStats({ ...stats, kd_ratio: parseFloat(e.target.value) || 0 })}
                  className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#FF4655]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleVerify(player)}
                  className="flex-1 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Verify
                </button>
                <button
                  onClick={() => handleReject(player)}
                  className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg font-medium transition flex items-center justify-center gap-2 text-red-500"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
