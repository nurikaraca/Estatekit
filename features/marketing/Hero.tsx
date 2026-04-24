"use client"

import SearchBar from "@/components/search/SearchBar"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"

const Hero = () => {
    const shouldReduceMotion = useReducedMotion()

    return (
        <div className="relative w-full h-[550px] mb-8 overflow-hidden">

            <Image
                src="/hero-image.jpg"
                alt="Hero Image"
                fill
                className="object-cover "
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-black/40 " />

            {/* content */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
                <motion.h1
                    className="text-heading-lg md:text-6xl font-bold"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                    Find Your Dream Home
                </motion.h1>

                <motion.p
                    className="mt-4 max-w-xl"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    Discover the best properties in the market with ease.
                </motion.p>

                <motion.div
                    className="mt-8 w-full flex justify-center"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.65, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                    <SearchBar />
                </motion.div>
            </motion.div>

        </div>
    )
}

export default Hero
