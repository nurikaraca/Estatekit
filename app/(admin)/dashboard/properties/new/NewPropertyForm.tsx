"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import type * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, ImagePlus, Loader2, MapPin, Plus, X } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { createPropertyAction } from "../actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const LocationPickerMap = dynamic(
  () => import("./LocationPickerMap").then((mod) => mod.LocationPickerMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[360px] place-items-center rounded-2xl border border-dashed border-border bg-muted/50 text-body-sm text-muted-foreground">
        Loading map...
      </div>
    ),
  }
)

const optionalNumber = z.preprocess(
  (value) => {
    if (value === "" || value === null || typeof value === "undefined") {
      return undefined
    }

    return Number(value)
  },
  z.number().min(0).optional()
)

const propertySchema = z.object({
  title: z.string().min(2, "Title is required."),
  slug: z.string().optional(),
  location: z.string().min(2, "Location is required."),
  neighborhoodName: z.string().min(2, "Neighborhood name is required."),
  listingType: z.enum(["sale", "rent", "sold"]),
  type: z.enum(["buy", "rent", "sold"]),
  homeType: z.enum([
    "apartment",
    "house",
    "condo",
    "townhome",
    "multi_family",
    "land",
    "manufactured",
  ]),
  statusLabel: z.string().min(2, "Status label is required."),
  availabilityLabel: z.string().optional(),
  brokerName: z.string().optional(),
  agentName: z.string().optional(),
  virtualTourUrl: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than zero."),
  beds: z.coerce.number().int().min(0, "Beds cannot be negative."),
  baths: z.coerce.number().min(0, "Baths cannot be negative."),
  sqft: z.coerce.number().positive("Square feet must be greater than zero."),
  yearBuilt: optionalNumber,
  lotSize: optionalNumber,
  hoaFee: optionalNumber,
  propertyTaxAnnual: optionalNumber,
  applicationFee: optionalNumber,
  securityDeposit: optionalNumber,
  petDeposit: optionalNumber,
  petRent: optionalNumber,
  leaseTermMonths: optionalNumber,
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  description: z.string().min(10, "Description is required."),
  neighborhood: z.string().optional(),
  highlights: z.string().optional(),
  utilitiesIncluded: z.string().optional(),
  amenities: z.string().optional(),
  features: z.string().optional(),
  fees: z.string().optional(),
  petPolicies: z.string().optional(),
  schools: z.string().optional(),
  nearbyPlaces: z.string().optional(),
})

type PropertyFormInput = z.input<typeof propertySchema>
type PropertyFormOutput = z.output<typeof propertySchema>

const defaultValues = {
  title: "Williamsburg Riverview Apartment",
  slug: "williamsburg-riverview-apartment",
  location: "Williamsburg, Brooklyn",
  neighborhoodName: "Williamsburg",
  listingType: "rent",
  type: "rent",
  homeType: "apartment",
  statusLabel: "For rent",
  availabilityLabel: "Available now",
  brokerName: "Estatekit Realty",
  agentName: "Nuri Karaca",
  virtualTourUrl: "https://example.com/virtual-tour",
  price: 4200,
  beds: 2,
  baths: 2,
  sqft: 1180,
  yearBuilt: 2019,
  lotSize: 0,
  hoaFee: 0,
  propertyTaxAnnual: 0,
  applicationFee: 75,
  securityDeposit: 4200,
  petDeposit: 300,
  petRent: 50,
  leaseTermMonths: 12,
  latitude: 40.7211,
  longitude: -73.9572,
  description:
    "Bright two-bedroom apartment with oversized windows, an open living area, and a modern kitchen in the heart of Williamsburg. The home is designed for easy city living with thoughtful storage, strong natural light, and quick access to parks, dining, transit, and neighborhood essentials.",
  neighborhood:
    "Williamsburg blends waterfront parks, independent cafes, restaurants, nightlife, fitness studios, and quick Manhattan access. The area feels energetic but still highly walkable for daily errands.",
  highlights: "",
  utilitiesIncluded: "Water\nTrash\nBuilding maintenance",
  amenities: "Fitness center\nRoof deck\nPackage room\nBike storage\nSecure entry",
  features: "In-unit laundry\nHardwood floors\nDishwasher\nCentral air\nPrivate balcony",
  fees: "Parking fee | 250 | monthly\nAdmin fee | 150 | one-time",
  petPolicies: "Cats allowed | 300\nSmall dogs allowed | 300",
  schools:
    "PS 84 Jose De Diego | 8 | 0.4 | elementary | 560\nBrooklyn Prep High School | 7 | 1.2 | high | 620",
  nearbyPlaces:
    "McCarren Park | park | 0.3\nBedford Avenue Shops | shopping | 0.2\nLilia | restaurant | 0.4\nEquinox Williamsburg | fitness | 0.5",
} satisfies PropertyFormInput

