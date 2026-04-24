import Link from "next/link"
import { ArrowRight, Building2, CheckCircle2, Clock, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNumber } from "@/features/property/lib/property-formatters"
import { tryCreateSupabaseAdminClient } from "@/lib/supabase/admin"

import { AdminConfigNotice } from "./AdminConfigNotice"

type PropertyPreview = {
  id: number
  title: string
  location: string | null
  price: number | null
  approval_status: string | null
  created_at: string | null
}

function formatDate(value: string | null) {
  if (!value) {
    return "Unknown"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

export default async function DashboardPage() {
  const { supabase, error: configError } = tryCreateSupabaseAdminClient()

  if (!supabase) {
    return <AdminConfigNotice message={configError ?? "Missing admin client."} />
  }

  const [
    { count: propertyCount },
    { count: pendingCount },
    { count: userCount },
    { data: recentProperties },
    { data: pendingProperties },
  ] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("approval_status", "pending"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("id, title, location, price, approval_status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("properties")
      .select("id, title, location, price, approval_status, created_at")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      label: "Total properties",
      value: propertyCount ?? 0,
      icon: Building2,
    },
    {
      label: "Pending approvals",
      value: pendingCount ?? 0,
      icon: Clock,
    },
    {
      label: "Users",
      value: userCount ?? 0,
      icon: Users,
    },
    {
      label: "Approved listings",
      value: Math.max((propertyCount ?? 0) - (pendingCount ?? 0), 0),
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-heading-md">Dashboard</h2>
          <p className="mt-1 text-caption text-muted-foreground">
            A quick operational view of listings, approvals, and users.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/dashboard/pending-approvals">Review pending</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/dashboard/properties/new">New property</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-caption text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-heading-lg">
                    {formatNumber(stat.value)}
                  </p>
                </div>
                <div className="flex size-11 items-center justify-center rounded-2xl bg-muted">
                  <Icon className="size-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Recent properties</CardTitle>
              <CardDescription>Latest listings created by the team.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/properties">
                View all
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {((recentProperties ?? []) as PropertyPreview[]).map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="text-label">{property.title}</div>
                      <div className="text-caption text-muted-foreground">
                        {property.location ?? "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell>${formatNumber(Number(property.price ?? 0))}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {property.approval_status ?? "approved"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(property.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Pending approvals</CardTitle>
              <CardDescription>Listings waiting for admin review.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/pending-approvals">
                Review
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {((pendingProperties ?? []) as PropertyPreview[]).length > 0 ? (
                ((pendingProperties ?? []) as PropertyPreview[]).map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border p-3"
                  >
                    <div>
                      <p className="text-label">{property.title}</p>
                      <p className="text-caption text-muted-foreground">
                        {property.location ?? "Unknown"}
                      </p>
                    </div>
                    <Badge variant="secondary">pending</Badge>
                  </div>
                ))
              ) : (
                <p className="rounded-xl border border-dashed border-border p-6 text-body-sm text-muted-foreground">
                  No pending listings right now.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
