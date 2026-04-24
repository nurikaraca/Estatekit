"use client"

import { Search, X } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type PropertyLocationCommandProps = {
  value: string
  onValueChange: (value: string) => void
}

const locationSuggestions = [
  "Williamsburg, Brooklyn",
  "Brooklyn, New York",
  "North Williamsburg",
  "Domino Park",
  "Bedford Avenue",
]

export function PropertyLocationCommand({
  value,
  onValueChange,
}: PropertyLocationCommandProps) {
  const [open, setOpen] = useState(false)
  const suggestions = useMemo(() => {
    const normalizedValue = value.trim().toLowerCase()

    if (!normalizedValue) {
      return locationSuggestions
    }

    return locationSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(normalizedValue)
    )
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex h-12 min-w-[280px] max-w-[340px] flex-1 items-center gap-1 rounded-full border border-black/15 bg-white pl-5 pr-1 shadow-sm dark:border-white/10 dark:bg-neutral-950">
          <Input
            value={value}
            onChange={(event) => {
              onValueChange(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Williamsburg, Brooklyn"
            className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-base font-medium shadow-none focus-visible:ring-0"
          />
          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-neutral-500"
              onClick={() => onValueChange("")}
              aria-label="Clear location search"
            >
              <X className="size-4" />
            </Button>
          ) : null}
          <Button
            type="submit"
            size="icon"
            className="size-10 rounded-full bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            aria-label="Search"
          >
            <Search className="size-5" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[340px] p-0">
        <Command>
          <CommandInput
            value={value}
            onValueChange={onValueChange}
            placeholder="Search city, neighborhood, address..."
          />
          <CommandList>
            <CommandEmpty>No matching location.</CommandEmpty>
            <CommandGroup heading="Suggested areas">
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion}
                  value={suggestion}
                  onSelect={(selectedValue) => {
                    onValueChange(selectedValue)
                    setOpen(false)
                  }}
                >
                  {suggestion}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
