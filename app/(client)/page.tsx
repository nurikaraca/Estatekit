import Footer from "@/components/layout/footer/Footer"
import CTA from "@/features/marketing/CTA"
import Features from "@/features/marketing/Features"
import Hero from "@/features/marketing/Hero"
import MarketingLightTrails from "@/features/marketing/MarketingLightTrails"
import Pricing from "@/features/marketing/Pricing"
import Stats from "@/features/marketing/Stats"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-heading-md">
      <MarketingLightTrails />
      <div className="relative z-10">
        <Hero />
        <Stats />
        <Features />
        <Pricing />
        <CTA />
        <Footer />
      </div>
    </div>
  )
}
