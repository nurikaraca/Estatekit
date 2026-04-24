import * as React from "react"

import { cn } from "@/lib/utils"

type LogoProps = React.ComponentProps<"span">

export default function Logo({ className, ...props }: LogoProps) {
  return (
    <span
      className={cn("text-heading-lg font-bold tracking-tight", className)}
      {...props}
    >
      Estatekit
    </span>
  )
}
