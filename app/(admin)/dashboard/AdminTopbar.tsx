"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, Plus, Search } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { AppProfile } from "@/lib/supabase/auth"

import { AdminMobileNav } from "./AdminSidebar"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/properties": "Properties",
  "/dashboard/properties/new": "New property",
  "/dashboard/pending-approvals": "Pending Approvals",
  "/dashboard/users": "Users",
  "/dashboard/favorites": "Favorites",
  "/dashboard/inquiries": "Inquiries",
  "/dashboard/settings": "Settings",
}

function getPageTitle(pathname: string) {
  return pageTitles[pathname] ?? "Admin"
}

function getInitial(profile: AppProfile) {
  const name = profile.full_name || profile.email

  return name.charAt(0).toUpperCase()
}

export function AdminTopbar({ profile }: { profile: AppProfile }) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="size-4" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-border p-6">
              <SheetTitle>EstateKit</SheetTitle>
            </SheetHeader>
            <div className="flex min-h-[calc(100vh-5rem)] flex-col">
              <AdminMobileNav />
            </div>
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Admin
          </p>
          <h1 className="truncate text-xl font-semibold tracking-tight">
            {getPageTitle(pathname)}
          </h1>
        </div>

        <div className="hidden w-full max-w-xs items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 lg:flex">
          <Search className="size-4 text-muted-foreground" />
          <Input
            placeholder="Search admin..."
            className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <Button asChild className="hidden rounded-full sm:inline-flex">
          <Link href="/dashboard/properties/new">
            <Plus className="size-4" />
            New property
          </Link>
        </Button>

        <Button variant="outline" size="icon" className="rounded-full">
          <Bell className="size-4" />
          <span className="sr-only">Notifications</span>
        </Button>

        <Separator orientation="vertical" className="hidden h-8 sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 rounded-full px-2 pr-3">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {getInitial(profile)}
              </span>
              <span className="hidden max-w-32 truncate sm:inline">
                {profile.full_name || profile.email}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <span className="block truncate text-sm font-semibold text-foreground">
                {profile.full_name || "Admin"}
              </span>
              <span className="block truncate text-xs font-normal">
                {profile.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={signOutAction}>
              <DropdownMenuItem asChild variant="destructive">
                <button type="submit" className="w-full">
                  Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
