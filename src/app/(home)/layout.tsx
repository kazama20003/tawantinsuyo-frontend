import type React from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="pt-30 md:pt-36 lg:pt-40">{children}</main>
      <Footer />
    </>
  )
}
