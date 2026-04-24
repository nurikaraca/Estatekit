import type { PropertyType } from "../types"

export function formatNumber(value: number) {
  return value.toLocaleString("en-US")
}

export function formatPrice(price: number, type: PropertyType) {
  if (type === "rent") {
    return `$${formatNumber(price)}/mo`
  }

  return `$${formatNumber(price)}`
}
