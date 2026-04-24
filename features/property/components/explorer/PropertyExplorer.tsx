import { PropertyCard } from "./PropertyCard"
import { PropertyEmptyState } from "./PropertyEmptyState"
import { PropertyMapPanel } from "./PropertyMapPanel"
import { PropertySearchForm } from "../search/PropertySearchForm"
import { normalizeType } from "../../lib/property-filter-options"
import type { PropertyItem, PropertySearchParams } from "../../types"

export default function PropertyExplorer({
  properties,
  searchParams,
}: {
  properties: PropertyItem[]
  searchParams: PropertySearchParams
}) {
  const activeType = normalizeType(searchParams.type)
  const searchQuery = searchParams.search?.trim().toLowerCase() ?? ""
  const minimumPrice = Number(searchParams.minPrice ?? 0)
  const minimumBeds = Number(searchParams.beds ?? 0)
  const minimumBaths = Number(searchParams.baths ?? 0)
  const minimumSqft = Number(searchParams.minSqft ?? 0)

  const filteredProperties = properties.filter((property) => {
    const matchesType = activeType === "all" || property.type === activeType
    const matchesSearch =
      searchQuery.length === 0 ||
      property.title.toLowerCase().includes(searchQuery) ||
      property.location.toLowerCase().includes(searchQuery)
    const matchesPrice = minimumPrice === 0 || property.price >= minimumPrice
    const matchesBeds = minimumBeds === 0 || property.beds >= minimumBeds
    const matchesBaths = minimumBaths === 0 || property.baths >= minimumBaths
    const matchesSqft = minimumSqft === 0 || property.sqft >= minimumSqft

    return (
      matchesType &&
      matchesSearch &&
      matchesPrice &&
      matchesBeds &&
      matchesBaths &&
      matchesSqft
    )
  })

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_left,_rgba(244,244,245,0.95),_rgba(255,255,255,1)_42%,_rgba(244,244,245,0.7)_100%)] px-2 py-3 sm:px-3 lg:px-4 dark:bg-[radial-gradient(circle_at_top_left,_rgba(38,38,38,1),_rgba(10,10,10,1)_48%,_rgba(23,23,23,1)_100%)]">
      <div className="mx-auto flex w-full max-w-[1760px] flex-col gap-3">
        <PropertySearchForm
          activeType={activeType}
          searchParams={searchParams}
        />

        <div className="grid gap-3 xl:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-[1.25rem] border border-black/5 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Results
                </p>
                <p className="mt-1 text-base font-medium text-neutral-950 dark:text-white">
                  {filteredProperties.length} curated matches
                </p>
              </div>
              <p className="text-base text-neutral-500 dark:text-neutral-300">
                Williamsburg, Brooklyn
              </p>
            </div>

            {filteredProperties.length > 0 ? (
              filteredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))
            ) : (
              <PropertyEmptyState />
            )}
          </div>

          <PropertyMapPanel properties={filteredProperties} />
        </div>
      </div>
    </section>
  )
}
