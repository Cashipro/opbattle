import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ 
  subsets: ['latin'], 
  variable: '--font-orbitron' 
})

export const metadata: Metadata = {
  title: 'OpBattle | Global Esports Tournament Platform',
  description: 'Compete in PUBG tournaments worldwide. Join teams, win prizes, build your esports career.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${orbitron.variable} bg-dark text-white`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
