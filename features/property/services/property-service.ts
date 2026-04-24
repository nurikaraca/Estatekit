import { createSupabaseServerClient } from "@/lib/supabase/server"
import { tryCreateSupabaseAdminClient } from "@/lib/supabase/admin"

import type {
  PropertyHomeType,
  PropertyItem,
  PropertyListingType,
  PropertyType,
} from "../types"

const PROPERTY_IMAGE_BUCKET = "property-images"

type PropertyImageRow = {
  image_url?: string | null
  public_url?: string | null
  storage_path?: string | null
  file_path?: string | null
  url?: string | null
  src?: string | null
  alt?: string | null
  alt_text?: string | null
  sort_order?: number | null
}

type PropertyLabelRow = {
  label?: string | null
  name?: string | null
  category?: string | null
}

type PropertyFeeRow = {
  label?: string | null
  fee_type?: string | null
  amount?: number | null
  cadence?: string | null
  note?: string | null
}

type PropertyPetPolicyRow = {
  label?: string | null
  pet_type?: string | null
  allowed?: boolean | null
  amount?: number | null
  deposit?: number | null
  rent?: number | null
  note?: string | null
}

type PropertySchoolRow = {
  name?: string | null
  school_name?: string | null
  rating?: number | null
  distance?: string | null
  distance_miles?: number | null
  level?: string | null
  students?: number | null
  students_count?: number | null
}

type PropertyNearbyPlaceRow = {
  name?: string | null
  place_name?: string | null
  category?: string | null
  distance?: string | null
  distance_miles?: number | null
}

type PropertyRow = {
  id: number | string
  slug?: string | null
  title: string
  location: string
  neighborhood_name?: string | null
  type: string | null
  listing_type?: string | null
  home_type?: string | null
  price: number
  beds: number
  baths: number
  sqft: number
  status_label?: string | null
  availability_label?: string | null
  last_updated_at?: string | null
  broker_name?: string | null
  agent_name?: string | null
  virtual_tour_url?: string | null
  is_pet_friendly?: boolean | null
  has_parking?: boolean | null
  has_pool?: boolean | null
  has_gym?: boolean | null
  has_laundry?: boolean | null
  hoa_fee?: number | null
  property_tax_annual?: number | null
  application_fee?: number | null
  security_deposit?: number | null
  pet_deposit?: number | null
  pet_rent?: number | null
  lease_term_months?: number | null
  amenities?: string[] | null
  features?: string[] | null
  pet_policies?: string[] | null
  schools?: PropertySchoolRow[] | null
  nearby_places?: PropertyNearbyPlaceRow[] | null
  image_url?: string | null
  description?: string | null
  highlights?: string[] | null
  neighborhood?: string | null
  year_built?: number | null
  lot_size?: string | null
  latitude?: number | null
  longitude?: number | null
  property_images?: PropertyImageRow[] | PropertyImageRow | null
  property_amenities?: PropertyLabelRow[] | PropertyLabelRow | null
  property_fees?: PropertyFeeRow[] | PropertyFeeRow | null
  property_pet_policies?: PropertyPetPolicyRow[] | PropertyPetPolicyRow | null
  property_schools?: PropertySchoolRow[] | PropertySchoolRow | null
  property_nearby_places?: PropertyNearbyPlaceRow[] | PropertyNearbyPlaceRow | null
}

const fallbackImage = {
  src: "/property-images/williamsburg-loft.svg",
  alt: "Property image placeholder",
}

function getPublicStorageUrl(storagePath?: string | null) {
  if (!storagePath) {
    return null
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    return null
  }

  return `${supabaseUrl}/storage/v1/object/public/${PROPERTY_IMAGE_BUCKET}/${storagePath}`
}

function normalizePropertyType(type?: string | null, statusLabel?: string | null): PropertyType {
  if (type === "buy" || type === "rent" || type === "sold") {
    return type
  }

  const normalizedStatus = statusLabel?.toLowerCase() ?? ""

  if (normalizedStatus.includes("rent")) {
    return "rent"
  }

  if (normalizedStatus.includes("sold")) {
    return "sold"
  }

  return "buy"
}

function normalizeListingType(
  listingType?: string | null,
  type?: string | null,
  statusLabel?: string | null
): PropertyListingType {
  if (listingType === "sale" || listingType === "rent" || listingType === "sold") {
    return listingType
  }

  const normalizedType = normalizePropertyType(type, statusLabel)

  if (normalizedType === "rent" || normalizedType === "sold") {
    return normalizedType
  }

  return "sale"
}

function normalizeHomeType(type?: string | null): PropertyHomeType {
  if (
    type === "apartment" ||
    type === "house" ||
    type === "condo" ||
    type === "townhome" ||
    type === "multi_family" ||
    type === "land" ||
    type === "manufactured"
  ) {
    return type
  }

  return "house"
}

