'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateTournament() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    game: 'PUBG Mobile',
    mode: 'Squad',
    country: '',
    entry_fee: 0,
    prize_pool: 0,
    max_teams: 25,
    start_date: '',
    registration_deadline: '',
    rules: '',
    prize_distribution: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.title || !form.start_date || !form.registration_deadline) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast.success('Tournament created successfully! 🎉')
        router.push('/admin/tournaments')
      } else {
        const data = await res.json()
        toast.error(data.message || 'Failed to create tournament')
      }
    } catch (error) {
      toast.error('Failed to create tournament')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-heading font-bold">Create Tournament</h1>
          <p className="text-gray-400">Setup a new tournament</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
              placeholder="e.g., Summer Cup 2026"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Game</label>
            <select
              value={form.game}
              onChange={(e) => setForm({ ...form, game: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
            >
              <option value="PUBG Mobile">PUBG Mobile</option>
              <option value="PUBG PC">PUBG PC</option>
              <option value="Free Fire">Free Fire</option>
              <option value="Valorant">Valorant</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mode</label>
            <select
              value={form.mode}
              onChange={(e) => setForm({ ...form, mode: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
            >
              <option value="Solo">Solo</option>
              <option value="Duo">Duo</option>
              <option value="Squad">Squad</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <select
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
            >
              <option value="">Global</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Oman">Oman</option>
              <option value="Qatar">Qatar</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="India">India</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Entry Fee ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.entry_fee}
              onChange={(e) => setForm({ ...form, entry_fee: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Prize Pool ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.prize_pool}
              onChange={(e) => setForm({ ...form, prize_pool: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Teams</label>
            <input
              type="number"
              min="2"
              max="100"
              value={form.max_teams}
              onChange={(e) => setForm({ ...form, max_teams: parseInt(e.target.value) || 25 })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start Date *</label>
            <input
              type="datetime-local"
              required
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Registration Deadline *</label>
            <input
              type="datetime-local"
              required
              value={form.registration_deadline}
              onChange={(e) => setForm({ ...form, registration_deadline: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
              placeholder="Tournament description..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Rules</label>
            <textarea
              value={form.rules}
              onChange={(e) => setForm({ ...form, rules: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
              placeholder="Tournament rules..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Prize Distribution</label>
            <textarea
              value={form.prize_distribution}
              onChange={(e) => setForm({ ...form, prize_distribution: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
              placeholder="e.g., 1st: 50%, 2nd: 30%, 3rd: 20%"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Creating...' : 'Create Tournament'}
          </button>
        </div>
      </form>
    </div>
  )
}
