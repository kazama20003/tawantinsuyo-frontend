import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
  colorScheme: "light",
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production" ? "https://tawantinsuyoperu.com" : "http://localhost:3000",
  ),
  title: {
    default: "Tawantinsuyo Peru - Tours y Experiencias Auténticas en Perú",
    template: "%s | Tawantinsuyo Peru",
  },
  description:
    "Descubre el Perú auténtico con Tawantinsuyo Peru. Tours únicos a Machu Picchu, Cusco, Valle Sagrado y más. Experiencias culturales inolvidables con guías expertos.",
  keywords: [
    "tours peru",
    "machu picchu",
    "cusco tours",
    "valle sagrado",
    "camino inca",
    "turismo peru",
    "viajes peru",
    "experiencias culturales",
    "aventura peru",
    "tawantinsuyo",
  ],
  authors: [{ name: "Tawantinsuyo Peru" }],
  creator: "Tawantinsuyo Peru",
  publisher: "Tawantinsuyo Peru",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "travel",
  classification: "Tourism and Travel",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "es_PE",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "Tawantinsuyo Peru",
    title: "Tawantinsuyo Peru - Tours y Experiencias Auténticas en Perú",
    description:
      "Descubre el Perú auténtico con Tawantinsuyo Peru. Tours únicos a Machu Picchu, Cusco, Valle Sagrado y más.",
    images: [
      {
        url: "/screenshot/image.png",
        width: 1200,
        height: 630,
        alt: "Tawantinsuyo Peru - Tours Auténticos",
        type: "image/jpeg",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    site: "@tawantinsuyoperu",
    creator: "@tawantinsuyoperu",
    title: "Tawantinsuyo Peru - Tours y Experiencias Auténticas",
    description: "Descubre el Perú auténtico con tours únicos a Machu Picchu, Cusco y más destinos increíbles.",
    images: ["/twitter-image.jpg"],
  },

  // Verification
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
      "facebook-domain-verification": "your-facebook-verification-code",
    },
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Languages
  alternates: {
    canonical: "/",
    languages: {
      "es-PE": "/",
      "en-US": "/en",
    },
  },

  // App Links
  appLinks: {
    web: {
      url: "/",
      should_fallback: true,
    },
  },

  // Other
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Tawantinsuyo Peru",
    "application-name": "Tawantinsuyo Peru",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
  },

  // Preload critical resources
  assets: ["/fonts/inter.woff2"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Toaster></Toaster>
      </body>
    </html>
  )
}
