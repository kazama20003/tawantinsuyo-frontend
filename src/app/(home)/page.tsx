"use client"
import HeroSection from "@/components/hero-section"
import PackagesSection from "@/components/packages-section"
import ExperienceSection from "@/components/experience-section"
import GuideSection from "@/components/guide-section"
import TestimonialsSection from "@/components/testimonials-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-blue-50 overflow-x-hidden">
      {/* Add padding-top to account for fixed header */}
      
        {/* Hero Section Component - Full Screen */}
        <HeroSection />
        {/* Packages Section */}
        <PackagesSection />
        {/* Experience Section */}
        <ExperienceSection />
        {/* Guide Section - New */}
        <GuideSection />
        {/* Testimonials Section */}
        <TestimonialsSection />
      
    </div>
  )
}
