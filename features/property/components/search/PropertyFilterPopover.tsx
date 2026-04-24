"use client"

import { ChevronDown } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import type { SelectOption } from "../../types"

type PropertyFilterPopoverProps = {
  label: string
  value: string
  options: SelectOption[]
  onValueChange: (value: string) => void
}

export function PropertyFilterPopover({
  label,
  value,
  options,
  onValueChange,
}: PropertyFilterPopoverProps) {
  const shouldReduceMotion = useReducedMotion()
  const activeOption = options.find((option) => option.value === value)
  const hasValue = Boolean(value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-12 gap-3 rounded-lg px-4 text-base font-semibold"
        >
          {hasValue ? activeOption?.label : label}
          {hasValue ? <Badge variant="secondary">1</Badge> : null}
          <ChevronDown className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-neutral-950 dark:text-white">
              {label}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Choose the minimum requirement.
            </p>
          </div>
          <Separator />
          <div className="grid gap-1 p-2">
            {options.map((option) => (
              <motion.div
                key={option.value || "empty"}
                whileHover={shouldReduceMotion ? undefined : { x: 2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant={value === option.value ? "secondary" : "ghost"}
                  className="h-10 w-full justify-start rounded-lg"
                  onClick={() => onValueChange(option.value)}
                >
                  {option.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  )
}
