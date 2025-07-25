import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {

  return {
    name: "Tawantinsuyo Peru - Tours y Experiencias Auténticas",
    short_name: "Tawantinsuyo Peru",
    description:
      "Descubre el Perú auténtico con Tawantinsuyo Peru. Tours únicos, experiencias culturales y aventuras inolvidables en Machu Picchu, Cusco y más destinos increíbles.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait-primary",
    scope: "/",
    lang: "es",
    dir: "ltr",
    categories: ["travel", "tourism", "culture", "adventure"],

    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32",
        type: "image/x-icon",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],

    screenshots: [
      {
        src: "/screenshot/image.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Tawantinsuyo Peru - Vista de escritorio",
      },
      {
        src: "/screenshot/image.png",
        sizes: "375x812",
        type: "image/png",
        form_factor: "narrow",
        label: "Tawantinsuyo Peru - Vista móvil",
      },
    ],

    shortcuts: [
      {
        name: "Tours",
        short_name: "Tours",
        description: "Explora nuestros tours disponibles",
        url: "/tours",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Destinos",
        short_name: "Destinos",
        description: "Descubre destinos increíbles",
        url: "/destinations",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Contacto",
        short_name: "Contacto",
        description: "Contáctanos para más información",
        url: "/contact",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],

    related_applications: [],
    prefer_related_applications: false,

    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],

    protocol_handlers: [],

    launch_handler: {
      client_mode: "navigate-existing",
    },
  }
}
