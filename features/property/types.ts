export type PropertyType = "buy" | "rent" | "sold"
export type PropertyFilterType = "all" | PropertyType
export type PropertyListingType = "sale" | "rent" | "sold"
export type PropertyHomeType =
  | "apartment"
  | "house"
  | "condo"
  | "townhome"
  | "multi_family"
  | "land"
  | "manufactured"

export type SelectOption<TValue extends string = string> = {
  value: TValue
  label: string
}

export type PropertySearchParams = {
  type?: string
  search?: string
  minPrice?: string
  beds?: string
  baths?: string
  minSqft?: string
  propertyCategory?: string | string[]
}

export type PropertyItem = {
  id: string
  title: string
  location: string
  neighborhoodName: string
  coordinates: {
    lat: number
    lng: number
  }
  type: PropertyType
  listingType: PropertyListingType
  homeType: PropertyHomeType
  price: number
  beds: number
  baths: number
  sqft: number
  statusLabel: string
  availabilityLabel: string
  lastUpdatedAt: string
  brokerName: string
  agentName: string
  virtualTourUrl: string
  flags: {
    isPetFriendly: boolean
    hasParking: boolean
    hasPool: boolean
    hasGym: boolean
    hasLaundry: boolean
  }
  terms: {
    hoaFee: number | null
    propertyTaxAnnual: number | null
    applicationFee: number | null
    securityDeposit: number | null
    petDeposit: number | null
    petRent: number | null
    leaseTermMonths: number | null
    utilitiesIncluded: string[]
  }
  fees: Array<{
    label: string
    amount: number | null
    cadence: string
  }>
  amenities: string[]
  features: string[]
  petPolicies: Array<{
    label: string
    amount: number | null
  }>
  schools: Array<{
    name: string
    rating: number | null
    distance: string
    level: string
    students: number | null
  }>
  nearbyPlaces: Array<{
    name: string
    category: string
    distance: string
  }>
  similarListings: Array<{
    id: string
    title: string
    price: number
    location: string
    beds: number
    baths: number
    sqft: number
    homeType: PropertyHomeType
    listingType: PropertyListingType
    image: {
      src: string
      alt: string
    }
  }>
  accent: string
  image: {
    src: string
    alt: string
  }
  images: Array<{
    src: string
    alt: string
  }>
  description: string
  highlights: string[]
  neighborhood: string
  yearBuilt: number
  lotSize: string
}

export type PropertySearchFormProps = {
  activeType: PropertyFilterType
  searchParams: PropertySearchParams
}

export type PropertyToolbarSelectProps = {
  label: string
  name: string
  value: string
  options: SelectOption[]
  showPlaceholder?: boolean
  onValueChange?: (value: string) => void
}
