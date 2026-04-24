"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  CheckCircle2,
  Heart,
  Home,
  Inbox,
  Settings,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  {
    href: "/dashboard/pending-approvals",
    label: "Pending Approvals",
    icon: CheckCircle2,
  },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

function AdminNavContent() {
  const pathname = usePathname()

  return (
    <>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-xl px-3 text-label text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isActive && "bg-muted text-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-2xl bg-muted p-4">
          <p className="text-label">Admin workspace</p>
          <p className="mt-1 text-caption text-muted-foreground">
            Manage listings, approvals, and platform users.
          </p>
        </div>
      </div>
    </>
  )
}

export function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-background lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="text-heading-sm tracking-tight">
          EstateKit
        </Link>
      </div>

      <AdminNavContent />
    </aside>
  )
}

export function AdminMobileNav() {
  return <AdminNavContent />
}