function asArray<TValue>(value?: TValue[] | TValue | null) {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

function getLabelRows(rows?: PropertyLabelRow[] | PropertyLabelRow | null) {
  return asArray(rows)
    .map((row) => row.label ?? row.name)
    .filter((label): label is string => Boolean(label))
}

function getLabelsByCategory(
  rows: PropertyLabelRow[] | PropertyLabelRow | null | undefined,
  category: string
) {
  return asArray(rows)
    .filter((row) => row.category === category)
    .map((row) => row.label ?? row.name)
    .filter((label): label is string => Boolean(label))
}

function getSchoolRows(row: PropertyRow) {
  return [
    ...asArray(row.property_schools),
    ...asArray(row.schools),
  ]
}

function getNearbyPlaceRows(row: PropertyRow) {
  return [
    ...asArray(row.property_nearby_places),
    ...asArray(row.nearby_places),
  ]
}

function mapPropertyRow(row: PropertyRow): PropertyItem {
  const type = normalizePropertyType(row.type, row.status_label)
  const listingType = normalizeListingType(row.listing_type, row.type, row.status_label)
  const homeType = normalizeHomeType(row.home_type)
  const propertyImages = asArray(row.property_images)
  const sortedImages = [...propertyImages].sort(
    (firstImage, secondImage) =>
      Number(firstImage.sort_order ?? 0) - Number(secondImage.sort_order ?? 0)
  )
  const images = sortedImages
    .map((image, index) => {
      const src =
        image.public_url ??
        image.image_url ??
        image.url ??
        image.src ??
        getPublicStorageUrl(image.storage_path ?? image.file_path)

      if (!src) {
        return null
      }

      return {
        src,
        alt: image.alt ?? image.alt_text ?? `${row.title} image ${index + 1}`,
      }
    })
    .filter((image): image is { src: string; alt: string } => Boolean(image))
  const fallbackImages =
    images.length > 0
      ? images
      : row.image_url
        ? [{ src: row.image_url, alt: `${row.title} image` }]
        : [fallbackImage]
  const coverImage = fallbackImages[0]

  const relationAmenities = getLabelRows(row.property_amenities)
  const relationFeatures = getLabelsByCategory(row.property_amenities, "unit")
  const fees = asArray(row.property_fees)
    .filter((fee) => fee.label ?? fee.fee_type)
    .map((fee) => ({
      label: fee.label ?? fee.note ?? fee.fee_type?.replaceAll("_", " ") ?? "Fee",
      amount: fee.amount ?? null,
      cadence: fee.cadence ?? fee.note ?? "",
    }))
  const petPolicies = asArray(row.property_pet_policies)
    .filter((policy) => policy.label ?? policy.pet_type)
    .map((policy) => ({
      label:
        policy.label ??
        policy.note ??
        `${policy.pet_type?.replaceAll("_", " ") ?? "Pet"} ${policy.allowed ? "allowed" : "not allowed"}`,
      amount: policy.amount ?? policy.deposit ?? policy.rent ?? null,
    }))
  const schools = getSchoolRows(row)
  const nearbyPlaces = getNearbyPlaceRows(row)

  return {
    id: row.slug || String(row.id),
    title: row.title,
    location: row.location,
    neighborhoodName: row.neighborhood_name ?? "Williamsburg",
    coordinates: {
      lat: Number(row.latitude ?? 40.7171),
      lng: Number(row.longitude ?? -73.9588),
    },
    type,
    listingType,
    homeType,
    price: Number(row.price),
    beds: Number(row.beds),
    baths: Number(row.baths),
    sqft: Number(row.sqft),
    statusLabel: row.status_label ?? "For sale",
    availabilityLabel:
      row.availability_label ?? (listingType === "rent" ? "Available now" : "Active"),
    lastUpdatedAt: row.last_updated_at ?? "",
    brokerName: row.broker_name ?? "Estatekit Realty",
    agentName: row.agent_name ?? "Listing agent",
    virtualTourUrl: row.virtual_tour_url ?? "",
    flags: {
      isPetFriendly: Boolean(row.is_pet_friendly ?? listingType === "rent"),
      hasParking: Boolean(row.has_parking ?? true),
      hasPool: Boolean(row.has_pool ?? false),
      hasGym: Boolean(row.has_gym ?? listingType === "rent"),
      hasLaundry: Boolean(row.has_laundry ?? true),
    },
    terms: {
      hoaFee: row.hoa_fee ?? null,
      propertyTaxAnnual: row.property_tax_annual ?? null,
      applicationFee: row.application_fee ?? null,
      securityDeposit: row.security_deposit ?? null,
      petDeposit: row.pet_deposit ?? null,
      petRent: row.pet_rent ?? null,
      leaseTermMonths: row.lease_term_months ?? null,
      utilitiesIncluded: getLabelsByCategory(row.property_amenities, "services"),
    },
    fees,
    amenities:
      relationAmenities.length > 0
        ? relationAmenities
        : row.amenities && row.amenities.length > 0
          ? row.amenities
          : [],
    features:
      relationFeatures.length > 0
        ? relationFeatures
        : row.features && row.features.length > 0
          ? row.features
          : [],
    petPolicies:
      petPolicies.length > 0
        ? petPolicies
        : row.pet_policies && row.pet_policies.length > 0
          ? row.pet_policies.map((label) => ({ label, amount: null }))
          : [],
    schools:
      schools.map((school) => ({
        name: school.name ?? school.school_name ?? "Neighborhood School",
        rating: school.rating ?? null,
        distance:
          school.distance ??
          (typeof school.distance_miles === "number"
            ? `${school.distance_miles} mi`
            : "Nearby"),
        level: school.level ?? "School",
        students: school.students ?? school.students_count ?? null,
      })),
    nearbyPlaces:
      nearbyPlaces.map((place) => ({
        name: place.name ?? place.place_name ?? "Nearby place",
        category: place.category ?? "Local",
        distance:
          place.distance ??
          (typeof place.distance_miles === "number"
            ? `${place.distance_miles} mi`
            : "Nearby"),
      })),
    similarListings: [],
    accent: "from-neutral-200 via-neutral-100 to-white",
    image: coverImage,
    images: fallbackImages,
    description: row.description ?? "",
    highlights: row.highlights ?? [],
    neighborhood: row.neighborhood ?? "",
    yearBuilt: Number(row.year_built ?? 0),
    lotSize: row.lot_size ?? "",
  }
}

function mergePropertyImages(
  property: PropertyItem,
  images: Array<{ src: string; alt: string }>
) {
  const mergedImages = [...property.images]
  const existingImageUrls = new Set(mergedImages.map((image) => image.src))

  images.forEach((image) => {
    if (!existingImageUrls.has(image.src)) {
      mergedImages.push(image)
      existingImageUrls.add(image.src)
    }
  })

  return {
    ...property,
    image: mergedImages[0] ?? property.image,
    images: mergedImages.length > 0 ? mergedImages : property.images,
  }
}

async function getStorageImagesForProperty(row: PropertyRow) {
  const { supabase } = tryCreateSupabaseAdminClient()

  if (!supabase) {
    return []
  }

  const folder = String(row.id)
  const { data, error } = await supabase.storage
    .from(PROPERTY_IMAGE_BUCKET)
    .list(folder, {
      limit: 100,
      sortBy: { column: "name", order: "asc" },
    })

  if (error || !data) {
    return []
  }

  return data
    .filter((file) => file.name && file.metadata)
    .map((file, index) => {
      const storagePath = `${folder}/${file.name}`

      return {
        src:
          supabase.storage.from(PROPERTY_IMAGE_BUCKET).getPublicUrl(storagePath)
            .data.publicUrl,
        alt: `${row.title} image ${index + 1}`,
      }
    })
}

async function getRelatedRows<TValue>(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  table: string,
  propertyId: number | string
) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("property_id", propertyId)

  if (error) {
    return []
  }

  return (data ?? []) as TValue[]
}

