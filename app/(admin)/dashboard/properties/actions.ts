"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { requireAdmin } from "@/lib/supabase/auth"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

const PROPERTY_IMAGE_BUCKET = "property-images"

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

function getNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key) ?? 0)

  return Number.isFinite(value) ? value : 0
}

function getOptionalNumber(formData: FormData, key: string) {
  const rawValue = String(formData.get(key) ?? "").trim()

  if (!rawValue) {
    return null
  }

  const value = Number(rawValue)

  return Number.isFinite(value) ? value : null
}

function getLines(formData: FormData, key: string) {
  return getString(formData, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function getDelimitedLines(formData: FormData, key: string) {
  return getLines(formData, key).map((line) =>
    line.split("|").map((part) => part.trim())
  )
}

function parseOptionalAmount(value?: string) {
  if (!value) {
    return null
  }

  const amount = Number(value)

  return Number.isFinite(amount) ? amount : null
}

const feeTypeMap: Record<string, string> = {
  application: "application_fee",
  "application fee": "application_fee",
  security: "security_deposit",
  "security deposit": "security_deposit",
  pet: "pet_deposit",
  "pet deposit": "pet_deposit",
  "pet rent": "pet_rent",
  parking: "parking_fee",
  "parking fee": "parking_fee",
  admin: "admin_fee",
  "admin fee": "admin_fee",
  hoa: "hoa_fee",
  "hoa fee": "hoa_fee",
}

const nearbyCategoryMap: Record<string, string> = {
  restaurant: "restaurant",
  restaurants: "restaurant",
  park: "park",
  parks: "park",
  shopping: "shopping",
  nightlife: "nightlife",
  fitness: "fitness",
  school: "school",
  schools: "school",
  transit: "transit",
}

function normalizeFeeType(value?: string) {
  return feeTypeMap[value?.toLowerCase() ?? ""] ?? "other"
}

function normalizeNearbyCategory(value?: string) {
  return nearbyCategoryMap[value?.toLowerCase() ?? ""] ?? "other"
}

function normalizePetType(value?: string) {
  const normalized = value?.toLowerCase().replaceAll(" ", "_") ?? ""

  if (normalized.includes("cat")) {
    return "cats"
  }

  if (normalized.includes("large")) {
    return "large_dogs"
  }

  if (normalized.includes("dog")) {
    return "small_dogs"
  }

  return "other"
}

function normalizeSchoolLevel(value?: string) {
  const normalized = value?.toLowerCase() ?? ""

  if (normalized.includes("elementary")) {
    return "elementary"
  }

  if (normalized.includes("middle")) {
    return "middle"
  }

  if (normalized.includes("high")) {
    return "high"
  }

  if (normalized.includes("private")) {
    return "private"
  }

  return "other"
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

function getSafeFileName(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"

  return `${randomUUID()}.${extension}`
}

async function insertPropertyImageMetadata({
  propertyId,
  storagePath,
  publicUrl,
  sortOrder,
}: {
  propertyId: string | number
  storagePath: string
  publicUrl: string
  sortOrder: number
}) {
  const supabase = createSupabaseAdminClient()
  const insertAttempts = [
    {
      property_id: propertyId,
      image_url: publicUrl,
      file_path: storagePath,
      is_cover: sortOrder === 0,
      sort_order: sortOrder,
    },
    {
      property_id: propertyId,
      storage_path: storagePath,
      public_url: publicUrl,
      sort_order: sortOrder,
    },
    {
      property_id: propertyId,
      storage_path: storagePath,
      public_url: publicUrl,
    },
    {
      property_id: propertyId,
      storage_path: storagePath,
      image_url: publicUrl,
      sort_order: sortOrder,
    },
    {
      property_id: propertyId,
      storage_path: storagePath,
      image_url: publicUrl,
    },
    {
      property_id: propertyId,
      storage_path: storagePath,
      sort_order: sortOrder,
    },
    {
      property_id: propertyId,
      storage_path: storagePath,
    },
    {
      property_id: propertyId,
      image_url: publicUrl,
      sort_order: sortOrder,
    },
    {
      property_id: propertyId,
      image_url: publicUrl,
    },
  ]

  for (const payload of insertAttempts) {
    const { error } = await supabase.from("property_images").insert(payload)

    if (!error) {
      return
    }
  }

  console.error("Property image metadata insert failed for:", storagePath)
}

async function insertRelatedRows(
  table: string,
  rows: Array<Record<string, string | number | boolean | null>>
) {
  if (rows.length === 0) {
    return
  }

  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from(table).insert(rows)

  if (error) {
    throw new Error(error.message)
  }
}

export async function createPropertyAction(formData: FormData) {
  const adminProfile = await requireAdmin()

  const supabase = createSupabaseAdminClient()
  const title = getString(formData, "title")
  const slug = slugify(getString(formData, "slug") || title)
  const highlights = getString(formData, "highlights")
    .split("\n")
    .map((highlight) => highlight.trim())
    .filter(Boolean)

  const propertyPayload = {
    slug,
    title,
    location: getString(formData, "location"),
    neighborhood_name: getString(formData, "neighborhoodName"),
    type: getString(formData, "type"),
    listing_type: getString(formData, "listingType"),
    home_type: getString(formData, "homeType"),
    price: getNumber(formData, "price"),
    beds: getNumber(formData, "beds"),
    baths: getNumber(formData, "baths"),
    sqft: getNumber(formData, "sqft"),
    status_label: getString(formData, "statusLabel"),
    availability_label: getString(formData, "availabilityLabel"),
    broker_name: getString(formData, "brokerName"),
    agent_name: getString(formData, "agentName"),
    virtual_tour_url: getString(formData, "virtualTourUrl"),
    description: getString(formData, "description"),
    highlights,
    neighborhood: getString(formData, "neighborhood"),
    year_built: getOptionalNumber(formData, "yearBuilt"),
    lot_size: getOptionalNumber(formData, "lotSize"),
    hoa_fee: getOptionalNumber(formData, "hoaFee"),
    property_tax_annual: getOptionalNumber(formData, "propertyTaxAnnual"),
    application_fee: getOptionalNumber(formData, "applicationFee"),
    security_deposit: getOptionalNumber(formData, "securityDeposit"),
    pet_deposit: getOptionalNumber(formData, "petDeposit"),
    pet_rent: getOptionalNumber(formData, "petRent"),
    lease_term_months: getOptionalNumber(formData, "leaseTermMonths"),
    latitude: getNumber(formData, "latitude"),
    longitude: getNumber(formData, "longitude"),
    owner_id: adminProfile.id,
    approval_status: "approved",
  }

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .insert(propertyPayload)
    .select("id")
    .single()

  if (propertyError) {
    throw new Error(propertyError.message)
  }

  await Promise.all([
    insertRelatedRows(
      "property_amenities",
      [
        ...getLines(formData, "amenities").map((name) => ({
          property_id: property.id,
          name,
          category: "building",
        })),
        ...getLines(formData, "features").map((name) => ({
          property_id: property.id,
          name,
          category: "unit",
        })),
        ...getLines(formData, "utilitiesIncluded").map((name) => ({
          property_id: property.id,
          name,
          category: "services",
        })),
      ]
    ),
    insertRelatedRows(
      "property_fees",
      getDelimitedLines(formData, "fees")
        .filter(([label]) => label)
        .map(([label, amount, note]) => ({
        property_id: property.id,
          fee_type: normalizeFeeType(label),
          amount: parseOptionalAmount(amount),
          note: note || label,
        }))
    ),
    insertRelatedRows(
      "property_pet_policies",
      getDelimitedLines(formData, "petPolicies")
        .filter(([label]) => label)
        .map(([label, amount]) => ({
          property_id: property.id,
          pet_type: normalizePetType(label),
          allowed: true,
          deposit: parseOptionalAmount(amount),
          rent: null,
          note: label,
        }))
    ),
    insertRelatedRows(
      "property_schools",
      getDelimitedLines(formData, "schools")
        .filter(([name]) => name)
        .map(([name, rating, distance, level, students]) => ({
          property_id: property.id,
          school_name: name,
          rating: parseOptionalAmount(rating),
          distance_miles: parseOptionalAmount(distance),
          level: normalizeSchoolLevel(level),
          school_type: null,
          students_count: parseOptionalAmount(students),
          reviews_count: null,
        }))
    ),
    insertRelatedRows(
      "property_nearby_places",
      getDelimitedLines(formData, "nearbyPlaces")
        .filter(([name]) => name)
        .map(([name, category, distance]) => ({
          property_id: property.id,
          place_name: name,
          category: normalizeNearbyCategory(category),
          distance_miles: parseOptionalAmount(distance),
        }))
    ),
  ])

  const files = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0)

  for (const [index, file] of files.entries()) {
    const path = `${property.id}/${getSafeFileName(file)}`
    const { error: uploadError } = await supabase.storage
      .from(PROPERTY_IMAGE_BUCKET)
      .upload(path, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    const { data } = supabase.storage
      .from(PROPERTY_IMAGE_BUCKET)
      .getPublicUrl(path)

    if (index === 0) {
      await supabase
        .from("properties")
        .update({ image_url: data.publicUrl })
        .eq("id", property.id)
    }

    await insertPropertyImageMetadata({
      propertyId: property.id,
      storagePath: path,
      publicUrl: data.publicUrl,
      sortOrder: index,
    })
  }

  revalidatePath("/dashboard/properties")
  redirect("/dashboard/properties")
}

export async function deletePropertyAction(formData: FormData) {
  await requireAdmin()

  const propertyId = getString(formData, "propertyId")
  const supabase = createSupabaseAdminClient()

  const { data: images, error: imageLookupError } = await supabase
    .from("property_images")
    .select("file_path, storage_path")
    .eq("property_id", propertyId)

  if (imageLookupError) {
    throw new Error(imageLookupError.message)
  }

  const paths = (images ?? [])
    .map((image) => image.file_path ?? image.storage_path)
    .filter(Boolean)

  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(PROPERTY_IMAGE_BUCKET)
      .remove(paths)

    if (storageError) {
      throw new Error(storageError.message)
    }
  }

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", propertyId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/properties")
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/pending-approvals")
}

export async function updatePropertyApprovalAction(formData: FormData) {
  await requireAdmin()

  const propertyId = getString(formData, "propertyId")
  const approvalStatus = getString(formData, "approvalStatus")

  if (!["pending", "approved", "rejected"].includes(approvalStatus)) {
    throw new Error("Invalid approval status.")
  }

  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from("properties")
    .update({ approval_status: approvalStatus })
    .eq("id", propertyId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/properties")
  revalidatePath("/dashboard/pending-approvals")
}

export async function deletePropertyImageAction(formData: FormData) {
  await requireAdmin()

  const imageId = getString(formData, "imageId")
  const storagePath = getString(formData, "storagePath")
  const supabase = createSupabaseAdminClient()

  const { error: storageError } = await supabase.storage
    .from(PROPERTY_IMAGE_BUCKET)
    .remove([storagePath])

  if (storageError) {
    throw new Error(storageError.message)
  }

  const { error } = await supabase
    .from("property_images")
    .delete()
    .eq("id", imageId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/properties")
}
