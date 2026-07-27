'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Trophy, Calendar, Users, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

interface Tournament {
  id: string
  title: string
  game: string
  mode: string
  entry_fee: number
  prize_pool: number
  max_teams: number
  current_teams: number
  start_date: string
  status: string
}

export default function AdminTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setTournaments(data.tournaments || [])
    } catch (error) {
      toast.error('Failed to fetch tournaments')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tournament?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        toast.success('Tournament deleted')
        fetchTournaments()
      } else {
        toast.error('Failed to delete')
      }
    } catch (error) {
      toast.error('Failed to delete')
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4655]"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Tournaments</h1>
          <p className="text-gray-400">Manage all tournaments</p>
        </div>
        <Link
          href="/admin/tournaments/create"
          className="px-4 py-2 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-medium transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Tournament
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Title</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Game</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Prize</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Teams</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Start</th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((t) => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 font-medium">{t.title}</td>
                  <td className="p-4">{t.game}</td>
                  <td className="p-4 font-bold text-yellow-500">${t.prize_pool}</td>
                  <td className="p-4">{t.current_teams}/{t.max_teams}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {new Date(t.start_date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/tournaments/${t.id}`}
                        className="p-2 hover:bg-blue-500/20 rounded-lg transition text-blue-500"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/tournaments/${t.id}/edit`}
                        className="p-2 hover:bg-yellow-500/20 rounded-lg transition text-yellow-500"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tournaments.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p>No tournaments created yet</p>
            <Link href="/admin/tournaments/create" className="text-[#FF4655] hover:underline mt-2 inline-block">
              Create your first tournament
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
