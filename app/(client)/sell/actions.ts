"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getCurrentProfile } from "@/lib/supabase/auth"

const PROPERTY_IMAGE_BUCKET = "property-images"

export type SubmitListingState = {
  error: string | null
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

function getOptionalNumber(formData: FormData, key: string) {
  const rawValue = getString(formData, key)

  if (!rawValue) {
    return null
  }

  const value = Number(rawValue)

  return Number.isFinite(value) ? value : null
}

function getRequiredNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key) ?? 0)

  return Number.isFinite(value) ? value : 0
}

function getLines(formData: FormData, key: string) {
  return getString(formData, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
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

function getListingCopy(listingType: string) {
  if (listingType === "rent") {
    return {
      type: "rent",
      statusLabel: "For rent",
      availabilityLabel: "Available after approval",
    }
  }

  return {
    type: "buy",
    statusLabel: "For sale",
    availabilityLabel: "Active after approval",
  }
}

async function insertRows(
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

async function uploadListingImages(propertyId: number | string, files: File[]) {
  const supabase = createSupabaseAdminClient()

  for (const [index, file] of files.entries()) {
    const storagePath = `${propertyId}/${getSafeFileName(file)}`
    const { error: uploadError } = await supabase.storage
      .from(PROPERTY_IMAGE_BUCKET)
      .upload(storagePath, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    const { data } = supabase.storage
      .from(PROPERTY_IMAGE_BUCKET)
      .getPublicUrl(storagePath)

    if (index === 0) {
      await supabase
        .from("properties")
        .update({ image_url: data.publicUrl })
        .eq("id", propertyId)
    }

    const { error: imageError } = await supabase.from("property_images").insert({
      property_id: propertyId,
      image_url: data.publicUrl,
      file_path: storagePath,
      is_cover: index === 0,
      sort_order: index,
    })

    if (imageError) {
      throw new Error(imageError.message)
    }
  }
}

export async function submitListingAction(
  _previousState: SubmitListingState,
  formData: FormData
): Promise<SubmitListingState> {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect("/login")
  }

  const title = getString(formData, "title")
  const location = getString(formData, "location")
  const description = getString(formData, "description")

  if (!title || !location || description.length < 20) {
    return {
      error:
        "Please add a title, location, and a description with at least 20 characters.",
    }
  }

  const listingType = getString(formData, "listingType") === "rent" ? "rent" : "sale"
  const listingCopy = getListingCopy(listingType)
  const homeType = getString(formData, "homeType") || "house"
  const neighborhoodName =
    getString(formData, "neighborhoodName") || location.split(",")[0] || location
  const highlights = getLines(formData, "highlights")
  const amenities = getLines(formData, "amenities")
  const features = getLines(formData, "features")
  const utilitiesIncluded = getLines(formData, "utilitiesIncluded")
  const isPetFriendly = formData.get("isPetFriendly") === "on"
  const hasParking = formData.get("hasParking") === "on"
  const hasPool = formData.get("hasPool") === "on"
  const hasGym = formData.get("hasGym") === "on"
  const hasLaundry = formData.get("hasLaundry") === "on"
  const slugBase = slugify(`${title}-${location}`) || `listing-${randomUUID()}`

  const supabase = createSupabaseAdminClient()
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .insert({
      slug: `${slugBase}-${randomUUID().slice(0, 8)}`,
      title,
      location,
      neighborhood_name: neighborhoodName,
      type: listingCopy.type,
      listing_type: listingType,
      home_type: homeType,
      price: getRequiredNumber(formData, "price"),
      beds: getRequiredNumber(formData, "beds"),
      baths: getRequiredNumber(formData, "baths"),
      sqft: getRequiredNumber(formData, "sqft"),
      status_label: listingCopy.statusLabel,
      availability_label: listingCopy.availabilityLabel,
      broker_name: "Owner submitted",
      agent_name: getString(formData, "contactName") || profile.full_name || profile.email,
      description,
      highlights,
      neighborhood: getString(formData, "neighborhood"),
      year_built: getOptionalNumber(formData, "yearBuilt"),
      lot_size: getOptionalNumber(formData, "lotSize"),
      hoa_fee: getOptionalNumber(formData, "hoaFee"),
      security_deposit: getOptionalNumber(formData, "securityDeposit"),
      lease_term_months: getOptionalNumber(formData, "leaseTermMonths"),
      latitude: getOptionalNumber(formData, "latitude"),
      longitude: getOptionalNumber(formData, "longitude"),
      owner_id: profile.id,
      approval_status: "pending",
      is_pet_friendly: isPetFriendly,
      has_parking: hasParking,
      has_pool: hasPool,
      has_gym: hasGym,
      has_laundry: hasLaundry,
      utilities_included: utilitiesIncluded,
      amenities,
      features,
    })
    .select("id")
    .single()

  if (propertyError) {
    return { error: propertyError.message }
  }

  try {
    await Promise.all([
      insertRows(
        "property_amenities",
        [
          ...amenities.map((name, index) => ({
            property_id: property.id,
            category: "building",
            name,
            sort_order: index,
          })),
          ...utilitiesIncluded.map((name, index) => ({
            property_id: property.id,
            category: "services",
            name,
            sort_order: index,
          })),
        ]
      ),
      insertRows(
        "property_features",
        features.map((label) => ({
          property_id: property.id,
          label,
          category: "general",
        }))
      ),
      listingType === "rent"
        ? insertRows("property_fees", [
            {
              property_id: property.id,
              fee_type: "security_deposit",
              amount: getOptionalNumber(formData, "securityDeposit"),
              note: "Security deposit",
            },
          ])
        : Promise.resolve(),
    ])

    const files = formData
      .getAll("images")
      .filter((file): file is File => file instanceof File && file.size > 0)
      .slice(0, 6)

    await uploadListingImages(property.id, files)
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "The listing was created, but related details could not be saved.",
    }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/pending-approvals")
  redirect("/sell/success")
}
