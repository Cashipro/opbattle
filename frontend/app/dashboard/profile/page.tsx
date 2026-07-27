'use client'

import { useState, useEffect } from 'react'
import { User, Save, Edit2, Check, X } from 'lucide-react'
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

export default function ProfilePage() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({})
  const [formData, setFormData] = useState({
    pubg_uid: '',
    player_name: '',
    country: '',
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
      setFormData({
        pubg_uid: data.pubg_uid || '',
        player_name: data.player_name || '',
        country: data.country || '',
        device_type: data.device_type || '',
      })
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      setProfile(data)
      setEditMode({})
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const toggleEdit = (field: string) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Player Profile</h1>
          <p className="text-gray-400">Manage your gaming identity</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All'}
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

      {/* Editable Fields */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-heading font-bold mb-4">Profile Information</h3>
        <div className="space-y-4">
          {/* PUBG UID */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
            <div className="flex-1">
              <p className="text-xs text-gray-400">PUBG UID</p>
              {editMode.pubg_uid ? (
                <input
                  type="text"
                  value={formData.pubg_uid}
                  onChange={(e) => handleChange('pubg_uid', e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                  placeholder="Enter PUBG UID"
                  autoFocus
                />
              ) : (
                <p className="font-medium">{formData.pubg_uid || 'Not set'}</p>
              )}
            </div>
            <button
              onClick={() => toggleEdit('pubg_uid')}
              className="ml-4 p-2 hover:bg-white/10 rounded-lg transition"
            >
              {editMode.pubg_uid ? <Check className="w-4 h-4 text-green-500" /> : <Edit2 className="w-4 h-4 text-gray-400" />}
            </button>
          </div>

          {/* Player Name */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
            <div className="flex-1">
              <p className="text-xs text-gray-400">Player Name</p>
              {editMode.player_name ? (
                <input
                  type="text"
                  value={formData.player_name}
                  onChange={(e) => handleChange('player_name', e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                  placeholder="Enter player name"
                  autoFocus
                />
              ) : (
                <p className="font-medium">{formData.player_name || 'Not set'}</p>
              )}
            </div>
            <button
              onClick={() => toggleEdit('player_name')}
              className="ml-4 p-2 hover:bg-white/10 rounded-lg transition"
            >
              {editMode.player_name ? <Check className="w-4 h-4 text-green-500" /> : <Edit2 className="w-4 h-4 text-gray-400" />}
            </button>
          </div>

          {/* Country */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
            <div className="flex-1">
              <p className="text-xs text-gray-400">Country</p>
              {editMode.country ? (
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                  autoFocus
                >
                  <option value="">Select Country</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Oman">Oman</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
              ) : (
                <p className="font-medium">{formData.country || 'Not set'}</p>
              )}
            </div>
            <button
              onClick={() => toggleEdit('country')}
              className="ml-4 p-2 hover:bg-white/10 rounded-lg transition"
            >
              {editMode.country ? <Check className="w-4 h-4 text-green-500" /> : <Edit2 className="w-4 h-4 text-gray-400" />}
            </button>
          </div>

          {/* Device */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
            <div className="flex-1">
              <p className="text-xs text-gray-400">Device</p>
              {editMode.device_type ? (
                <select
                  value={formData.device_type}
                  onChange={(e) => handleChange('device_type', e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                  autoFocus
                >
                  <option value="">Select Device</option>
                  <option value="MOBILE">Mobile</option>
                  <option value="PC">PC</option>
                  <option value="EMULATOR">Emulator</option>
                </select>
              ) : (
                <p className="font-medium">{formData.device_type || 'Not set'}</p>
              )}
            </div>
            <button
              onClick={() => toggleEdit('device_type')}
              className="ml-4 p-2 hover:bg-white/10 rounded-lg transition"
            >
              {editMode.device_type ? <Check className="w-4 h-4 text-green-500" /> : <Edit2 className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
