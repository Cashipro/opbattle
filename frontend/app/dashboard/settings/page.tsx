'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Mail,
  Lock,
  Shield,
  Bell,
  Globe,
  Smartphone,
  Save,
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  Check,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    country: '',
    device: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    tournamentUpdates: true,
    resultNotifications: true,
    marketingEmails: false,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      setProfile({
        name: data.player_name || '',
        email: data.email || '',
        country: data.country || '',
        device: data.device_type || '',
      })

      // Load preferences from localStorage
      const savedPrefs = localStorage.getItem('userPreferences')
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs))
      }
    } catch (error) {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          player_name: profile.name,
          country: profile.country,
          device_type: profile.device,
        }),
      })

      if (res.ok) {
        toast.success('Profile updated successfully!')
      } else {
        throw new Error('Update failed')
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Password changed successfully!')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        throw new Error(data.message || 'Password change failed')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    const updated = { ...preferences, [key]: !preferences[key] }
    setPreferences(updated)
    localStorage.setItem('userPreferences', JSON.stringify(updated))
    toast.success('Preferences updated')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userPreferences')
    toast.success('Logged out successfully')
    router.push('/login')
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone!')) {
      return
    }

    if (!confirm('All your data, teams, and tournaments will be permanently deleted. Are you absolutely sure?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        localStorage.removeItem('token')
        localStorage.removeItem('userPreferences')
        toast.success('Account deleted successfully')
        router.push('/')
      } else {
        throw new Error('Account deletion failed')
      }
    } catch (error) {
      toast.error('Failed to delete account')
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#FF4655]" />
            Profile Information
          </h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                  placeholder="Your display name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg opacity-50 cursor-not-allowed"
                  placeholder="Email"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <select
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
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
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Device</label>
                <select
                  value={profile.device}
                  onChange={(e) => setProfile({ ...profile, device: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                >
                  <option value="">Select Device</option>
                  <option value="MOBILE">Mobile</option>
                  <option value="PC">PC</option>
                  <option value="EMULATOR">Emulator</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Security Section */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#FF4655]" />
            Security
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition pr-12"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition pr-12"
                  placeholder="Enter new password (min 6 characters)"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                placeholder="Confirm new password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {saving ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Notifications Section */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#FF4655]" />
            Notifications
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive important updates via email</p>
              </div>
              <button
                type="button"
                onClick={() => handlePreferenceChange('emailNotifications')}
                className={`w-12 h-6 rounded-full transition ${
                  preferences.emailNotifications ? 'bg-[#FF4655]' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
              <div>
                <p className="font-medium">Tournament Updates</p>
                <p className="text-sm text-gray-400">Get notified about tournament schedules</p>
              </div>
              <button
                type="button"
                onClick={() => handlePreferenceChange('tournamentUpdates')}
                className={`w-12 h-6 rounded-full transition ${
                  preferences.tournamentUpdates ? 'bg-[#FF4655]' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    preferences.tournamentUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
              <div>
                <p className="font-medium">Result Notifications</p>
                <p className="text-sm text-gray-400">Get notified when match results are published</p>
              </div>
              <button
                type="button"
                onClick={() => handlePreferenceChange('resultNotifications')}
                className={`w-12 h-6 rounded-full transition ${
                  preferences.resultNotifications ? 'bg-[#FF4655]' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    preferences.resultNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-gray-400">Receive promotions and special offers</p>
              </div>
              <button
                type="button"
                onClick={() => handlePreferenceChange('marketingEmails')}
                className={`w-12 h-6 rounded-full transition ${
                  preferences.marketingEmails ? 'bg-[#FF4655]' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    preferences.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        {/* Account Actions */}
        <div className="glass-card p-6 border-red-500/20">
          <h2 className="text-xl font-heading font-bold mb-4 text-red-500 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Danger Zone
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full md:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full md:w-auto px-6 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg font-medium transition flex items-center justify-center gap-2 text-red-500"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
            <p className="text-xs text-gray-500">
              Deleting your account will permanently remove all your data, teams, and tournament history.
              This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
