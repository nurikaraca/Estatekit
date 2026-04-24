"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"

import { formatNumber, formatPrice } from "../../lib/property-formatters"
import type { PropertyItem } from "../../types"

type PropertyCardProps = {
  property: PropertyItem
  index?: number
}

const MotionLink = motion.create(Link)

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <MotionLink
      href={`/properties/${property.id}`}
      className="grid gap-4 rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 md:grid-cols-[260px_minmax(0,1fr)]"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.055, 0.35),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.005 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
    >
      <div className="min-h-56 overflow-hidden rounded-[1.5rem] bg-neutral-100 dark:bg-neutral-900">
        <Image
          src={property.image.src}
          alt={property.image.alt}
          width={900}
          height={620}
          unoptimized
          className="size-full min-h-56 object-cover"
        />
      </div>

      <div className="flex flex-col justify-between gap-6 p-2">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700 dark:bg-white/10 dark:text-neutral-200">
              {property.statusLabel}
            </span>
            <span className="text-sm uppercase tracking-[0.18em] text-neutral-400">
              {property.location}
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950 dark:text-white">
              {property.title}
            </h2>
            <p className="text-lg font-medium text-neutral-700 dark:text-neutral-200">
              {formatPrice(property.price, property.type)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-base text-neutral-500 dark:text-neutral-300">
          <span>{property.beds} rooms</span>
          <span>{property.baths} baths</span>
          <span>{formatNumber(property.sqft)} sqft</span>
        </div>
      </div>
    </MotionLink>
  )
}
