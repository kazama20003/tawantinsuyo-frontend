import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NODE_ENV === "production" ? "https://tawantinsuyoperu.com" : "http://localhost:3000"

  return {
    name: "Tawantinsuyo Peru - Tours y Experiencias Únicas",
    short_name: "Tawantinsuyo Peru",
    description:
      "Descubre la magia del Perú con nuestros tours especializados. Experiencias únicas en Cusco, Machu Picchu y más destinos increíbles.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait-primary",
    scope: "/",
    lang: "es-PE",
    dir: "ltr",
    categories: ["travel", "tourism", "adventure", "culture", "lifestyle"],
    screenshots: [
      {
        src: `${baseUrl}/screenshot/image.png`,
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Tawantinsuyo Peru - Desktop View",
      },
      {
        src: `${baseUrl}/screenshot/image.png`,
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: "Tawantinsuyo Peru - Mobile View",
      },
    ],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32 48x48",
        type: "image/x-icon",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Ver Tours",
        short_name: "Tours",
        description: "Explora todos nuestros tours disponibles",
        url: "/tours",
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Destinos",
        short_name: "Destinos",
        description: "Descubre destinos increíbles en Perú",
        url: "/destinations",
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Contacto",
        short_name: "Contacto",
        description: "Contáctanos para planificar tu viaje",
        url: "/contact",
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
