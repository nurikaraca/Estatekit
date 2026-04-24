import PropertyExplorer from "@/features/property/components/explorer/PropertyExplorer"
import { getProperties } from "@/features/property/services/property-service"

type PropertySearchParams = Promise<{
  type?: string
  search?: string
  minPrice?: string
  beds?: string
  baths?: string
  minSqft?: string
  propertyCategory?: string | string[]
}>

const PropertiesPage = async ({ searchParams,}
  : { searchParams:PropertySearchParams}) => {
  const resolvedSearchParams = await searchParams
  const properties = await getProperties()

  return (
    <PropertyExplorer
      properties={properties}
      searchParams={resolvedSearchParams}
    />
  )
}

export default PropertiesPage
