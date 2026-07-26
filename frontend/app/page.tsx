import Link from 'next/link'
import { Trophy, Users, Gamepad2, Globe, ChevronRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-8 h-8 text-[#FF4655]" />
              <span className="text-xl font-bold tracking-tight">Op<span className="text-[#FF4655]">Battle</span></span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm hover:text-[#FF4655] transition">
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF4655]/10 border border-[#FF4655]/20 rounded-full text-sm text-[#FF4655] mb-6">
            <Trophy className="w-4 h-4" />
            <span>PUBG Tournaments Live</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-heading font-bold mb-6">
            <span className="glow-text">Battle</span> Your Way
            <br />
            to <span className="text-[#FF4655]">Glory</span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            Join the ultimate esports tournament platform. Compete in PUBG Mobile & PC,
            win real prizes, and build your professional gaming career.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-[#FF4655] hover:bg-[#FF4655]/80 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              Start Competing <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tournaments"
              className="px-8 py-3 border border-white/20 hover:bg-white/5 rounded-lg font-semibold transition"
            >
              Browse Tournaments
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
            <div className="glass-card p-6">
              <div className="text-3xl font-bold text-[#FF4655]">50+</div>
              <div className="text-sm text-gray-400">Active Players</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl font-bold text-[#FF4655]">25+</div>
              <div className="text-sm text-gray-400">Tournaments</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl font-bold text-[#FF4655]">8+</div>
              <div className="text-sm text-gray-400">Countries</div>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl font-bold text-[#FF4655]">$5K+</div>
              <div className="text-sm text-gray-400">Prize Pool</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Why <span className="text-[#FF4655]">OpBattle</span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 text-center">
              <div className="w-14 h-14 bg-[#FF4655]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-[#FF4655]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Up</h3>
              <p className="text-gray-400 text-sm">
                Create teams with 4 players and compete together in tournaments.
              </p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-14 h-14 bg-[#FF4655]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-7 h-7 text-[#FF4655]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Win Prizes</h3>
              <p className="text-gray-400 text-sm">
                Real prize pools distributed automatically to winners' wallets.
              </p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-14 h-14 bg-[#FF4655]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-7 h-7 text-[#FF4655]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global</h3>
              <p className="text-gray-400 text-sm">
                Compete with players from Pakistan, Saudi, Oman, Qatar & more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#FF4655]" />
            <span className="font-bold">OpBattle</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 OpBattle. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
