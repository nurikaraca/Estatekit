"use client"

import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  priceOptions,
  propertyTypes,
  sqftOptions,
} from "../../lib/property-filter-options"
import { PropertyBathsPopover } from "./PropertyBathsPopover"
import {
  PropertyCategoryMenu,
  propertyCategoryOptions,
} from "./PropertyCategoryMenu"
import { PropertyFilterPopover } from "./PropertyFilterPopover"
import { PropertyLocationCommand } from "./PropertyLocationCommand"
import { PropertyMobileFilters } from "./PropertyMobileFilters"
import { PropertyRoomsPopover } from "./PropertyRoomsPopover"
import { PropertyToolbarSelect } from "./PropertyToolbarSelect"
import type { PropertyFilterType, PropertySearchFormProps } from "../../types"

type FilterState = {
  type: PropertyFilterType
  search: string
  minPrice: string
  beds: string
  baths: string
  minSqft: string
  propertyCategories: string[]
}

function normalizeMultiValue(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value
  }

  return value ? [value] : []
}

function getInitialFilters({
  activeType,
  searchParams,
}: PropertySearchFormProps): FilterState {
  return {
    type: activeType,
    search: searchParams.search ?? "",
    minPrice: searchParams.minPrice ?? "",
    beds: searchParams.beds ?? "",
    baths: searchParams.baths ?? "",
    minSqft: searchParams.minSqft ?? "",
    propertyCategories:
      normalizeMultiValue(searchParams.propertyCategory).length > 0
        ? normalizeMultiValue(searchParams.propertyCategory)
        : propertyCategoryOptions.map((option) => option.value),
  }
}

export function PropertySearchForm({
  activeType,
  searchParams,
}: PropertySearchFormProps) {
  const formId = "property-search-form"
  const [filters, setFilters] = useState(() =>
    getInitialFilters({ activeType, searchParams })
  )

  const activeFilterCount = useMemo(() => {
    const baseCount = [
      filters.minPrice,
      filters.beds,
      filters.baths,
      filters.minSqft,
    ].filter(Boolean).length
    const categoryCount =
      filters.propertyCategories.length === propertyCategoryOptions.length
        ? 0
        : 1

    return baseCount + categoryCount
  }, [filters])

  const renderFilterControls = () => (
    <>
      <PropertyToolbarSelect
        label="Listing"
        name="type"
        value={filters.type}
        options={propertyTypes}
        showPlaceholder={false}
        onValueChange={(type) =>
          setFilters((currentFilters) => ({
            ...currentFilters,
            type: type as PropertyFilterType,
          }))
        }
      />
      <PropertyToolbarSelect
        label="Price"
        name="minPrice"
        value={filters.minPrice}
        options={priceOptions}
        onValueChange={(minPrice) =>
          setFilters((currentFilters) => ({ ...currentFilters, minPrice }))
        }
      />
      <PropertyRoomsPopover
        value={filters.beds}
        onValueChange={(beds) =>
          setFilters((currentFilters) => ({ ...currentFilters, beds }))
        }
      />
      <PropertyBathsPopover
        value={filters.baths}
        onValueChange={(baths) =>
          setFilters((currentFilters) => ({ ...currentFilters, baths }))
        }
      />
      <PropertyCategoryMenu
        formId={formId}
        selectedValues={filters.propertyCategories}
        onSelectedValuesChange={(propertyCategories) =>
          setFilters((currentFilters) => ({
            ...currentFilters,
            propertyCategories,
          }))
        }
      />
      <PropertyFilterPopover
        label="More"
        value={filters.minSqft}
        options={sqftOptions}
        onValueChange={(minSqft) =>
          setFilters((currentFilters) => ({ ...currentFilters, minSqft }))
        }
      />
    </>
  )

  return (
    <form
      action="/properties"
      id={formId}
      className="rounded-[1.75rem] border border-black/5 bg-white/85 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
    >
      <input type="hidden" name="search" value={filters.search} />
      <input type="hidden" name="type" value={filters.type} />
      <input type="hidden" name="minPrice" value={filters.minPrice} />
      <input type="hidden" name="beds" value={filters.beds} />
      <input type="hidden" name="baths" value={filters.baths} />
      <input type="hidden" name="minSqft" value={filters.minSqft} />
      {filters.propertyCategories.map((category) => (
        <input
          key={category}
          type="hidden"
          name="propertyCategory"
          value={category}
        />
      ))}

      <div className="flex flex-wrap items-center gap-2">
        <PropertyLocationCommand
          value={filters.search}
          onValueChange={(search) =>
            setFilters((currentFilters) => ({ ...currentFilters, search }))
          }
        />

        <div className="hidden flex-wrap items-center gap-2 md:flex">
          {renderFilterControls()}
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-full px-5 text-base font-semibold"
          >
            Save search
          </Button>
        </div>

        <PropertyMobileFilters activeFilterCount={activeFilterCount}>
          {renderFilterControls()}
          <Button
            type="submit"
            form={formId}
            className="h-12 rounded-full text-base"
          >
            View results
          </Button>
        </PropertyMobileFilters>

        {activeFilterCount > 0 ? (
          <Badge variant="secondary" className="ml-auto hidden h-8 px-3 md:flex">
            {activeFilterCount} active
          </Badge>
        ) : null}
      </div>
    </form>
  )
}
