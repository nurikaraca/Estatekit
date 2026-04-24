"use client"

import Image from "next/image"
import { useState } from "react"
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type PropertyImageGalleryProps = {
  title: string
  images: Array<{
    src: string
    alt: string
  }>
}

export function PropertyImageGallery({ title, images }: PropertyImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const activeImage = images[activeIndex] ?? images[0]
  const shouldShowSideImages = images.length >= 4
  const sideImages = shouldShowSideImages
    ? images.filter((_, index) => index !== activeIndex).slice(0, 3)
    : []

  function openLightbox(index: number) {
    setActiveIndex(index)
    setIsLightboxOpen(true)
  }

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1))
  }

  function goToNext() {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1))
  }

  if (!activeImage) {
    return null
  }

  return (
    <>
      <div className="overflow-hidden rounded-[2rem] bg-neutral-100 shadow-sm dark:bg-neutral-900">
        <div
          className={
            shouldShowSideImages
              ? "grid h-[clamp(520px,68vh,680px)] gap-1.5 md:grid-cols-[minmax(0,2.25fr)_minmax(220px,0.72fr)]"
              : "grid h-[clamp(520px,68vh,680px)]"
          }
        >
          <div
            role="button"
            tabIndex={0}
            className="group relative min-h-0 overflow-hidden text-left"
            onClick={() => openLightbox(activeIndex)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                openLightbox(activeIndex)
              }
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage.src}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.015 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="size-full"
              >
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt}
                  width={1100}
                  height={760}
                  unoptimized
                  priority
                  className="size-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <Button
                type="button"
                variant="secondary"
                className="rounded-full bg-white/95 text-neutral-950 hover:bg-white"
                onClick={(event) => {
                  event.stopPropagation()
                  openLightbox(activeIndex)
                }}
              >
                <Camera className="size-4" />
                All {images.length} photos
              </Button>
              <span className="rounded-full bg-black/70 px-3 py-1 text-caption font-medium">
                {activeIndex + 1}/{images.length}
              </span>
            </div>
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  className="absolute left-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75"
                  onClick={(event) => {
                    event.stopPropagation()
                    goToPrevious()
                  }}
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75"
                  onClick={(event) => {
                    event.stopPropagation()
                    goToNext()
                  }}
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            ) : null}
          </div>

          {sideImages.length > 0 ? (
            <div className="hidden h-full grid-rows-[repeat(3,minmax(0,1fr))] gap-1.5 md:grid">
              {sideImages.map((image) => {
                const originalIndex = images.findIndex((item) => item.src === image.src)

                return (
                  <button
                    key={image.src}
                    type="button"
                    className="group relative h-full min-h-0 overflow-hidden bg-neutral-100 text-left dark:bg-neutral-900"
                    onClick={() => openLightbox(originalIndex)}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={520}
                      height={320}
                      unoptimized
                      className="size-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2 py-1 text-caption font-medium text-white">
                      {originalIndex + 1}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>

      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[94vh] max-w-[min(1180px,calc(100vw-2rem))] gap-0 overflow-hidden rounded-[2rem] border-white/10 bg-neutral-950 p-0 text-white shadow-2xl"
        >
          <DialogHeader className="flex flex-row items-center justify-between gap-4 border-b border-white/10 px-5 py-4 text-left">
            <div className="min-w-0">
              <DialogTitle className="truncate text-heading-sm text-white">
                {title}
              </DialogTitle>
              <DialogDescription className="text-neutral-400">
                {activeIndex + 1} of {images.length} photos
              </DialogDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/10 hover:text-white"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="size-5" />
              <span className="sr-only">Close gallery</span>
            </Button>
          </DialogHeader>

          <div className="relative grid min-h-[62vh] place-items-center bg-black">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeImage.src}-modal`}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.985 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="grid size-full place-items-center"
              >
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt || `${title} photo ${activeIndex + 1}`}
                  width={1400}
                  height={920}
                  unoptimized
                  className="max-h-[68vh] w-full object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 size-11 -translate-y-1/2 rounded-full bg-white/90 text-neutral-950 hover:bg-white"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="size-5" />
                  <span className="sr-only">Previous photo</span>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 size-11 -translate-y-1/2 rounded-full bg-white/90 text-neutral-950 hover:bg-white"
                  onClick={goToNext}
                >
                  <ChevronRight className="size-5" />
                  <span className="sr-only">Next photo</span>
                </Button>
              </>
            ) : null}
          </div>

          {images.length > 1 ? (
            <>
              <Separator className="bg-white/10" />
              <div className="bg-neutral-950 px-5 py-4">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-3 pb-3">
                    {images.map((image, index) => {
                      const isActive = index === activeIndex

                      return (
                        <button
                          key={`${image.src}-thumb-${index}`}
                          type="button"
                          className={[
                            "relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border transition",
                            isActive
                              ? "border-white ring-2 ring-white/70"
                              : "border-white/10 opacity-70 hover:opacity-100",
                          ].join(" ")}
                          onClick={() => setActiveIndex(index)}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt || `${title} thumbnail ${index + 1}`}
                            width={220}
                            height={160}
                            unoptimized
                            className="size-full object-cover"
                          />
                        </button>
                      )
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
