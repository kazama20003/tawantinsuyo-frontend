import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tawantinsuyo Peru - Tours y Experiencias Únicas",
    short_name: "Tawantinsuyo Peru",
    description:
      "Descubre la magia del Perú con nuestros tours especializados. Experiencias únicas en Cusco, Machu Picchu y más destinos increíbles.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait",
    scope: "/",
    lang: "es-PE",
    categories: ["travel", "tourism", "adventure", "culture"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Ver Tours",
        short_name: "Tours",
        description: "Explora todos nuestros tours disponibles",
        url: "/tours",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Destinos",
        short_name: "Destinos",
        description: "Descubre destinos increíbles en Perú",
        url: "/destinations",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Contacto",
        short_name: "Contacto",
        description: "Contáctanos para planificar tu viaje",
        url: "/contact",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
