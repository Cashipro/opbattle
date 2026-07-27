'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Gamepad2 } from 'lucide-react'

interface Country {
  id: string
  name: string
  code: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    country_id: '',
    pubg_uid: '',
    player_name: '',
  })

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/countries`)
      const data = await res.json()
      setCountries(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch countries:', error)
      setCountries([
        { id: '1', name: 'Pakistan', code: 'PK' },
        { id: '2', name: 'Saudi Arabia', code: 'SA' },
        { id: '3', name: 'Oman', code: 'OM' },
        { id: '4', name: 'Qatar', code: 'QA' },
        { id: '5', name: 'Bangladesh', code: 'BD' },
        { id: '6', name: 'India', code: 'IN' },
        { id: '7', name: 'USA', code: 'US' },
        { id: '8', name: 'UK', code: 'UK' },
      ])
    } finally {
      setLoadingCountries(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!form.email || !form.email.includes('@')) {
      toast.error('Please enter a valid email')
      return
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!form.country_id) {
      toast.error('Please select your country')
      return
    }

    setLoading(true)
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://opbattle-production.up.railway.app'
      
      const res = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          country_id: form.country_id,
          pubg_uid: form.pubg_uid || undefined,
          player_name: form.player_name || undefined,
        }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Registration failed')
      }
      
      // Save token if exists
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
      }
      
      toast.success('Account created! 🎉')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0f] py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Gamepad2 className="w-12 h-12 text-[#FF4655]" />
          </div>
          <h1 className="text-2xl font-heading font-bold">Join OpBattle</h1>
          <p className="text-gray-400 text-sm">Start your esports journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
              placeholder="Create a password (min 6 characters)"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
              placeholder="Confirm your password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Country <span className="text-[#FF4655]">*</span>
            </label>
            <select
              required
              value={form.country_id}
              onChange={(e) => setForm({ ...form, country_id: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
            >
              <option value="">Select your country</option>
              {loadingCountries ? (
                <option value="" disabled>Loading countries...</option>
              ) : (
                countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name} ({country.code})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">PUBG UID</label>
            <input
              type="text"
              value={form.pubg_uid}
              onChange={(e) => setForm({ ...form, pubg_uid: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
              placeholder="Enter your PUBG UID (optional)"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can add your PUBG UID later from profile settings
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Player Name</label>
            <input
              type="text"
              value={form.player_name}
              onChange={(e) => setForm({ ...form, player_name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
              placeholder="Your in-game name (optional)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[#FF4655] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