const listingStatusLabels: Record<PropertyFormInput["listingType"], string> = {
  sale: "For sale",
  rent: "For rent",
  sold: "Sold",
}

const legacyTypeByListingType: Record<PropertyFormInput["listingType"], PropertyFormInput["type"]> = {
  sale: "buy",
  rent: "rent",
  sold: "sold",
}

const listingTypeLabels: Record<PropertyFormInput["listingType"], string> = {
  sale: "Sale",
  rent: "Rent",
  sold: "Sold",
}

export function NewPropertyForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [highlightInput, setHighlightInput] = useState("")
  const [highlights, setHighlights] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const {
    control,
    register,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<PropertyFormInput, unknown, PropertyFormOutput>({
    resolver: zodResolver(propertySchema),
    defaultValues,
  })

  const latitude = Number(watch("latitude") || defaultValues.latitude)
  const longitude = Number(watch("longitude") || defaultValues.longitude)
  const listingType = watch("listingType")
  const statusLabel = watch("statusLabel")

  const submitLabel = useMemo(
    () => (isSubmitting ? "Creating property..." : "Create property"),
    [isSubmitting]
  )

  useEffect(() => {
    setValue("statusLabel", listingStatusLabels[listingType], {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue("type", legacyTypeByListingType[listingType], {
      shouldDirty: true,
      shouldValidate: true,
    })
  }, [listingType, setValue])

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [imagePreviews])

  function syncFileInput(files: File[]) {
    if (!fileInputRef.current) {
      return
    }

    try {
      const dataTransfer = new DataTransfer()
      files.forEach((file) => dataTransfer.items.add(file))
      fileInputRef.current.files = dataTransfer.files
    } catch {
      // Some environments do not allow programmatic writes to input.files.
      // The selected files are already tracked in component state.
    }
  }

  function getFileKey(file: File) {
    return `${file.name}-${file.size}-${file.lastModified}`
  }

  function setImages(files: File[]) {
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview))
    setSelectedFiles(files)
    setImagePreviews(files.map((file) => URL.createObjectURL(file)))
    syncFileInput(files)
  }

  function appendImages(files: File[]) {
    const nextFiles = [...selectedFiles]
    const existingFileKeys = new Set(nextFiles.map(getFileKey))

    files.forEach((file) => {
      const fileKey = getFileKey(file)

      if (!existingFileKeys.has(fileKey)) {
        nextFiles.push(file)
        existingFileKeys.add(fileKey)
      }
    })

    setImages(nextFiles)
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    appendImages(Array.from(event.target.files ?? []))
    event.target.value = ""
  }

  function handleImageDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    )

    appendImages(files)
  }

  function removeImage(index: number) {
    const nextFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index)
    setImages(nextFiles)
  }

  function addHighlight() {
    const value = highlightInput.trim()

    if (!value || highlights.includes(value)) {
      setHighlightInput("")
      return
    }

    setHighlights((current) => [...current, value])
    setHighlightInput("")
  }

  function handleHighlightKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return
    }

    event.preventDefault()
    addHighlight()
  }

  async function validateAndSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    const isValid = await trigger()

    if (!isValid) {
      setSubmitError("Please check the highlighted fields before saving.")
      return
    }

    const form = formRef.current

    if (!form) {
      setSubmitError("Unable to read the property form.")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData(form)

      formData.delete("images")
      selectedFiles.forEach((file) => {
        formData.append("images", file, file.name)
      })

      await createPropertyAction(formData)
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        typeof error.digest === "string" &&
        error.digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error
      }

      setSubmitError(
        error instanceof Error ? error.message : "Unable to create property."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={validateAndSubmit}
      className="mx-auto grid w-full max-w-6xl gap-6 pb-24"
    >
      <FormSection
        title="Basic Info"
        description="Name, URL slug and listing category for this property."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Title"
            error={errors.title?.message}
            inputProps={register("title")}
          />
          <Field
            label="Slug"
            hint="Optional. Generated from title when empty."
            error={errors.slug?.message}
            inputProps={register("slug")}
          />
          <input type="hidden" {...register("type")} />
          <label className="grid gap-2">
            <span className="text-label">Listing type</span>
            <Controller
              control={control}
              name="listingType"
              render={({ field }) => (
                <>
                  <input type="hidden" name={field.name} value={field.value} />
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-label">Home type</span>
            <Controller
              control={control}
              name="homeType"
              render={({ field }) => (
                <>
                  <input type="hidden" name={field.name} value={field.value} />
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhome">Townhome</SelectItem>
                      <SelectItem value="multi_family">Multi-family</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="manufactured">Manufactured</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            />
          </label>
          <div className="grid gap-2">
            <span className="text-label">Status label</span>
            <input
              type="hidden"
              {...register("statusLabel")}
              value={statusLabel}
              readOnly
            />
            <div className="flex h-11 items-center justify-between rounded-xl border border-border bg-muted/50 px-3 text-body-sm">
              <span className="font-medium">{statusLabel}</span>
              <span className="text-muted-foreground">
                From {listingTypeLabels[listingType]}
              </span>
            </div>
            {errors.statusLabel?.message ? (
              <p className="text-eyebrow text-destructive">
                {errors.statusLabel.message}
              </p>
            ) : null}
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Details"
        description="Core pricing and property facts shown in listing cards."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Field
            label="Price"
            type="number"
            error={errors.price?.message}
            inputProps={register("price")}
          />
          <Field
            label="Beds"
            type="number"
            error={errors.beds?.message}
            inputProps={register("beds")}
          />
          <Field
            label="Baths"
            type="number"
            step="0.5"
            error={errors.baths?.message}
            inputProps={register("baths")}
          />
          <Field
            label="Square feet"
            type="number"
            error={errors.sqft?.message}
            inputProps={register("sqft")}
          />
          <Field
            label="Year built"
            type="number"
            error={errors.yearBuilt?.message}
            inputProps={register("yearBuilt")}
          />
          <Field
            label="Lot size"
            type="number"
            error={errors.lotSize?.message}
            inputProps={register("lotSize")}
          />
        </div>
      </FormSection>

      <FormSection
        title="Availability & Contact"
        description="These fields power the sticky contact card and quick facts on the detail page."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Availability label"
            error={errors.availabilityLabel?.message}
            inputProps={register("availabilityLabel")}
          />
          <Field
            label="Agent name"
            error={errors.agentName?.message}
            inputProps={register("agentName")}
          />
          <Field
            label="Broker name"
            error={errors.brokerName?.message}
            inputProps={register("brokerName")}
          />
          <Field
            label="Virtual tour URL"
            error={errors.virtualTourUrl?.message}
            inputProps={register("virtualTourUrl")}
          />
        </div>
      </FormSection>

      <FormSection
        title="Fees & Terms"
        description="Rental fees feed the detail page fees table. Use one fee per line."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Field
            label="Application fee"
            type="number"
            error={errors.applicationFee?.message}
            inputProps={register("applicationFee")}
          />
          <Field
            label="Security deposit"
            type="number"
            error={errors.securityDeposit?.message}
            inputProps={register("securityDeposit")}
          />
          <Field
            label="Pet deposit"
            type="number"
            error={errors.petDeposit?.message}
            inputProps={register("petDeposit")}
          />
          <Field
            label="Monthly pet rent"
            type="number"
            error={errors.petRent?.message}
            inputProps={register("petRent")}
          />
          <Field
            label="Lease term months"
            type="number"
            error={errors.leaseTermMonths?.message}
            inputProps={register("leaseTermMonths")}
          />
          <Field
            label="HOA fee"
            type="number"
            error={errors.hoaFee?.message}
            inputProps={register("hoaFee")}
          />
          <Field
            label="Annual property tax"
            type="number"
            error={errors.propertyTaxAnnual?.message}
            inputProps={register("propertyTaxAnnual")}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextArea
            label="Utilities included"
            hint="One item per line, for example: Water"
            error={errors.utilitiesIncluded?.message}
            textareaProps={register("utilitiesIncluded")}
          />
          <TextArea
            label="Additional fees"
            hint="Format: Label | Amount | Cadence. Example: Parking fee | 150 | monthly"
            error={errors.fees?.message}
            textareaProps={register("fees")}
          />
        </div>
      </FormSection>

      <FormSection
        title="Amenities, Features & Policies"
        description="Use one item per line. These populate the rental apartment detail sections."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextArea
            label="Building amenities"
            hint="One amenity per line."
            error={errors.amenities?.message}
            textareaProps={register("amenities")}
          />
          <TextArea
            label="Unit features"
            hint="One feature per line."
            error={errors.features?.message}
            textareaProps={register("features")}
          />
          <TextArea
            label="Pet policies"
            hint="Format: Policy | Amount. Example: Cats allowed | 300"
            error={errors.petPolicies?.message}
            textareaProps={register("petPolicies")}
          />
        </div>
      </FormSection>

      <FormSection
        title="Schools & Nearby"
        description="Optional structured lines for map context and neighborhood intelligence."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextArea
            label="Schools"
            hint="Format: Name | Rating | Distance | Level | Students"
            error={errors.schools?.message}
            textareaProps={register("schools")}
          />
          <TextArea
            label="Nearby places"
            hint="Format: Name | Category | Distance"
            error={errors.nearbyPlaces?.message}
            textareaProps={register("nearbyPlaces")}
          />
        </div>
      </FormSection>

      <FormSection
        title="Location"
        description="Searchable address text plus precise coordinates from the map."
      >
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Location"
              error={errors.location?.message}
              inputProps={register("location")}
            />
            <Field
              label="Neighborhood name"
              error={errors.neighborhoodName?.message}
              inputProps={register("neighborhoodName")}
            />
          </div>

          <div className="rounded-[1.25rem] bg-muted/40 p-2">
            <LocationPickerMap
              latitude={Number.isFinite(latitude) ? latitude : defaultValues.latitude}
              longitude={
                Number.isFinite(longitude) ? longitude : defaultValues.longitude
              }
              onChange={(coords) => {
                setValue("latitude", coords.latitude, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
                setValue("longitude", coords.longitude, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Latitude"
              type="number"
              step="any"
              error={errors.latitude?.message}
              inputProps={register("latitude")}
            />
            <Field
              label="Longitude"
              type="number"
              step="any"
              error={errors.longitude?.message}
              inputProps={register("longitude")}
            />
          </div>

          <p className="inline-flex items-center gap-2 text-caption text-muted-foreground">
            <MapPin className="size-4" />
            Click the map or drag the pin to update coordinates.
          </p>
        </div>
      </FormSection>

      <FormSection
        title="Description"
        description="Write the listing story and add concise highlights as tags."
      >
        <div className="grid gap-4">
          <TextArea
            label="Description"
            error={errors.description?.message}
            textareaProps={register("description")}
          />
          <TextArea
            label="Neighborhood copy"
            error={errors.neighborhood?.message}
            textareaProps={register("neighborhood")}
          />

          <div className="grid gap-2">
            <span className="text-label">Highlights</span>
            <input type="hidden" name="highlights" value={highlights.join("\n")} />
            <div className="flex gap-2">
              <Input
                value={highlightInput}
                onChange={(event) => setHighlightInput(event.target.value)}
                onKeyDown={handleHighlightKeyDown}
                placeholder="Add a highlight, then press Enter"
                className="h-11 rounded-xl"
              />
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl px-4"
                onClick={addHighlight}
              >
                <Plus className="size-4" />
                Add
              </Button>
            </div>
            {highlights.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-caption"
                  >
                    {highlight}
                    <button
                      type="button"
                      className="text-muted-foreground transition hover:text-foreground"
                      onClick={() =>
                        setHighlights((current) =>
                          current.filter((item) => item !== highlight)
                        )
                      }
                    >
                      <X className="size-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Media"
        description="Upload property images. The first image becomes the listing cover."
      >
        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleImageDrop}
          className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-border bg-muted/35 px-6 py-10 text-center transition hover:bg-muted/55"
        >
          <Input
            ref={fileInputRef}
            multiple
            name="images"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleImageChange}
          />
          <span className="grid size-12 place-items-center rounded-full bg-background shadow-sm">
            <ImagePlus className="size-5" />
          </span>
          <span className="mt-4 text-label">
            Drop images here or click to browse
          </span>
          <span className="mt-1 text-caption text-muted-foreground">
            JPG, PNG or WEBP. Select multiple at once or add more later.
          </span>
        </label>

        {imagePreviews.length > 0 ? (
          <div className="grid gap-3">
            <p className="text-caption text-muted-foreground">
              {imagePreviews.length} image{imagePreviews.length > 1 ? "s" : ""} selected.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={preview}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-muted"
                >
                  <Image
                    src={preview}
                    alt={`Property preview ${index + 1}`}
                    width={640}
                    height={480}
                    unoptimized
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                    onClick={() => removeImage(index)}
                  >
                    <X className="size-4" />
                  </button>
                  {index === 0 ? (
                    <span className="absolute bottom-2 left-2 rounded-full bg-black px-2.5 py-1 text-caption font-medium text-white">
                      Cover
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </FormSection>

      <div className="sticky bottom-4 z-20 rounded-2xl border border-border bg-background/95 p-3 shadow-lg shadow-black/10 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-5">
            {submitError ? (
              <p className="inline-flex items-center gap-2 text-label text-destructive">
                <AlertCircle className="size-4" />
                {submitError}
              </p>
            ) : (
              <p className="text-caption text-muted-foreground">
                Review the listing details before publishing.
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 rounded-xl px-6"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="rounded-[1.5rem] border-border/80 bg-card/95 shadow-sm">
      <CardHeader className="border-b border-border/70">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 p-5">{children}</CardContent>
    </Card>
  )
}

type FieldProps = {
  label: string
  type?: string
  step?: string
  hint?: string
  error?: string
  inputProps: React.ComponentProps<typeof Input>
}

function Field({
  label,
  type = "text",
  step,
  hint,
  error,
  inputProps,
}: FieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-label">{label}</span>
      <Input
        type={type}
        step={step}
        aria-invalid={Boolean(error)}
        className="h-11 rounded-xl"
        {...inputProps}
      />
      {error ? (
        <p className="text-eyebrow text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-caption text-muted-foreground">{hint}</p>
      ) : null}
    </label>
  )
}

function TextArea({
  label,
  hint,
  error,
  textareaProps,
}: {
  label: string
  hint?: string
  error?: string
  textareaProps: React.ComponentProps<"textarea">
}) {
  return (
    <label className="grid gap-2">
      <span className="text-label">{label}</span>
      <textarea
        aria-invalid={Boolean(error)}
        className="min-h-32 rounded-xl border border-input bg-background px-4 py-3 text-body-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
        {...textareaProps}
      />
      {error ? (
        <p className="text-eyebrow text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-caption text-muted-foreground">{hint}</p>
      ) : null}
    </label>
  )
}
