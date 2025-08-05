import type React from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  )
}
