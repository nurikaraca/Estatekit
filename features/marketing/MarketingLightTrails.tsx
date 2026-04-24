"use client"

import { motion, useReducedMotion } from "motion/react"

const trails = [
  { top: "12%", left: "-12%", width: 280, rotate: -8, delay: 0, duration: 6.5 },
  { top: "29%", left: "-18%", width: 360, rotate: 5, delay: 1.4, duration: 7.2 },
  { top: "47%", left: "-10%", width: 260, rotate: -3, delay: 2.2, duration: 6.8 },
  { top: "66%", left: "-16%", width: 340, rotate: 7, delay: 0.8, duration: 7.8 },
  { top: "82%", left: "-14%", width: 300, rotate: -6, delay: 3.1, duration: 7.4 },
]

export default function MarketingLightTrails() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(15,23,42,0.08),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.08),transparent_24%)] dark:bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(96,165,250,0.12),transparent_24%)]" />
      {trails.map((trail, index) => (
        <motion.span
          key={`${trail.top}-${index}`}
          aria-hidden
          className="absolute h-px rounded-full bg-gradient-to-r from-transparent via-neutral-950/30 to-transparent blur-[0.2px] dark:via-white/55"
          style={{
            top: trail.top,
            left: trail.left,
            width: trail.width,
            rotate: `${trail.rotate}deg`,
          }}
          animate={{
            x: ["0vw", "125vw"],
            opacity: [0, 0.75, 0],
          }}
          transition={{
            duration: trail.duration,
            repeat: Infinity,
            repeatDelay: 3.5 + index * 0.45,
            delay: trail.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
