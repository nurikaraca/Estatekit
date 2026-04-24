import type { PropertyFilterType, SelectOption } from "../types"

export const propertyTypes: SelectOption<PropertyFilterType>[] = [
  { value: "rent", label: "Rent" },
  { value: "buy", label: "Sell" },
  { value: "sold", label: "Sold" },
]

export const priceOptions = [
  { value: "", label: "Any price" },
  { value: "250000", label: "$250K+" },
  { value: "500000", label: "$500K+" },
  { value: "1000000", label: "$1M+" },
]

export const bathOptions = [
  { value: "", label: "Any baths" },
  { value: "1", label: "1+ baths" },
  { value: "2", label: "2+ baths" },
  { value: "3", label: "3+ baths" },
  { value: "4", label: "4+ baths" },
  { value: "5", label: "5+ baths" },
]

export const sqftOptions = [
  { value: "", label: "Any size" },
  { value: "750", label: "750+ sqft" },
  { value: "1000", label: "1,000+ sqft" },
  { value: "1500", label: "1,500+ sqft" },
  { value: "2000", label: "2,000+ sqft" },
]

export function normalizeType(type?: string): PropertyFilterType {
  if (type === "buy" || type === "rent" || type === "sold") {
    return type
  }

  return "all"
}
