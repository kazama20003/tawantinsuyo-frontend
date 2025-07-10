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
  "tours Arequipa",
  "Colca full day",
  "Chivay Arequipa",
  "Cabanaconde",
  "mirador del cóndor",
  "tour Valle del Colca",
  "tours en Arequipa",
  "full day Chivay",
  "excursiones desde Arequipa",
  "tour Colca Cañón",
  "viajes Arequipa Cusco",
  "experiencias andinas",
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
        url: "/screenshot/image.png",
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
    images: ["/screenshot/image.png"],
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
  google: "B9Mxs9XUBbqO50FlTSr3-IIKmRFy1GPukelZD7m9-rA",
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
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#2563eb" />
          <meta name="msapplication-TileColor" content="#2563eb" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
        </head>

      <body className={inter.className}>{children}</body>
    </html>
  )
}
