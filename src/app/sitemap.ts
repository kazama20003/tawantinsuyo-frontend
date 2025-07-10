import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NODE_ENV === "production" ? "https://tawantinsuyoperu.com" : "http://localhost:3000"

  // Static pages for both languages
  const staticPages = ["", "/tours", "/destinations", "/itineraries", "/about-us", "/contact", "/login", "/register"]

  // Generate URLs for both Spanish (default) and English
  const staticUrls: MetadataRoute.Sitemap = []

  // Spanish URLs (default)
  staticPages.forEach((page) => {
    staticUrls.push({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "daily" : "weekly",
      priority: page === "" ? 1 : 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}${page}`,
          en: `${baseUrl}/en${page}`,
        },
      },
    })
  })

  // English URLs
  staticPages.forEach((page) => {
    staticUrls.push({
      url: `${baseUrl}/en${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "daily" : "weekly",
      priority: page === "" ? 0.9 : 0.7,
      alternates: {
        languages: {
          es: `${baseUrl}${page}`,
          en: `${baseUrl}/en${page}`,
        },
      },
    })
  })

  // Mock dynamic tour pages (replace with actual API call)
  const tourSlugs = [
    "machu-picchu-clasico",
    "camino-inca-4-dias",
    "valle-sagrado-tour",
    "cusco-city-tour",
    "rainbow-mountain",
    "laguna-humantay",
  ]

  const tourUrls: MetadataRoute.Sitemap = []

  tourSlugs.forEach((slug) => {
    // Spanish tour URLs
    tourUrls.push({
      url: `${baseUrl}/tours/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          es: `${baseUrl}/tours/${slug}`,
          en: `${baseUrl}/en/tours/${slug}`,
        },
      },
    })

    // English tour URLs
    tourUrls.push({
      url: `${baseUrl}/en/tours/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/tours/${slug}`,
          en: `${baseUrl}/en/tours/${slug}`,
        },
      },
    })
  })

  // Mock destination pages
  const destinationSlugs = ["cusco", "machu-picchu", "valle-sagrado", "arequipa", "puno", "ica"]

  const destinationUrls: MetadataRoute.Sitemap = []

  destinationSlugs.forEach((slug) => {
    // Spanish destination URLs
    destinationUrls.push({
      url: `${baseUrl}/destinations/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          es: `${baseUrl}/destinations/${slug}`,
          en: `${baseUrl}/en/destinations/${slug}`,
        },
      },
    })

    // English destination URLs
    destinationUrls.push({
      url: `${baseUrl}/en/destinations/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          es: `${baseUrl}/destinations/${slug}`,
          en: `${baseUrl}/en/destinations/${slug}`,
        },
      },
    })
  })

  return [...staticUrls, ...tourUrls, ...destinationUrls]
}
