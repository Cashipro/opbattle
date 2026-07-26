'use client'

import { useState, useEffect } from 'react'
import { Wallet, ArrowDown, ArrowUp, History, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface Transaction {
  id: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'FEE' | 'REWARD' | 'REFUND'
  amount: number
  description: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  created_at: string
}

interface WalletData {
  balance: number
  held_balance: number
  currency: string
  transactions: Transaction[]
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [bankDetails, setBankDetails] = useState({
    bank_name: '',
    account_number: '',
    account_holder_name: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchWallet()
  }, [])

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setWallet(data)
    } catch (error) {
      toast.error('Failed to load wallet')
    } finally {
      setLoading(false)
    }
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(depositAmount) }),
      })
      const data = await res.json()
      
      if (data.payment_url) {
        window.open(data.payment_url, '_blank')
        toast.success('Payment initiated! Complete it to add funds.')
        setShowDepositModal(false)
        setDepositAmount('')
      } else {
        toast.success('Deposit successful!')
        fetchWallet()
        setShowDepositModal(false)
        setDepositAmount('')
      }
    } catch (error) {
      toast.error('Deposit failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    if (parseFloat(withdrawAmount) > (wallet?.balance || 0)) {
      toast.error('Insufficient balance')
      return
    }
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          ...bankDetails,
        }),
      })
      const data = await res.json()
      
      if (res.ok) {
        toast.success('Withdrawal request submitted!')
        fetchWallet()
        setShowWithdrawModal(false)
        setWithdrawAmount('')
        setBankDetails({
          bank_name: '',
          account_number: '',
          account_holder_name: '',
        })
      } else {
        throw new Error(data.message || 'Withdrawal failed')
      }
    } catch (error: any) {
      toast.error(error.message || 'Withdrawal failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied!')
  }

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, any> = {
      DEPOSIT: <ArrowDown className="w-4 h-4 text-green-500" />,
      WITHDRAWAL: <ArrowUp className="w-4 h-4 text-red-500" />,
      FEE: <ArrowUp className="w-4 h-4 text-yellow-500" />,
      REWARD: <ArrowDown className="w-4 h-4 text-green-500" />,
      REFUND: <ArrowDown className="w-4 h-4 text-blue-500" />,
    }
    return icons[type] || null
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'text-yellow-500 bg-yellow-500/10',
      COMPLETED: 'text-green-500 bg-green-500/10',
      FAILED: 'text-red-500 bg-red-500/10',
      CANCELLED: 'text-gray-500 bg-gray-500/10',
    }
    return colors[status as keyof typeof colors] || 'text-gray-400 bg-gray-500/10'
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Wallet</h1>
          <p className="text-gray-400">Manage your funds and transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4655]/5 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-sm text-gray-400 mb-1">Available Balance</p>
            <p className="text-4xl font-bold">
              ${wallet?.balance?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {wallet?.currency || 'USD'} • Available for tournaments
            </p>
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-sm text-gray-400 mb-1">Held Balance</p>
            <p className="text-4xl font-bold text-yellow-500">
              ${wallet?.held_balance?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Locked in active tournaments
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setShowDepositModal(true)}
          className="px-6 py-3 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-semibold transition flex items-center gap-2"
        >
          <ArrowDown className="w-5 h-5" />
          Deposit
        </button>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition flex items-center gap-2"
        >
          <ArrowUp className="w-5 h-5" />
          Withdraw
        </button>
        <button
          onClick={() => copyToClipboard('opbattle-wallet-address')}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition flex items-center gap-2 text-sm"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Wallet ID'}
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold flex items-center gap-2">
            <History className="w-5 h-5" />
            Transaction History
          </h2>
          <span className="text-xs text-gray-400">
            {wallet?.transactions?.length || 0} transactions
          </span>
        </div>

        {wallet?.transactions?.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No transactions yet</p>
            <p className="text-sm text-gray-500">Start by depositing funds</p>
          </div>
        ) : (
          <div className="space-y-3">
            {wallet?.transactions?.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      tx.type === 'DEPOSIT' || tx.type === 'REWARD' || tx.type === 'REFUND'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {tx.type === 'DEPOSIT' || tx.type === 'REWARD' || tx.type === 'REFUND'
                      ? '+'
                      : '-'}
                    ${tx.amount.toFixed(2)}
                  </p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      tx.status
                    )}`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-heading font-bold mb-4">Deposit Funds</h2>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                  placeholder="Enter amount"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum deposit: $1.00</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-heading font-bold mb-4">Withdraw Funds</h2>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                  placeholder="Enter amount"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: ${wallet?.balance?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bank Name</label>
                <input
                  type="text"
                  required
                  value={bankDetails.bank_name}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, bank_name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                  placeholder="e.g., HBL, JazzCash, Meezan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Account Number</label>
                <input
                  type="text"
                  required
                  value={bankDetails.account_number}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, account_number: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={bankDetails.account_holder_name}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      account_holder_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#FF4655] transition"
                  placeholder="Enter full name"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
