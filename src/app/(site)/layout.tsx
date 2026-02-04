import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Toaster } from "@/components/ui/toaster"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 md:pt-20">{children}</main>
      <Footer />
      <Toaster />
    </>
  )
}
