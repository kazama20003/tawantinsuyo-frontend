import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === "production" ? "https://tawantinsuyoperu.com" : "http://localhost:3000"

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/api/", "/admin/", "/_next/", "/private/", "/temp/", "/*.json$", "/login", "/register"],
        crawlDelay: 1,
      },
      {
        userAgent: "Bingbot",
        allow: ["/"],
        disallow: ["/api/", "/admin/", "/_next/", "/private/", "/temp/", "/*.json$", "/login", "/register"],
        crawlDelay: 2,
      },
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/", "/admin/", "/_next/", "/private/", "/temp/", "/*.json$", "/login", "/register"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
