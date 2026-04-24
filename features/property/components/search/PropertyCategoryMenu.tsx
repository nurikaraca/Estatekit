"use client"

import { Building2, ChevronDown } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

export const propertyCategoryOptions = [
  { value: "houses", label: "Houses" },
  { value: "townhomes", label: "Townhomes" },
  { value: "multi-family", label: "Multi-family" },
  { value: "condos-co-ops", label: "Condos/Co-ops" },
  { value: "lots-land", label: "Lots/Land" },
  { value: "apartments", label: "Apartments" },
  { value: "manufactured", label: "Manufactured" },
]

type PropertyCategoryMenuProps = {
  formId: string
  selectedValues: string[]
  onSelectedValuesChange: (values: string[]) => void
}

export function PropertyCategoryMenu({
  formId,
  selectedValues,
  onSelectedValuesChange,
}: PropertyCategoryMenuProps) {
  const shouldReduceMotion = useReducedMotion()
  const selectedCount = selectedValues.length

  function toggleValue(value: string, checked: boolean) {
    onSelectedValuesChange(
      checked
        ? [...new Set([...selectedValues, value])]
        : selectedValues.filter((currentValue) => currentValue !== value)
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-12 gap-3 rounded-lg px-4 text-base font-semibold"
        >
          <Building2 className="size-4" />
          Home type
          {selectedCount > 0 ? (
            <Badge variant="secondary">{selectedCount}</Badge>
          ) : null}
          <ChevronDown className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <div className="px-5 py-4">
            <p className="text-base font-semibold text-neutral-950 dark:text-white">
              Home Type
            </p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Select the property styles to include.
            </p>
          </div>
          <Separator />

          <div className="grid gap-1 p-3">
            {propertyCategoryOptions.map((option) => {
              const checked = selectedValues.includes(option.value)

              return (
                <motion.label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-white/10"
                  whileHover={shouldReduceMotion ? undefined : { x: 2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(nextChecked) =>
                      toggleValue(option.value, Boolean(nextChecked))
                    }
                  />
                  <span className="flex-1">{option.label}</span>
                </motion.label>
              )
            })}
          </div>

          <Separator />
          <div className="flex items-center justify-between gap-3 p-4">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full"
              onClick={() => onSelectedValuesChange([])}
            >
              Clear
            </Button>
            <Button type="submit" form={formId} className="rounded-full px-5">
              Apply
            </Button>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  )
}
