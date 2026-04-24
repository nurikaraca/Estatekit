"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { PropertyToolbarSelectProps } from "../../types"

const EMPTY_VALUE = "__empty"

export function PropertyToolbarSelect({
  label,
  name,
  value,
  options,
  showPlaceholder = true,
  onValueChange,
}: PropertyToolbarSelectProps) {
  const selectedValue = value || EMPTY_VALUE
  const normalizedOptions = options.filter((option) => option.value !== "")

  return (
    <Select
      value={selectedValue}
      onValueChange={(nextValue) =>
        onValueChange?.(nextValue === EMPTY_VALUE ? "" : nextValue)
      }
    >
      <SelectTrigger
        aria-label={label}
        data-filter-name={name}
        className="min-w-[118px]"
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {showPlaceholder ? (
          <SelectItem value={EMPTY_VALUE}>{label}</SelectItem>
        ) : null}
        {normalizedOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
