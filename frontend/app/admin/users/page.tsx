'use client'

import { useState, useEffect } from 'react'
import { Search, Ban, Check, Trash2, UserCog } from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  role: string
  is_active: boolean
  is_verified: boolean
  created_at: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [search, filter])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users?search=${search}&role=${filter !== 'all' ? filter : ''}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleBan = async (id: string, reason: string) => {
    if (!confirm('Ban this user?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/ban`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      })
      if (res.ok) {
        toast.success('User banned')
        fetchUsers()
      } else {
        toast.error('Failed to ban user')
      }
    } catch (error) {
      toast.error('Failed to ban user')
    }
  }

  const handleUnban = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/unban`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        toast.success('User unbanned')
        fetchUsers()
      } else {
        toast.error('Failed to unban user')
      }
    } catch (error) {
      toast.error('Failed to unban user')
    }
  }

  const handleRoleChange = async (id: string, role: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      })
      if (res.ok) {
        toast.success('Role updated')
        fetchUsers()
      } else {
        toast.error('Failed to update role')
      }
    } catch (error) {
      toast.error('Failed to update role')
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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Users</h1>
          <p className="text-gray-400">Manage platform users</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Email</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Role</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Joined</th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-xs text-gray-400">{user.id}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#FF4655] transition"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {user.is_active ? 'Active' : 'Banned'}
                    </span>
                    {user.is_verified && (
                      <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs font-medium">
                        Verified
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {user.is_active ? (
                        <button
                          onClick={() => handleBan(user.id, 'Violation of terms')}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-500"
                          title="Ban"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnban(user.id)}
                          className="p-2 hover:bg-green-500/20 rounded-lg transition text-green-500"
                          title="Unban"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                        className="p-2 hover:bg-blue-500/20 rounded-lg transition text-blue-500"
                        title="Toggle Admin"
                      >
                        <UserCog className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No users found
          </div>
        )}
      </div>
    </div>
  )
}
