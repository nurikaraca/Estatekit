import Link from "next/link"
import { LayoutDashboard, LogOut, UserRound } from "lucide-react"

import { signOutAction } from "@/app/(auth)/login/actions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AppProfile } from "@/lib/supabase/auth"

type UserAccountMenuProps = {
  profile: AppProfile
}

function getDisplayName(profile: AppProfile) {
  return profile.full_name || profile.email.split("@")[0] || "Account"
}

function getInitial(profile: AppProfile) {
  return getDisplayName(profile).trim().charAt(0).toUpperCase() || "U"
}

export default function UserAccountMenu({ profile }: UserAccountMenuProps) {
  const displayName = getDisplayName(profile)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-10 gap-2 rounded-full px-2 pr-3"
          aria-label="Open account menu"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950">
            {getInitial(profile)}
          </span>
          <span className="hidden max-w-32 truncate text-sm sm:inline">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel className="px-2 py-2">
          <span className="block truncate text-sm font-semibold text-neutral-950 dark:text-white">
            {displayName}
          </span>
          <span className="mt-0.5 block truncate text-xs font-normal text-neutral-500 dark:text-neutral-400">
            {profile.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {profile.role === "admin" ? (
          <DropdownMenuItem asChild className="cursor-pointer px-2 py-2">
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild className="cursor-pointer px-2 py-2">
            <Link href="/properties">
              <UserRound className="size-4" />
              My account
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <form action={signOutAction}>
          <DropdownMenuItem
            asChild
            className="cursor-pointer px-2 py-2 text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
          >
            <button type="submit" className="w-full">
              <LogOut className="size-4" />
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
