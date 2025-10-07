/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization to avoid sharp issues in Docker
  images: {
    unoptimized: true,
  },
  // External packages for server components
  serverExternalPackages: ['sharp'],
  // Output configuration for static export if needed
  output: 'standalone',
  // Disable strict mode to avoid double rendering issues
  reactStrictMode: false,
  // SWC minification is enabled by default in Next.js 13+
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable ESLint during build to avoid plugin issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Handle sharp module for server-side rendering
    if (isServer) {
      config.externals.push('sharp');
    }
    return config;
  },
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;