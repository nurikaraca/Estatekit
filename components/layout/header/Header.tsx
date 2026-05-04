import Link from "next/link"

import UserAccountMenu from "@/components/layout/header/UserAccountMenu"
import { Button } from "@/components/ui/button"
import ModeToggle from "@/components/ui/ModeToggle"
import Logo from "@/components/ui/logo"
import { getCurrentProfile } from "@/lib/supabase/auth"

const propertyLinks = [
  { href: "/properties?type=buy", label: "Buy" },
  { href: "/properties?type=rent", label: "Rent" },
  { href: "/sell", label: "Sell" },
]

async function getHeaderProfile() {
  try {
    return await getCurrentProfile()
  } catch {
    return null
  }
}

export default async function Header() {
  const profile = await getHeaderProfile()

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/70">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="transition-opacity hover:opacity-80"
          aria-label="Estatekit home"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-label text-neutral-600 md:flex dark:text-neutral-300">
          {propertyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-neutral-950 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {profile ? (
            <UserAccountMenu profile={profile} />
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="hidden rounded-full text-label text-neutral-600 sm:inline-flex dark:text-neutral-300"
              >
                <Link href="/login">Sign In</Link>
              </Button>

              <Button asChild className="rounded-full px-4 font-semibold">
                <Link href="/properties?type=buy">Get Started</Link>
              </Button>
            </>
          )}

          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
