"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()

  const handleSearch = () => {
    if (!query.trim()) return

    router.push(`/properties?search=${query}`)
  }

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto flex items-center gap-2 bg-white rounded-xl shadow-lg p-2 opacity-90"
      whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.005 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      
      <input
        type="text"
        placeholder="Search location, property..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-4 py-3 outline-none rounded-xl text-gray-700 placeholder:text-gray-500" />

      <motion.button
        type="button"
        onClick={handleSearch}
        className="rounded-xl px-6 py-3 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20"
        whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
      >
        <SearchIcon className="w-5 h-5 text-gray-500"  />
      </motion.button>

    </motion.div>
  )
}
