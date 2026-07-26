'use client'

import { useState, useEffect } from 'react'
import { Check, X, Clock, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

interface Withdrawal {
  id: string
  user_id: string
  amount: number
  bank_name: string
  account_number: string
  account_holder_name: string
  status: string
  created_at: string
  user?: {
    email: string
  }
}

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('PENDING')

  useEffect(() => {
    fetchWithdrawals()
  }, [filter])

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('token')
      const url = filter === 'PENDING'
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/wallet/withdrawals/pending`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/wallet/withdrawals?status=${filter}`

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setWithdrawals(Array.isArray(data) ? data : data.withdrawals || [])
    } catch (error) {
      toast.error('Failed to fetch withdrawals')
    } finally {
      setLoading(false)
    }
  }

  const handleProcess = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/wallet/withdrawals/${id}/process`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.ok) {
        toast.success('Withdrawal marked as processing')
        fetchWithdrawals()
      } else {
        toast.error('Failed to process withdrawal')
      }
    } catch (error) {
      toast.error('Failed to process withdrawal')
    }
  }

  const handleComplete = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/wallet/withdrawals/${id}/complete`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.ok) {
        toast.success('Withdrawal completed!')
        fetchWithdrawals()
      } else {
        toast.error('Failed to complete withdrawal')
      }
    } catch (error) {
      toast.error('Failed to complete withdrawal')
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Rejection reason:')
    if (!reason) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/wallet/withdrawals/${id}/reject`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      )
      if (res.ok) {
        toast.success('Withdrawal rejected')
        fetchWithdrawals()
      } else {
        toast.error('Failed to reject withdrawal')
      }
    } catch (error) {
      toast.error('Failed to reject withdrawal')
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-500/20 text-yellow-500',
      PROCESSING: 'bg-blue-500/20 text-blue-500',
      COMPLETED: 'bg-green-500/20 text-green-500',
      REJECTED: 'bg-red-500/20 text-red-500',
    }
    return colors[status] || 'bg-gray-500/20 text-gray-500'
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
          <h1 className="text-3xl font-heading font-bold">Withdrawals</h1>
          <p className="text-gray-400">Manage withdrawal requests</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
        >
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>

      {withdrawals.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold mb-2">No Withdrawals</h3>
          <p className="text-gray-400
