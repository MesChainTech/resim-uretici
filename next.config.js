/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable server actions
    serverActions: true,
  },
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  // Ensure proper handling of large file uploads
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
}

module.exports = nextConfig