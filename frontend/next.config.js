/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['opbattle.vercel.app', 'pubg.com', 'cdn.discordapp.com'],
  },
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
