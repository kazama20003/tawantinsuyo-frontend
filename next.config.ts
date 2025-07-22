/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
  },
  async rewrites() {
    return [
      // English routes - rewrite /en/* to /*
      {
        source: '/en',
        destination: '/',
      },
      {
        source: '/en/tours',
        destination: '/tours',
      },
      {
        source: '/en/tours/:slug',
        destination: '/tours/:slug',
      },
      {
        source: '/en/destinations',
        destination: '/destinations',
      },
      {
        source: '/en/itineraries',
        destination: '/itineraries',
      },
      {
        source: '/en/about-us',
        destination: '/about-us',
      },
      {
        source: '/en/contact',
        destination: '/contact',
      },
      {
        source: '/en/login',
        destination: '/login',
      },
      {
        source: '/en/register',
        destination: '/register',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ]
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  trailingSlash: false,
}

export default nextConfig
