import {
  Bath,
  BedDouble,
  Calendar,
  Check,
  Clock3,
  Home,
  KeyRound,
  MapPin,
  MessageCircle,
  PawPrint,
  Ruler,
  School,
  Sparkles,
  Trees,
} from "lucide-react"
import type { ReactNode } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { formatNumber, formatPrice } from "../../lib/property-formatters"
import type { PropertyItem } from "../../types"

type PropertySectionProps = {
  property: PropertyItem
}

const homeTypeLabels: Record<PropertyItem["homeType"], string> = {
  apartment: "Apartment",
  house: "House",
  condo: "Condo",
  townhome: "Townhome",
  multi_family: "Multi-family",
  land: "Land",
  manufactured: "Manufactured",
}

const listingTypeLabels: Record<PropertyItem["listingType"], string> = {
  sale: "For sale",
  rent: "For rent",
  sold: "Sold",
}

const tourTimes = ["9:00 am", "10:30 am", "12:00 pm", "2:00 pm", "4:30 pm"]
const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/\D/g, "")

function formatMoney(value: number | null) {
  return value === null ? "Not listed" : `$${formatNumber(value)}`
}

function formatFeeAmount(value: number | null, cadence?: string) {
  if (value === null) {
    return cadence || "Not listed"
  }

  return cadence ? `${formatMoney(value)} ${cadence}` : formatMoney(value)
}

function getTourDateOptions() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  return Array.from({ length: 4 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)
    const [weekday, dateLabel] = formatter.format(date).split(", ")

    return {
      value: date.toISOString().slice(0, 10),
      weekday,
      dateLabel,
    }
  })
}

