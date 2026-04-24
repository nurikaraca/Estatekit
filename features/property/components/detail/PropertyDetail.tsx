import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

import { PropertyImageGallery } from "./PropertyImageGallery"
import {
  PropertyContactCard,
  PropertyDetailAccordion,
  PropertyFeatureTabs,
  PropertyFeesAndPolicies,
  PropertyHighlights,
  PropertyNeighborhoodMap,
  PropertyOverview,
  PropertyQuickFacts,
  PropertySchools,
  PropertySimilarListings,
} from "./PropertyDetailSections"
import type { PropertyItem } from "../../types"

type PropertyDetailProps = {
  property: PropertyItem
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_left,_rgba(244,244,245,0.95),_rgba(255,255,255,1)_42%,_rgba(244,244,245,0.7)_100%)] px-4 py-4 sm:px-6 dark:bg-[radial-gradient(circle_at_top_left,_rgba(38,38,38,1),_rgba(10,10,10,1)_48%,_rgba(23,23,23,1)_100%)]">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/properties">
            <ArrowLeft />
            Back to properties
          </Link>
        </Button>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="space-y-6">
            <PropertyImageGallery title={property.title} images={property.images} />
            <PropertyQuickFacts property={property} />
            <PropertyHighlights property={property} />
            <PropertyOverview property={property} />
            <PropertyFeatureTabs property={property} />
            <PropertyFeesAndPolicies property={property} />
            <PropertyDetailAccordion property={property} />
            <PropertyNeighborhoodMap property={property} />
            <PropertySchools property={property} />
            <PropertySimilarListings property={property} />
          </main>

          <PropertyContactCard property={property} />
        </div>
      </div>
    </section>
  )
}
