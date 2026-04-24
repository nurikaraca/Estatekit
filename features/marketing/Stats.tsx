"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

const stats = [
  { value: 10000, suffix: "+", label: "Properties Listed" },
  { value: 5000, suffix: "+", label: "Happy Clients" },
  { value: 120, suffix: "+", divisor: 1, label: "Cities" },
  { value: 24, suffix: "/7", divisor: 1, label: "Support" },
]

function formatStatValue(value: number, suffix: string) {
  if (suffix === "/7") {
    return `${Math.round(value)}/7`
  }

  return `${Math.round(value).toLocaleString("en-US")}${suffix}`
}

function AnimatedStat({
  value,
  suffix,
  label,
  index,
}: {
  value: number
  suffix: string
  divisor?: number
  label: string
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const shouldReduceMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? value : 0)

  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      return
    }

    let animationFrame = 0
    const duration = 1200
    const startTime = performance.now()

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      setDisplayValue(value * easedProgress)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick)
      }
    }

    animationFrame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, shouldReduceMotion, value])

  return (
    <motion.div
      ref={ref}
      className="rounded-2xl border border-black/5 bg-white/55 px-5 py-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
    >
      <motion.h3
        className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-white"
        animate={
          isInView && !shouldReduceMotion
            ? {
                textShadow: [
                  "0 0 0 rgba(255,255,255,0)",
                  "0 0 18px rgba(255,255,255,0.35)",
                  "0 0 0 rgba(255,255,255,0)",
                ],
              }
            : undefined
        }
        transition={{ duration: 1.4, delay: 0.2 + index * 0.1 }}
      >
        {formatStatValue(displayValue, suffix)}
      </motion.h3>
      <p className="mt-2 text-base font-semibold text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
    </motion.div>
  )
}

const Stats = () => {
  return (
    <section className="relative py-16 text-center">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <AnimatedStat key={stat.label} {...stat} index={index} />
        ))}
      </div>
    </section>
  )
}

export default Stats
