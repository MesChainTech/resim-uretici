/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  serverExternalPackages: ['@prisma/client'],
}

module.exports = nextConfig