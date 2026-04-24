import type { PropertyItem } from "@/features/property/types"

export const rentalApartmentProperty: PropertyItem = {
  id: "brooklyn-rental-1",
  title: "Williamsburg Riverview Apartment",
  location: "Williamsburg, Brooklyn",
  neighborhoodName: "Williamsburg",
  coordinates: {
    lat: 40.7211,
    lng: -73.9572,
  },
  type: "rent",
  listingType: "rent",
  homeType: "apartment",
  price: 4200,
  beds: 2,
  baths: 2,
  sqft: 1180,
  statusLabel: "For rent",
  availabilityLabel: "Available now",
  lastUpdatedAt: "2026-04-24",
  brokerName: "EstateKit Realty",
  agentName: "Nuri Karaca",
  virtualTourUrl: "https://example.com/tour",
  flags: {
    isPetFriendly: true,
    hasParking: true,
    hasPool: false,
    hasGym: true,
    hasLaundry: true,
  },
  terms: {
    hoaFee: null,
    propertyTaxAnnual: null,
    applicationFee: 75,
    securityDeposit: 4200,
    petDeposit: 300,
    petRent: 50,
    leaseTermMonths: 12,
    utilitiesIncluded: ["Water", "Trash"],
  },
  fees: [
    {
      label: "Parking fee",
      amount: 250,
      cadence: "monthly",
    },
  ],
  amenities: ["Fitness center", "Roof deck", "Package room"],
  features: ["In-unit laundry", "Dishwasher", "Private balcony"],
  petPolicies: [
    {
      label: "Cats allowed",
      amount: 300,
    },
  ],
  schools: [
    {
      name: "PS 84 Jose De Diego",
      rating: 8,
      distance: "0.4 mi",
      level: "elementary",
      students: 560,
    },
  ],
  nearbyPlaces: [
    {
      name: "McCarren Park",
      category: "park",
      distance: "0.3 mi",
    },
  ],
  similarListings: [
    {
      id: "similar-1",
      title: "Northside Loft",
      price: 3900,
      location: "Williamsburg, Brooklyn",
      beds: 1,
      baths: 1,
      sqft: 900,
      homeType: "apartment",
      listingType: "rent",
      image: {
        src: "/property-images/studio.svg",
        alt: "Northside Loft",
      },
    },
  ],
  accent: "from-neutral-200 via-neutral-100 to-white",
  image: {
    src: "/property-images/river-apartment.svg",
    alt: "Riverview exterior",
  },
  images: [
    {
      src: "/property-images/river-apartment.svg",
      alt: "Riverview exterior",
    },
    {
      src: "/property-images/waterfront-one-bed.svg",
      alt: "Living room",
    },
  ],
  description:
    "Bright two-bedroom apartment with oversized windows, open-plan living, and quick access to parks, dining, and transit in Williamsburg.",
  highlights: ["Waterfront views", "Doorman building"],
  neighborhood:
    "Williamsburg blends waterfront parks, independent cafes, restaurants, nightlife, and quick Manhattan access.",
  yearBuilt: 2019,
  lotSize: "",
}

export const buyProperty: PropertyItem = {
  ...rentalApartmentProperty,
  id: "brooklyn-buy-1",
  title: "Townhouse on Berry Street",
  type: "buy",
  listingType: "sale",
  homeType: "house",
  price: 2100000,
  statusLabel: "For sale",
  availabilityLabel: "Active",
  terms: {
    ...rentalApartmentProperty.terms,
    hoaFee: 450,
    propertyTaxAnnual: 18000,
    applicationFee: null,
    securityDeposit: null,
    petDeposit: null,
    petRent: null,
    leaseTermMonths: null,
    utilitiesIncluded: [],
  },
}

export const soldProperty: PropertyItem = {
  ...rentalApartmentProperty,
  id: "brooklyn-sold-1",
  title: "Sold Condo in Greenpoint",
  type: "sold",
  listingType: "sold",
  homeType: "condo",
  price: 1350000,
  statusLabel: "Sold",
  availabilityLabel: "Closed",
}

export const minimalProperty: PropertyItem = {
  ...rentalApartmentProperty,
  id: "minimal-1",
  title: "Minimal Listing",
  flags: {
    isPetFriendly: false,
    hasParking: false,
    hasPool: false,
    hasGym: false,
    hasLaundry: false,
  },
  terms: {
    hoaFee: null,
    propertyTaxAnnual: null,
    applicationFee: null,
    securityDeposit: null,
    petDeposit: null,
    petRent: null,
    leaseTermMonths: null,
    utilitiesIncluded: [],
  },
  amenities: [],
  features: [],
  fees: [],
  petPolicies: [],
  schools: [],
  nearbyPlaces: [],
  similarListings: [],
  images: [
    {
      src: "/property-images/studio.svg",
      alt: "Property image placeholder",
    },
  ],
  image: {
    src: "/property-images/studio.svg",
    alt: "Property image placeholder",
  },
  description: "",
  highlights: [],
  neighborhood: "",
}

export const mockProperties = [
  buyProperty,
  rentalApartmentProperty,
  soldProperty,
]
