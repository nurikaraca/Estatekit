"use client"

import dynamic from "next/dynamic"
import { useActionState, useState } from "react"
import { Home, ImagePlus, Loader2, MapPin, Send } from "lucide-react"

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

import { submitListingAction, type SubmitListingState } from "./actions"

const LocationPickerMap = dynamic(
  () =>
    import("@/components/maps/LocationPickerMap").then(
      (mod) => mod.LocationPickerMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[360px] place-items-center rounded-2xl border border-dashed border-border bg-muted/50 text-body-sm text-muted-foreground">
        Loading map...
      </div>
    ),
  }
)

const initialState: SubmitListingState = {
  error: null,
}

const defaultCoordinates = {
  latitude: 40.7211,
  longitude: -73.9572,
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-2 text-label">
      <span>{label}</span>
      {children}
    </label>
  )
}

function Textarea(props: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className="min-h-32 rounded-lg border border-input bg-background px-3 py-3 text-body-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
      {...props}
    />
  )
}

export function SellPropertyForm() {
  const [state, formAction, pending] = useActionState(
    submitListingAction,
    initialState
  )
  const [coordinates, setCoordinates] = useState(defaultCoordinates)

  return (
    <form action={formAction} className="grid gap-6">
      <input type="hidden" name="latitude" value={coordinates.latitude} />
      <input type="hidden" name="longitude" value={coordinates.longitude} />

      {state.error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-body-sm text-destructive">
          {state.error}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Listing basics</CardTitle>
          <CardDescription>
            Tell us what kind of property should enter the approval queue.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="I want to">
              <Select name="listingType" defaultValue="sale">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sell</SelectItem>
                  <SelectItem value="rent">Rent out</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Home type">
              <Select name="homeType" defaultValue="house">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhome">Townhome</SelectItem>
                  <SelectItem value="multi_family">Multi-family</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="manufactured">Manufactured</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Asking price">
              <Input name="price" type="number" min="1" required placeholder="625000" />
            </Field>
          </div>

          <Field label="Listing title">
            <Input
              name="title"
              required
              minLength={2}
              placeholder="Sunny family home near the park"
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Location">
              <Input
                name="location"
                required
                placeholder="Williamsburg, Brooklyn"
              />
            </Field>
            <Field label="Neighborhood">
              <Input name="neighborhoodName" placeholder="Williamsburg" />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property details</CardTitle>
          <CardDescription>
            These details help admins review and publish the listing faster.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Beds">
              <Input name="beds" type="number" min="0" required placeholder="3" />
            </Field>
            <Field label="Baths">
              <Input name="baths" type="number" min="0" step="0.5" required placeholder="2" />
            </Field>
            <Field label="Square feet">
              <Input name="sqft" type="number" min="1" required placeholder="1450" />
            </Field>
            <Field label="Year built">
              <Input name="yearBuilt" type="number" min="1800" placeholder="2018" />
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              name="description"
              required
              minLength={20}
              placeholder="Describe the layout, light, upgrades, outdoor space, and what makes the home stand out."
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Highlights">
              <Textarea
                name="highlights"
                placeholder={"Corner lot\nRenovated kitchen\nClose to transit"}
              />
            </Field>
            <Field label="Features">
              <Textarea
                name="features"
                placeholder={"Hardwood floors\nIn-unit laundry\nPrivate balcony"}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Amenities">
              <Textarea
                name="amenities"
                placeholder={"Garage\nRoof deck\nSecure entry"}
              />
            </Field>
            <Field label="Utilities included">
              <Textarea
                name="utilitiesIncluded"
                placeholder={"Water\nTrash\nInternet"}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Security deposit">
              <Input name="securityDeposit" type="number" min="0" placeholder="4200" />
            </Field>
            <Field label="Lease months">
              <Input name="leaseTermMonths" type="number" min="1" placeholder="12" />
            </Field>
            <Field label="HOA fee">
              <Input name="hoaFee" type="number" min="0" placeholder="350" />
            </Field>
          </div>

          <div className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-5">
            {[
              ["isPetFriendly", "Pet friendly"],
              ["hasParking", "Parking"],
              ["hasPool", "Pool"],
              ["hasGym", "Gym"],
              ["hasLaundry", "Laundry"],
            ].map(([name, label]) => (
              <label key={name} className="flex items-center gap-2 text-body-sm">
                <input name={name} type="checkbox" className="size-4 accent-primary" />
                {label}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photos and contact</CardTitle>
          <CardDescription>
            Photos are stored with the listing and shown after admin approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <label className="grid gap-3 rounded-lg border border-dashed border-border p-5 text-center">
            <ImagePlus className="mx-auto size-8 text-muted-foreground" />
            <span className="text-label">Upload up to 6 photos</span>
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              className="mx-auto max-w-full text-caption"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Your name">
              <Input name="contactName" placeholder="Nuri Karaca" />
            </Field>
            <Field label="Selected coordinates">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  readOnly
                  value={coordinates.latitude}
                  aria-label="Selected latitude"
                />
                <Input
                  readOnly
                  value={coordinates.longitude}
                  aria-label="Selected longitude"
                />
              </div>
            </Field>
          </div>

          <div className="grid gap-3">
            <LocationPickerMap
              latitude={coordinates.latitude}
              longitude={coordinates.longitude}
              onChange={setCoordinates}
            />
            <p className="inline-flex items-center gap-2 text-caption text-muted-foreground">
              <MapPin className="size-4" />
              Click the map or drag the pin to set the property location.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-muted">
            <Home className="size-5" />
          </span>
          <div>
            <p className="text-label">Submit for admin review</p>
            <p className="text-caption text-muted-foreground">
              The listing stays hidden until it is approved.
            </p>
          </div>
        </div>
        <Button type="submit" size="lg" disabled={pending} className="h-11 px-5">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {pending ? "Submitting..." : "Submit listing"}
        </Button>
      </div>
    </form>
  )
}
