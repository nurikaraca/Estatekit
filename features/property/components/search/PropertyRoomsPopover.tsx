"use client"

import { ChevronDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

type PropertyRoomsPopoverProps = {
  value: string
  onValueChange: (value: string) => void
}

const roomSteps = [
  { value: "", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
]

const roomRangeOptions = [
  { value: "1", label: "1 room" },
  { value: "2", label: "2 rooms" },
  { value: "3", label: "3 rooms" },
  { value: "4", label: "4 rooms" },
  { value: "5", label: "5 rooms" },
]

const EMPTY_VALUE = "__empty"

export function PropertyRoomsPopover({
  value,
  onValueChange,
}: PropertyRoomsPopoverProps) {
  const activeLabel =
    roomSteps.find((option) => option.value === value)?.label ?? "Rooms"
  const selectedValue = value || EMPTY_VALUE

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-12 gap-3 rounded-lg px-4 text-base font-semibold"
        >
          {value ? `${activeLabel} rooms` : "Rooms"}
          {value ? <Badge variant="secondary">1</Badge> : null}
          <ChevronDown className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[460px] max-w-[calc(100vw-2rem)] p-0">
        <div className="px-5 py-4">
          <p className="text-xl font-semibold tracking-[-0.02em] text-neutral-950 dark:text-white">
            Bedrooms
          </p>
        </div>

        <div className="px-5">
          <div className="grid grid-cols-6 overflow-hidden rounded-lg border border-black/20 dark:border-white/15">
            {roomSteps.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onValueChange(option.value)}
                className={`h-14 border-r border-black/15 text-base font-medium last:border-r-0 dark:border-white/10 ${
                  value === option.value
                    ? "bg-neutral-100 text-neutral-950 dark:bg-white/15 dark:text-white"
                    : "bg-white text-neutral-700 hover:bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-white/10"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Or select bedrooms range
          </p>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <Select
              value={selectedValue}
              onValueChange={(nextValue) =>
                onValueChange(nextValue === EMPTY_VALUE ? "" : nextValue)
              }
            >
              <SelectTrigger className="h-14 rounded-lg border-black/30 text-base font-medium dark:border-white/20">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EMPTY_VALUE}>From</SelectItem>
                {roomRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-neutral-400">-</span>

            <Select value={EMPTY_VALUE} onValueChange={() => undefined}>
              <SelectTrigger className="h-14 rounded-lg border-black/30 text-base font-medium dark:border-white/20">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EMPTY_VALUE}>To</SelectItem>
                {roomRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />
        <div className="flex justify-end gap-3 p-4">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full"
            onClick={() => onValueChange("")}
          >
            Reset
          </Button>
          <Button type="submit" form="property-search-form" className="rounded-full px-5">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