function getWhatsAppHref(property: PropertyItem) {
  if (!whatsappPhone) {
    return null
  }

  const message = [
    `Hi, I am interested in ${property.title}.`,
    `Location: ${property.location}`,
    `Price: ${formatPrice(property.price, property.type)}`,
    `Property ID: ${property.id}`,
  ].join("\n")

  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`
}

function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-body-sm text-muted-foreground">
      {children}
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-eyebrow text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-1 text-heading-md text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-3xl text-body-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function PropertyQuickFacts({ property }: PropertySectionProps) {
  const facts = [
    { label: "Beds", value: property.beds, icon: BedDouble },
    { label: "Baths", value: property.baths, icon: Bath },
    { label: "Sq ft", value: formatNumber(property.sqft), icon: Ruler },
    { label: "Lot", value: property.lotSize || "Not listed", icon: Trees },
    { label: "Built", value: property.yearBuilt || "Not listed", icon: Calendar },
    { label: "Home type", value: homeTypeLabels[property.homeType], icon: Home },
    { label: "Listing", value: listingTypeLabels[property.listingType], icon: KeyRound },
    { label: "Availability", value: property.availabilityLabel, icon: Clock3 },
  ]

  return (
    <Card className="bg-white/90 shadow-sm dark:bg-white/5">
      <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((fact) => {
          const Icon = fact.icon

          return (
            <div
              key={fact.label}
              className="rounded-2xl bg-muted/50 p-4 dark:bg-white/5"
            >
              <div className="flex items-center gap-2 text-caption text-muted-foreground">
                <Icon className="size-4" />
                {fact.label}
              </div>
              <p className="mt-2 text-heading-sm text-foreground">{fact.value}</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export function PropertyHighlights({ property }: PropertySectionProps) {
  const flagHighlights = [
    property.flags.isPetFriendly ? "Pet friendly" : null,
    property.flags.hasParking ? "Parking" : null,
    property.flags.hasPool ? "Pool" : null,
    property.flags.hasGym ? "Gym" : null,
    property.flags.hasLaundry ? "Laundry" : null,
  ].filter((item): item is string => Boolean(item))

  const highlights = Array.from(new Set([...flagHighlights, ...property.highlights]))

  return (
    <Card className="bg-white/90 shadow-sm dark:bg-white/5">
      <CardHeader>
        <SectionHeading
          eyebrow="Highlights"
          title="What makes this place stand out"
          description="Fast-scannable signals for buyers and renters before they dive into the details."
        />
      </CardHeader>
      <CardContent>
        {highlights.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {highlights.map((highlight) => (
              <Badge
                key={highlight}
                variant="secondary"
                className="gap-2 rounded-full px-3 py-2 text-label"
              >
                <Sparkles className="size-3.5" />
                {highlight}
              </Badge>
            ))}
          </div>
        ) : (
          <EmptyNote>Highlights have not been added for this listing yet.</EmptyNote>
        )}
      </CardContent>
    </Card>
  )
}

export function PropertyOverview({ property }: PropertySectionProps) {
  const isLong = property.description.length > 220
  const preview = isLong ? `${property.description.slice(0, 220)}...` : property.description

  return (
    <Card className="bg-white/90 shadow-sm dark:bg-white/5">
      <CardHeader>
        <SectionHeading eyebrow="Overview" title="About this home" />
      </CardHeader>
      <CardContent>
        {property.description ? (
          isLong ? (
            <details className="group">
              <summary className="cursor-pointer list-none">
                <p className="text-body-md leading-8 text-muted-foreground group-open:hidden">
                  {preview}
                </p>
                <span className="mt-3 inline-flex text-label text-foreground group-open:hidden">
                  Read more
                </span>
              </summary>
              <p className="text-body-md leading-8 text-muted-foreground">
                {property.description}
              </p>
            </details>
          ) : (
            <p className="text-body-md leading-8 text-muted-foreground">
              {property.description}
            </p>
          )
        ) : (
          <EmptyNote>No overview has been added for this listing yet.</EmptyNote>
        )}
      </CardContent>
    </Card>
  )
}

export function PropertyFeatureTabs({ property }: PropertySectionProps) {
  const isRental = property.listingType === "rent"

  const rentalGroups = [
    { title: "Building amenities", values: property.amenities },
    { title: "Unit features", values: property.features },
    {
      title: "Lease terms",
      values: [
        property.terms.leaseTermMonths
          ? `${property.terms.leaseTermMonths}-month lease`
          : "Flexible lease options",
        property.availabilityLabel,
      ],
    },
    {
      title: "Utilities included",
      values:
        property.terms.utilitiesIncluded.length > 0
          ? property.terms.utilitiesIncluded
          : ["Utilities vary by lease"],
    },
  ]

  const saleGroups = [
    { title: "Interior features", values: property.features },
    { title: "Exterior features", values: property.amenities },
    {
      title: "Parking",
      values: [property.flags.hasParking ? "Parking available" : "Parking not listed"],
    },
    {
      title: "Construction and taxes",
      values: [
        property.yearBuilt ? `Built in ${property.yearBuilt}` : "Year built not listed",
        property.terms.propertyTaxAnnual
          ? `${formatMoney(property.terms.propertyTaxAnnual)} annual property tax`
          : "Annual property tax not listed",
        property.terms.hoaFee ? `${formatMoney(property.terms.hoaFee)} HOA fee` : "HOA not listed",
      ],
    },
  ]

  const groups = (isRental ? rentalGroups : saleGroups).filter(
    (group) => group.values.length > 0
  )

  if (groups.length === 0) {
    return null
  }

  return (
    <Card className="bg-white/90 shadow-sm dark:bg-white/5">
      <CardHeader>
        <SectionHeading
          eyebrow="Facts & features"
          title={isRental ? "Rental features and policies" : "Home facts and features"}
          description={
            isRental
              ? "Apartment-focused details for lease decisions, move-in planning, and amenities."
              : "Sale-focused details for ownership, structure, taxes, and daily living."
          }
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={groups[0].title}>
          <TabsList className="flex h-auto max-w-full flex-wrap justify-start rounded-2xl">
            {groups.map((group) => (
              <TabsTrigger key={group.title} value={group.title}>
                {group.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {groups.map((group) => (
            <TabsContent key={group.title} value={group.title}>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.values.map((value) => (
                  <div
                    key={value}
                    className="flex items-center gap-3 rounded-2xl bg-muted/50 p-4 text-body-sm dark:bg-white/5"
                  >
                    <Check className="size-4 text-emerald-500" />
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

export function PropertyFeesAndPolicies({ property }: PropertySectionProps) {
  const isRental = property.listingType === "rent"

  const relationFees = property.fees.map((fee) => [
    fee.label,
    formatFeeAmount(fee.amount, fee.cadence),
  ])

  const rentalFees =
    relationFees.length > 0
      ? relationFees
      : [
          ["Application fee", formatMoney(property.terms.applicationFee)],
          ["Security deposit", formatMoney(property.terms.securityDeposit)],
          ["Pet deposit", formatMoney(property.terms.petDeposit)],
          ["Monthly pet rent", formatMoney(property.terms.petRent)],
          [
            "Lease duration",
            property.terms.leaseTermMonths
              ? `${property.terms.leaseTermMonths} months`
              : "Not listed",
          ],
        ]

  const saleFees = [
    ["HOA fee", formatMoney(property.terms.hoaFee)],
    ["Annual property tax", formatMoney(property.terms.propertyTaxAnnual)],
    ["Lot size", property.lotSize || "Not listed"],
    ["Broker", property.brokerName],
  ]

  const rows = isRental ? rentalFees : saleFees

  return (
    <Card className="bg-white/90 shadow-sm dark:bg-white/5">
      <CardHeader>
        <SectionHeading
          eyebrow={isRental ? "Fees & terms" : "Ownership costs"}
          title={isRental ? "Move-in cost details" : "Cost and ownership details"}
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-2xl border border-border">
            <Table>
              <TableBody>
                {rows.map(([label, value]) => (
                  <TableRow key={label}>
                    <TableCell className="font-medium">{label}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-2xl bg-muted/50 p-5 dark:bg-white/5">
            <div className="flex items-center gap-2 font-semibold">
              <PawPrint className="size-4" />
              Pet policy
            </div>
            {property.petPolicies.length > 0 ? (
              <div className="mt-4 grid gap-2">
                {property.petPolicies.map((policy) => (
                  <div key={policy.label} className="flex items-center gap-2 text-body-sm">
                    <Check className="size-4 text-emerald-500" />
                    <span>
                      {policy.label}
                      {policy.amount !== null ? ` - ${formatMoney(policy.amount)}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-body-sm text-muted-foreground">
                Pet policy has not been added for this listing.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PropertyNeighborhoodMap({ property }: PropertySectionProps) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    property.coordinates.lng - 0.012
  }%2C${property.coordinates.lat - 0.009}%2C${property.coordinates.lng + 0.012}%2C${
    property.coordinates.lat + 0.009
  }&layer=mapnik&marker=${property.coordinates.lat}%2C${property.coordinates.lng}`

  return (
    <Card className="overflow-hidden bg-white/90 shadow-sm dark:bg-white/5">
      <CardHeader>
        <SectionHeading
          eyebrow="Neighborhood"
          title={property.neighborhoodName}
          description={property.neighborhood || "Neighborhood context will appear here."}
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-border">
            <iframe
              title={`${property.title} map`}
              src={mapUrl}
              className="h-[360px] w-full border-0"
              loading="lazy"
            />
          </div>

          <div className="grid gap-3">
            {property.nearbyPlaces.length > 0 ? (
              property.nearbyPlaces.map((place) => (
                <div
                  key={`${place.name}-${place.category}`}
                  className="flex items-center justify-between rounded-2xl bg-muted/50 p-4 dark:bg-white/5"
                >
                  <div>
                    <p className="font-medium">{place.name}</p>
                    <p className="text-caption text-muted-foreground">{place.category}</p>
                  </div>
                  <Badge variant="outline">{place.distance}</Badge>
                </div>
              ))
            ) : (
              <EmptyNote>Nearby places have not been added for this listing yet.</EmptyNote>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PropertySchools({ property }: PropertySectionProps) {
  return (
    <Card className="bg-white/90 shadow-sm dark:bg-white/5">
      <CardHeader>
        <SectionHeading
          eyebrow="Schools"
          title="Nearby schools"
          description="School information is shown as a template-ready structure and can be connected to a real provider later."
        />
      </CardHeader>
      <CardContent>
        {property.schools.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead className="text-right">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {property.schools.map((school) => (
                <TableRow key={school.name}>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-2">
                      <School className="size-4 text-muted-foreground" />
                      {school.name}
                    </span>
                  </TableCell>
                  <TableCell>{school.level}</TableCell>
                  <TableCell>{school.rating ?? "N/A"}</TableCell>
                  <TableCell>{school.distance}</TableCell>
                  <TableCell className="text-right">
                    {school.students ? formatNumber(school.students) : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyNote>School data has not been added for this listing yet.</EmptyNote>
        )}
      </CardContent>
    </Card>
  )
}

export function PropertySimilarListings({ property }: PropertySectionProps) {
  return (
    <Card className="bg-white/90 shadow-sm dark:bg-white/5">
      <CardHeader>
        <SectionHeading
          eyebrow="Similar listings"
          title="Comparable homes"
          description="A production build can replace these cards with same-city, same-type, similar-price query results."
        />
      </CardHeader>
      <CardContent>
        {property.similarListings.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {property.similarListings.map((listing) => (
              <div
                key={listing.id}
                className="rounded-2xl border border-border bg-muted/30 p-4 transition hover:bg-muted/50 dark:bg-white/5"
              >
                <p className="text-label">{listing.title}</p>
                <p className="mt-2 text-heading-sm">
                  {formatPrice(listing.price, property.type)}
                </p>
                <p className="mt-2 text-caption text-muted-foreground">
                  {listing.beds} beds - {listing.baths} baths - {formatNumber(listing.sqft)} sq ft
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyNote>No similar listings are available for this property yet.</EmptyNote>
        )}
      </CardContent>
    </Card>
  )
}

export function PropertyDetailAccordion({ property }: PropertySectionProps) {
  return (
    <Card className="bg-white/90 shadow-sm dark:bg-white/5">
      <CardHeader>
        <SectionHeading eyebrow="More details" title="Property details at a glance" />
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["amenities", "policies"]}>
          <AccordionItem value="amenities">
            <AccordionTrigger>Top amenities</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {property.amenities.length > 0 ? (
                  property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-body-sm">
                      <Check className="size-4 text-emerald-500" />
                      {amenity}
                    </div>
                  ))
                ) : (
                  <p className="text-body-sm text-muted-foreground">
                    Amenities have not been added for this listing yet.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="policies">
            <AccordionTrigger>Policies and availability</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-2 text-body-sm text-muted-foreground">
                <p>Availability: {property.availabilityLabel}</p>
                <p>Last updated: {property.lastUpdatedAt || "Not listed"}</p>
                <p>Agent: {property.agentName}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

export function PropertyContactCard({ property }: PropertySectionProps) {
  const isRental = property.listingType === "rent"
  const tourDateOptions = getTourDateOptions()
  const primaryLabel = isRental ? "Request a tour" : "Schedule a tour"
  const whatsappHref = getWhatsAppHref(property)

  return (
    <aside className="h-fit rounded-[2rem] border border-black/5 bg-white/90 p-5 shadow-sm backdrop-blur lg:sticky lg:top-24 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          {property.statusLabel}
        </Badge>
        <Badge variant="outline" className="rounded-full px-3 py-1">
          {homeTypeLabels[property.homeType]}
        </Badge>
      </div>

      <div className="mt-5 space-y-3">
        <h1 className="text-heading-lg text-foreground">
          {property.title}
        </h1>
        <p className="flex items-center gap-2 text-caption text-muted-foreground">
          <MapPin className="size-4" />
          {property.location}
        </p>
        <p className="text-heading-md text-foreground">
          {formatPrice(property.price, property.type)}
        </p>
      </div>

      <Separator className="my-5" />

      <div className="rounded-[1.5rem] bg-muted/45 p-4 dark:bg-white/5">
        <p className="text-eyebrow text-muted-foreground">
          Listed by
        </p>
        <p className="mt-1 text-label text-foreground">
          {property.agentName}
        </p>
        <p className="mt-1 text-caption text-muted-foreground">
          {property.brokerName}
        </p>
      </div>

      <form className="mt-6 grid gap-4">
        <input type="hidden" name="propertyId" value={property.id} />
        <input type="hidden" name="propertyTitle" value={property.title} />

        <div>
          <h2 className="text-heading-sm">
            More about this property
          </h2>
          <p className="mt-1 text-caption text-muted-foreground">
            Pick a tour time and the listing team can follow up with next steps.
          </p>
        </div>

        <div className="grid gap-3">
          <Input
            name="fullName"
            required
            placeholder="Full name *"
            className="h-12 rounded-[1rem]"
          />
          <Input
            name="email"
            type="email"
            required
            placeholder="Email *"
            className="h-12 rounded-[1rem]"
          />
          <Input
            name="phone"
            type="tel"
            placeholder="Phone"
            className="h-12 rounded-[1rem]"
          />
        </div>

        <div className="grid gap-2">
          <p className="text-label">Preferred tour date</p>
          <div className="grid grid-cols-2 gap-2">
            {tourDateOptions.map((option, index) => (
              <label key={option.value} className="group">
                <input
                  className="peer sr-only"
                  type="radio"
                  name="tourDate"
                  value={option.value}
                  defaultChecked={index === 0}
                />
                <span className="flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-[1rem] border border-border bg-background px-3 text-center transition peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-2 peer-checked:ring-primary/20 dark:bg-white/5">
                  <span className="text-eyebrow text-muted-foreground">
                    {option.weekday}
                  </span>
                  <span className="mt-1 text-label">{option.dateLabel}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <Select name="tourTime" defaultValue={tourTimes[0]}>
          <SelectTrigger className="h-12 rounded-[1rem]">
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            {tourTimes.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <textarea
          name="message"
          defaultValue={`I am interested in ${property.title}.`}
          className="min-h-28 rounded-[1rem] border border-input bg-background px-4 py-3 text-body-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />

        <Button type="submit" size="lg" className="h-auto rounded-full px-6 py-4">
          {primaryLabel}
        </Button>

        {whatsappHref ? (
          <Button
            asChild
            type="button"
            variant="outline"
            size="lg"
            className="h-auto rounded-full px-6 py-4"
          >
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              Contact on WhatsApp
            </a>
          </Button>
        ) : null}

        <p className="text-center text-caption text-muted-foreground">
          No spam. Use the form for tracked inquiries or WhatsApp for a faster reply.
        </p>
      </form>
    </aside>
  )
}
