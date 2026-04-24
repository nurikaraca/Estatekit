"use client"

import { Maximize2, Minimize2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"

import { formatPrice } from "../../lib/property-formatters"
import type { PropertyItem } from "../../types"

type PropertyMapPanelProps = {
  properties: PropertyItem[]
}

const defaultMapBounds = {
  north: 40.735,
  south: 40.705,
  east: -73.94,
  west: -73.972,
}

function getMarkerPosition({ lat, lng }: PropertyItem["coordinates"]) {
  const x =
    ((lng - defaultMapBounds.west) /
      (defaultMapBounds.east - defaultMapBounds.west)) *
    100
  const northMercator = mercator(defaultMapBounds.north)
  const southMercator = mercator(defaultMapBounds.south)
  const y =
    ((northMercator - mercator(lat)) / (northMercator - southMercator)) * 100

  return {
    left: `${Math.min(Math.max(x, 4), 96)}%`,
    top: `${Math.min(Math.max(y, 6), 94)}%`,
  }
}

function mercator(lat: number) {
  const radians = (lat * Math.PI) / 180

  return Math.log(Math.tan(Math.PI / 4 + radians / 2))
}

function getMarkerTone(type: PropertyItem["type"]) {
  if (type === "rent") {
    return "bg-sky-600 text-white ring-sky-100 dark:bg-sky-400 dark:text-neutral-950 dark:ring-sky-900"
  }

  if (type === "sold") {
    return "bg-emerald-600 text-white ring-emerald-100 dark:bg-emerald-400 dark:text-neutral-950 dark:ring-emerald-900"
  }

  return "bg-neutral-950 text-white ring-neutral-200 dark:bg-white dark:text-neutral-950 dark:ring-neutral-700"
}

export function PropertyMapPanel({ properties }: PropertyMapPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const renderMapFrame = (isCompact = false) => (
    <div
      className={`relative h-full overflow-hidden rounded-[1.75rem] bg-neutral-100 dark:bg-neutral-900 ${
        isCompact ? "min-h-0" : "min-h-[560px] xl:min-h-0"
      }`}
    >
      <iframe
        title="Property map powered by OpenStreetMap"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-73.972%2C40.705%2C-73.94%2C40.735&layer=mapnik"
        className="absolute inset-0 size-full border-0 grayscale-[0.08] saturate-[0.95]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent,_rgba(255,255,255,0.08)_78%,_rgba(255,255,255,0.5))]" />

      {properties.map((property) => (
        <Link
          key={property.id}
          href={`/properties/${property.id}`}
          style={getMarkerPosition(property.coordinates)}
          className={`group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-xs font-semibold shadow-lg ring-4 transition-transform hover:z-20 hover:scale-105 ${getMarkerTone(
            property.type
          )}`}
        >
          {formatPrice(property.price, property.type)}
          <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden w-52 -translate-x-1/2 rounded-[1rem] bg-white p-3 text-left text-neutral-950 shadow-xl ring-1 ring-black/5 group-hover:block dark:bg-neutral-950 dark:text-white dark:ring-white/10">
            <span className="block text-sm font-semibold">
              {property.title}
            </span>
            <span className="mt-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {property.location}
            </span>
            <span className="mt-2 block font-mono text-[11px] text-neutral-400">
              {property.coordinates.lat.toFixed(4)},{" "}
              {property.coordinates.lng.toFixed(4)}
            </span>
          </span>
        </Link>
      ))}

    </div>
  )

  return (
    <aside className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 shadow-sm backdrop-blur xl:sticky xl:top-24 xl:h-[calc(100vh-7rem)] dark:border-white/10 dark:bg-white/5">
      <div className="absolute right-5 top-5 z-20 flex items-center gap-2">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur dark:bg-neutral-950/80 dark:text-neutral-200">
          OpenStreetMap
        </span>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => setIsExpanded(true)}
          className="size-10 rounded-full bg-white text-neutral-950 shadow-sm hover:bg-neutral-100"
          aria-label="Expand map"
        >
          <Maximize2 className="size-4" />
        </Button>
      </div>

      {renderMapFrame()}

      {isExpanded ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-6 backdrop-blur-sm">
          <div className="relative h-[min(780px,calc(100vh-4rem))] w-[min(1180px,calc(100vw-4rem))] overflow-hidden rounded-[1.75rem] border border-white/15 bg-white shadow-2xl dark:bg-neutral-950">
            {renderMapFrame(true)}
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setIsExpanded(false)}
              className="absolute right-4 top-4 z-30 size-9 rounded-full bg-white text-neutral-950 shadow-lg hover:bg-neutral-100"
              aria-label="Collapse map"
            >
              <Minimize2 className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </aside>
  )
}
