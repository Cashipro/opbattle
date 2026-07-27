'use client'

import { useState, useEffect } from 'react'
import { Users, UserPlus, Crown, LogOut, Trash2, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface TeamMember {
  id: string
  player_name: string
  pubg_uid: string
  avatar_url: string | null
  is_captain: boolean
}

interface Team {
  id: string
  name: string
  logo_url: string | null
  captain_id: string
  members: TeamMember[]
  wins: number
  losses: number
  total_prize: number
  ranking: number
}

export default function TeamPage() {
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [inviteUid, setInviteUid] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userPlayerId, setUserPlayerId] = useState<string | null>(null)

  useEffect(() => {
    fetchUserPlayerId()
    fetchTeam()
  }, [])

  const fetchUserPlayerId = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUserPlayerId(data?.id || null)
      }
    } catch (error) {
      console.error('Failed to fetch player ID:', error)
    }
  }

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 404) {
        setTeam(null)
        setLoading(false)
        return
      }
      if (!res.ok) {
        throw new Error('Failed to fetch team')
      }
      const data = await res.json()
      setTeam(data)
    } catch (error) {
      console.error('Failed to fetch team:', error)
      toast.error('Failed to load team')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) {
      toast.error('Please enter a team name')
      return
    }
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: teamName.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Team created successfully! 🎉')
        fetchTeam()
        setShowCreateModal(false)
        setTeamName('')
      } else {
        throw new Error(data.message || 'Failed to create team')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteUid.trim()) {
      toast.error('Please enter PUBG UID')
      return
    }
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/${team?.id}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ player_id: inviteUid.trim() }),
        }
      )
      const data = await res.json()
      if (res.ok) {
        toast.success('Member added successfully!')
        fetchTeam()
        setShowInviteModal(false)
        setInviteUid('')
      } else {
        throw new Error(data.message || 'Failed to add member')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Remove this member from the team?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/${team?.id}/members/${memberId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.ok) {
        toast.success('Member removed')
        fetchTeam()
      } else {
        toast.error('Failed to remove member')
      }
    } catch (error) {
      toast.error('Failed to remove member')
    }
  }

  const handleLeaveTeam = async () => {
    if (!confirm('Are you sure you want to leave this team?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${team?.id}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        toast.success('You left the team')
        setTeam(null)
      } else {
        toast.error('Failed to leave team')
      }
    } catch (error) {
      toast.error('Failed to leave team')
    }
  }

  const handleDeleteTeam = async () => {
    if (!confirm('Delete this team permanently? This cannot be undone.')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${team?.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        toast.success('Team deleted')
        setTeam(null)
      } else {
        toast.error('Failed to delete team')
      }
    } catch (error) {
      toast.error('Failed to delete team')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4655]"></div>
      </div>
    )
  }

  // No Team
  if (!team) {
    return (
      <div>
        <h1 className="text-3xl font-heading font-bold mb-4">My Team</h1>
        <div className="glass-card p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold mb-2">No Team Yet</h3>
          <p className="text-gray-400 mb-4">
            Create a team to start competing in tournaments
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-semibold transition"
          >
            Create Team
          </button>
        </div>

        {/* Create Team Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-heading font-bold mb-4">Create Team</h2>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Team Name</label>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                    placeholder="Enter team name"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Team exists
  const isCaptain = team?.captain_id === userPlayerId

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">My Team</h1>
          <p className="text-gray-400">Manage your team and members</p>
        </div>
        <div className="flex gap-2">
          {isCaptain && (
            <>
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-medium transition flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Invite
              </button>
              <button
                onClick={handleDeleteTeam}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg font-medium transition flex items-center gap-2 text-red-500"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
          {!isCaptain && (
            <button
              onClick={handleLeaveTeam}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Leave
            </button>
          )}
        </div>
      </div>

      {/* Team Card */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#FF4655]/10 flex items-center justify-center border-2 border-[#FF4655]">
            {team?.logo_url ? (
              <img
                src={team.logo_url}
                alt={team.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Users className="w-10 h-10 text-[#FF4655]" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{team?.name || 'Team'}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Crown className="w-4 h-4 text-yellow-500" />
                Captain: {team?.members?.find((m) => m.is_captain)?.player_name || 'Unknown'}
              </span>
              <span>🏆 {team?.wins || 0} Wins</span>
              <span>📊 Rank #{team?.ranking || 'N/A'}</span>
              <span>💰 ${team?.total_prize || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Members */}
      <h2 className="text-xl font-heading font-bold mb-4">Members ({team?.members?.length || 0}/4)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {team?.members?.map((member) => (
          <div
            key={member.id}
            className="glass-card p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                {member.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt={member.player_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Users className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-medium">{member.player_name || 'Unknown'}</p>
                <p className="text-xs text-gray-400">{member.pubg_uid || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {member.is_captain && (
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded-full text-xs">
                  Captain
                </span>
              )}
              {isCaptain && !member.is_captain && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-1 hover:bg-red-500/20 rounded transition"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-heading font-bold mb-4">Add Member</h2>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Player ID</label>
                <input
                  type="text"
                  required
                  value={inviteUid}
                  onChange={(e) => setInviteUid(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                  placeholder="Enter player ID"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
