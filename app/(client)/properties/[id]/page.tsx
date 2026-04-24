import { notFound } from "next/navigation"

import { PropertyDetail } from "@/features/property/components/detail/PropertyDetail"
import { getProperty } from "@/features/property/services/property-service"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    return {
      title: "Property not found",
    }
  }

  return {
    title: `${property.title} | EstateKit`,
    description: property.description,
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  return <PropertyDetail property={property} />
}
