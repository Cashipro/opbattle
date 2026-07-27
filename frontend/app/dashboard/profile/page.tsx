'use client'

import { useState, useEffect } from 'react'
import { User, Edit2, Check, X, Search, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface PlayerProfile {
  id: string
  pubg_uid: string
  player_name: string
  avatar_url: string | null
  country: string | null
  device_type: string | null
  level: number
  rank: string | null
  season_tier: string | null
  matches_played: number
  wins: number
  kills: number
  kd_ratio: number
  tournament_played: number
  tournament_wins: number
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED'
  is_banned: boolean
}

interface PubgData {
  id: string
  name: string
  stats: {
    kills?: number
    wins?: number
    matches?: number
    kd?: number
    headshots?: number
    damage?: number
    top10s?: number
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [pubgUid, setPubgUid] = useState('')
  const [pubgData, setPubgData] = useState<PubgData | null>(null)
  const [loadingPubg, setLoadingPubg] = useState(false)
  
  const [form, setForm] = useState({
    pubg_uid: '',
    player_name: '',
    device_type: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setProfile(data)
      setForm({
        pubg_uid: data.pubg_uid || '',
        player_name: data.player_name || '',
        device_type: data.device_type || '',
      })
      // Auto fetch PUBG data if UID exists
      if (data.pubg_uid) {
        fetchPubgData(data.pubg_uid)
      }
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchPubgData = async (uid: string) => {
    setLoadingPubg(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/players/pubg/${encodeURIComponent(uid)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!res.ok) {
        throw new Error('Player not found')
      }
      const data = await res.json()
      setPubgData(data)
      toast.success('PUBG data fetched!')
    } catch (error: any) {
      toast.error(error.message || 'Player not found. Check the name/UID.')
      setPubgData(null)
    } finally {
      setLoadingPubg(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setProfile(data)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
      
      // Fetch PUBG data if UID is added
      if (form.pubg_uid && form.pubg_uid !== profile?.pubg_uid) {
        fetchPubgData(form.pubg_uid)
      }
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleFetchPubg = () => {
    if (!pubgUid) {
      toast.error('Please enter PUBG UID or Name')
      return
    }
    fetchPubgData(pubgUid)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4655]"></div>
      </div>
    )
  }

  const getVerificationStatus = () => {
    const status = profile?.verification_status || 'PENDING'
    const colors = {
      PENDING: 'text-yellow-500 bg-yellow-500/10',
      APPROVED: 'text-green-500 bg-green-500/10',
      REJECTED: 'text-red-500 bg-red-500/10',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Player Profile</h1>
          <p className="text-gray-400">Manage your gaming identity</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-[#FF4655]/10 hover:bg-[#FF4655]/20 rounded-lg text-[#FF4655] transition flex items-center gap-2"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-[#FF4655]/10 flex items-center justify-center border-2 border-[#FF4655]">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.player_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-[#FF4655]" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold">{profile?.player_name || 'Anonymous'}</h2>
              {getVerificationStatus()}
              {profile?.is_banned && (
                <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-medium">
                  BANNED
                </span>
              )}
            </div>
            <p className="text-gray-400">PUBG UID: {profile?.pubg_uid || 'Not set'}</p>
            <p className="text-gray-400 text-sm">
              {profile?.country || 'No country'} • {profile?.device_type || 'No device'}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{profile?.level || 1}</p>
              <p className="text-xs text-gray-400">Level</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{profile?.rank || 'N/A'}</p>
              <p className="text-xs text-gray-400">Rank</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{profile?.season_tier || 'N/A'}</p>
              <p className="text-xs text-gray-400">Tier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold">{profile?.matches_played || 0}</p>
          <p className="text-xs text-gray-400">Matches</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{profile?.wins || 0}</p>
          <p className="text-xs text-gray-400">Wins</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-[#FF4655]">{profile?.kills || 0}</p>
          <p className="text-xs text-gray-400">Kills</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{profile?.kd_ratio || 0}</p>
          <p className="text-xs text-gray-400">KD Ratio</p>
        </div>
      </div>

      {/* PUBG Data Fetch Section */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-[#FF4655]" />
          Fetch PUBG Data
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter PUBG Name or UID"
            value={pubgUid}
            onChange={(e) => setPubgUid(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
          />
          <button
            onClick={handleFetchPubg}
            disabled={loadingPubg}
            className="px-6 py-3 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loadingPubg ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Fetching...
              </>
            ) : (
              'Fetch Data'
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Enter a PUBG player name (e.g., Shroud, WackyJacky101) or their account ID.
        </p>

        {pubgData && (
          <div className="bg-white/5 rounded-lg p-4 mt-4">
            <h4 className="font-bold text-lg mb-3">PUBG Profile</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="font-bold">{pubgData.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Account ID</p>
                <p className="font-bold text-sm truncate">{pubgData.id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Kills</p>
                <p className="font-bold text-[#FF4655]">{pubgData.stats?.kills || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Wins</p>
                <p className="font-bold text-yellow-500">{pubgData.stats?.wins || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Matches</p>
                <p className="font-bold">{pubgData.stats?.matches || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">KD Ratio</p>
                <p className="font-bold text-green-500">{pubgData.stats?.kd || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Headshots</p>
                <p className="font-bold">{pubgData.stats?.headshots || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Top 10s</p>
                <p className="font-bold">{pubgData.stats?.top10s || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-heading font-bold mb-4">Edit Profile</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">PUBG UID</label>
              <input
                type="text"
                value={form.pubg_uid}
                onChange={(e) => setForm({ ...form, pubg_uid: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                placeholder="Enter your PUBG UID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Player Name</label>
              <input
                type="text"
                value={form.player_name}
                onChange={(e) => setForm({ ...form, player_name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                placeholder="Enter your in-game name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Device</label>
              <select
                value={form.device_type}
                onChange={(e) => setForm({ ...form, device_type: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
              >
                <option value="">Select Device</option>
                <option value="MOBILE">Mobile</option>
                <option value="PC">PC</option>
                <option value="EMULATOR">Emulator</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-semibold transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
