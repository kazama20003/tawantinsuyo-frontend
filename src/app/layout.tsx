import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Tawantinsuyo Peru - Descubre la Magia del Perú",
    template: "%s | Tawantinsuyo Peru",
  },
  description:
    "Agencia de turismo especializada en tours por Perú. Descubre Machu Picchu, Cusco, el Valle Sagrado y más destinos increíbles con guías expertos locales.",
  keywords: [
    "turismo Perú",
    "tours Machu Picchu",
    "viajes Cusco",
    "agencia turismo",
    "Valle Sagrado",
    "Tawantinsuyo",
    "guías locales",
    "aventura Perú",
  ],
  authors: [{ name: "Tawantinsuyo Peru" }],
  creator: "Tawantinsuyo Peru",
  publisher: "Tawantinsuyo Peru",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://tawantinsuyoperu.com"),
  alternates: {
    canonical: "/",
    languages: {
      "es-PE": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://tawantinsuyoperu.com",
    siteName: "Tawantinsuyo Peru",
    title: "Tawantinsuyo Peru - Descubre la Magia del Perú",
    description:
      "Agencia de turismo especializada en tours por Perú. Descubre Machu Picchu, Cusco, el Valle Sagrado y más destinos increíbles con guías expertos locales.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tawantinsuyo Peru - Tours por Perú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tawantinsuyo Peru - Descubre la Magia del Perú",
    description:
      "Agencia de turismo especializada en tours por Perú. Descubre Machu Picchu, Cusco, el Valle Sagrado y más destinos increíbles.",
    images: ["/images/twitter-image.jpg"],
    creator: "@tawantinsuyoperu",
  },
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
