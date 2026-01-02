import { SiteHeader } from "@/components/blocks/home/site-header"
import { HeroSection } from "@/components/blocks/home/hero-section"
import { FeaturesSection } from "@/components/blocks/home/features-section"
import { SiteFooter } from "@/components/blocks/home/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
      <SiteFooter />
    </div>
  )
}