async function getPropertyRelations(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  propertyId: number | string
) {
  const [
    amenities,
    fees,
    petPolicies,
    schools,
    nearbyPlaces,
  ] = await Promise.all([
    getRelatedRows<PropertyLabelRow>(supabase, "property_amenities", propertyId),
    getRelatedRows<PropertyFeeRow>(supabase, "property_fees", propertyId),
    getRelatedRows<PropertyPetPolicyRow>(supabase, "property_pet_policies", propertyId),
    getRelatedRows<PropertySchoolRow>(supabase, "property_schools", propertyId),
    getRelatedRows<PropertyNearbyPlaceRow>(
      supabase,
      "property_nearby_places",
      propertyId
    ),
  ])

  return {
    property_amenities: amenities,
    property_fees: fees,
    property_pet_policies: petPolicies,
    property_schools: schools,
    property_nearby_places: nearbyPlaces,
  } satisfies Partial<PropertyRow>
}

export async function getProperties() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as PropertyRow[]).map(mapPropertyRow)
}

export async function getProperty(id: string) {
  const supabase = await createSupabaseServerClient()
  const query = supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("approval_status", "approved")

  const { data, error } = /^\d+$/.test(id)
    ? await query.or(`id.eq.${id},slug.eq.${id}`).maybeSingle()
    : await query.eq("slug", id).maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    return null
  }

  const baseRow = data as PropertyRow
  const relations = await getPropertyRelations(supabase, baseRow.id)
  const row = {
    ...baseRow,
    ...relations,
  }
  const property = mapPropertyRow(row)
  const storageImages = await getStorageImagesForProperty(row)
  const propertyWithImages = mergePropertyImages(property, storageImages)

  const { data: similarData } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("approval_status", "approved")
    .eq("listing_type", row.listing_type ?? property.listingType)
    .eq("home_type", row.home_type ?? property.homeType)
    .neq("id", row.id)
    .gte("price", Math.max(Math.round(property.price * 0.75), 0))
    .lte("price", Math.round(property.price * 1.35))
    .limit(3)

  return {
    ...propertyWithImages,
    similarListings: ((similarData ?? []) as PropertyRow[]).map((similarRow) => {
      const similar = mapPropertyRow(similarRow)

      return {
        id: similar.id,
        title: similar.title,
        price: similar.price,
        location: similar.location,
        beds: similar.beds,
        baths: similar.baths,
        sqft: similar.sqft,
        homeType: similar.homeType,
        listingType: similar.listingType,
        image: similar.image,
      }
    }),
  }
}
