import type React from "react"
import type { Metadata } from "next"
import { api } from "@/lib/axiosInstance"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  try {
    const response = await api.get(`/tours/slug/${slug}`)
    let tourData = response.data

    // Validar estructura de respuesta
    if (tourData && typeof tourData === "object" && !Array.isArray(tourData)) {
      if (tourData.data) {
        tourData = tourData.data
      } else if (tourData.tour) {
        tourData = tourData.tour
      }
    }

    if (!tourData || !tourData._id) {
      return {
        title: "Tour no encontrado | Tawantinsuyo Peru",
        description: "El tour que buscas no existe o ha sido eliminado.",
      }
    }

    const title = `${tourData.title} | Tawantinsuyo Peru`
    const description = tourData.subtitle || tourData.description || `Descubre ${tourData.title} con Tawantinsuyo Peru`
    const imageUrl = tourData.imageUrl || "/images/tawantinsuyo-logo.png"

    return {
      title,
      description,
      keywords: [
        tourData.title,
        tourData.region,
        tourData.location,
        tourData.category,
        "Peru",
        "tours",
        "turismo",
        "Tawantinsuyo",
      ].join(", "),
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: tourData.title,
          },
        ],
        type: "website",
        locale: "es_PE",
        siteName: "Tawantinsuyo Peru",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://tawantinsuyoperu.com/tours/${slug}`,
        languages: {
          "es-PE": `https://tawantinsuyoperu.com/tours/${slug}`,
          "en-US": `https://tawantinsuyoperu.com/en/tours/${slug}`,
        },
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Tour | Tawantinsuyo Peru",
      description: "Descubre increíbles tours en Perú con Tawantinsuyo Peru",
    }
  }
}

export default function TourSlugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
