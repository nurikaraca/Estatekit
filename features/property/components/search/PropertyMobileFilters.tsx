"use client"

import { SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type PropertyMobileFiltersProps = {
  activeFilterCount: number
  children: React.ReactNode
}

export function PropertyMobileFilters({
  activeFilterCount,
  children,
}: PropertyMobileFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-full px-4 text-base font-semibold md:hidden"
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {activeFilterCount > 0 ? ` (${activeFilterCount})` : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[88vh] rounded-t-[2rem]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Narrow listings by budget, rooms, baths, and home type.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 overflow-y-auto px-6 pb-6">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
