"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"

export default function CTA() {
  const shouldReduceMotion = useReducedMotion()
  const trailAnimation = shouldReduceMotion
    ? {}
    : {
        x: ["-18%", "118%"],
        opacity: [0, 0.75, 0],
      }
  const glowAnimation = shouldReduceMotion
    ? {}
    : {
        boxShadow: [
          "0 0 0 rgba(37,99,235,0)",
          "0 0 34px rgba(37,99,235,0.28)",
          "0 0 0 rgba(37,99,235,0)",
        ],
      }

  return (
    <section className="relative overflow-hidden py-20 text-center">
      {!shouldReduceMotion ? (
        <div className="pointer-events-none absolute inset-0">
          {[18, 38, 58].map((top, index) => (
            <motion.span
              key={top}
              aria-hidden
              className="absolute h-px w-32 bg-gradient-to-r from-transparent via-blue-600/35 to-transparent dark:via-white/40"
              style={{ top: `${top}%`, left: "-8%" }}
              animate={trailAnimation}
              transition={{
                duration: 4.5 + index * 0.7,
                repeat: Infinity,
                repeatDelay: 3 + index,
                ease: "easeInOut",
                delay: index * 0.9,
              }}
            />
          ))}
        </div>
      ) : null}

      <motion.div
        className="relative mx-auto max-w-3xl px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >

        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to find your dream home?
        </h2>

        <p className="mt-4 text-gray-400 dark:text-blue-100">
          Start exploring properties and manage everything in one place.
        </p>

        <motion.div
          animate={glowAnimation}
          transition={{
            duration: 2.8,
            repeat: shouldReduceMotion ? 0 : Infinity,
            repeatDelay: 2.5,
            ease: "easeInOut",
          }}
          className="mx-auto mt-6 w-fit rounded-xl"
        >
          <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/properties?type=buy"
              className="inline-flex rounded-xl bg-white px-8 py-3 font-semibold text-blue-600 shadow-lg shadow-black/10 transition hover:bg-gray-100 dark:bg-white dark:text-neutral-950"
            >
          Get Started
            </Link>
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  )
}
