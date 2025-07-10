import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

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
  colorScheme: "light dark",
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://tawantinsuyoperu.com"
      : "http://localhost:3000"
  ),
  title: {
    default: "Tawantinsuyo Peru - Tours y Experiencias Únicas en Perú",
    template: "%s | Tawantinsuyo Peru",
  },
  description:
    "Agencia de viajes Tawantinsuyo Perú: Descubre Arequipa, el Cañón del Colca, Machu Picchu, Cusco y otros destinos mágicos. Paquetes turísticos únicos con guías locales.",
  keywords: [
    "tawantinsuyo peru",
    "tawantinsuyo arequipa",
    "tours arequipa",
    "colca full day",
    "cañón del colca",
    "tours cusco",
    "machu picchu",
    "valle sagrado",
    "camino inca",
    "tours en perú",
    "agencia de viajes arequipa",
    "paquetes turísticos arequipa",
    "experiencias en perú",
    "tour full day arequipa",
    "tawantinsuyo travel",
    "tours personalizados",
  ],
  authors: [{ name: "Tawantinsuyo Peru" }],
  creator: "Tawantinsuyo Peru",
  publisher: "Tawantinsuyo Peru",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "Tawantinsuyo Peru",
    title: "Tawantinsuyo Peru - Tours y Experiencias Únicas en Perú",
    description:
      "Explora Perú con Tawantinsuyo: Arequipa, Cañón del Colca, Cusco, Machu Picchu y más. Tours únicos y experiencias inolvidables.",
    images: [
      {
        url: "/screenshot/image.png",
        width: 1200,
        height: 630,
        alt: "Tawantinsuyo Peru - Tours y Experiencias Únicas",
        type: "image/jpeg",
      },
      {
        url: "/screenshot/tour.png",
        width: 1200,
        height: 1200,
        alt: "Tawantinsuyo Peru - Tours",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tawantinsuyoperu",
    creator: "@tawantinsuyoperu",
    title: "Tawantinsuyo Peru - Tours y Experiencias Únicas en Perú",
    description:
      "Vive la magia del Perú con tours únicos. Desde Arequipa y el Colca hasta Machu Picchu y Cusco.",
    images: [
      {
        url: "/twitter-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tawantinsuyo Peru - Tours y Experiencias Únicas",
      },
    ],
  },
  verification: {
    google: "B9Mxs9XUBbqO50FlTSr3-IIKmRFy1GPukelZD7m9-rA",
    other: {
      "msvalidate.01": "bing-verification-code-here",
      "facebook-domain-verification": "facebook-verification-code-here",
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "es-PE": "/",
      "en-US": "/en",
    },
  },
  category: "travel",
  classification: "Tourism and Travel Services",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Tawantinsuyo Peru",
    "application-name": "Tawantinsuyo Peru",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#2563eb",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="B9Mxs9XUBbqO50FlTSr3-IIKmRFy1GPukelZD7m9-rA"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
