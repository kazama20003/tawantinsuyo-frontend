/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      // English routes
      {
        source: "/en",
        destination: "/",
      },
      {
        source: "/en/tours",
        destination: "/tours",
      },
      {
        source: "/en/tours/:slug",
        destination: "/tours/:slug",
      },
      {
        source: "/en/destinations",
        destination: "/destinations",
      },
      {
        source: "/en/itineraries",
        destination: "/itineraries",
      },
      {
        source: "/en/about-us",
        destination: "/about-us",
      },
      {
        source: "/en/contact",
        destination: "/contact",
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ]
  },
}

export default nextConfig
