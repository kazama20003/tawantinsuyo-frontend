import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NODE_ENV === "production" ? "https://tawantinsuyoperu.com" : "http://localhost:3000"

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
      alternates: {
        languages: {
          es: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
      alternates: {
        languages: {
          es: `${baseUrl}/tours`,
          en: `${baseUrl}/en/tours`,
        },
      },
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/destinations`,
          en: `${baseUrl}/en/destinations`,
        },
      },
    },
    {
      url: `${baseUrl}/itineraries`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          es: `${baseUrl}/itineraries`,
          en: `${baseUrl}/en/itineraries`,
        },
      },
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          es: `${baseUrl}/about-us`,
          en: `${baseUrl}/en/about-us`,
        },
      },
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
      alternates: {
        languages: {
          es: `${baseUrl}/contact`,
          en: `${baseUrl}/en/contact`,
        },
      },
    },
  ]

  // Dynamic tour pages (example tours)
  const tourSlugs = [
    "machu-picchu-clasico",
    "camino-inca-4-dias",
    "valle-sagrado-completo",
    "cusco-city-tour",
    "rainbow-mountain-adventure",
    "amazon-jungle-3-days",
  ]

  const tourPages = tourSlugs.map((slug) => ({
    url: `${baseUrl}/tours/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        es: `${baseUrl}/tours/${slug}`,
        en: `${baseUrl}/en/tours/${slug}`,
      },
    },
  }))

  return [...staticPages, ...tourPages]
}
