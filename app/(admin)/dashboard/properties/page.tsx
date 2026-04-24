import Link from "next/link"
import { Check, Eye, MoreHorizontal, Pencil, Trash2, X } from "lucide-react"

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

import { AdminConfigNotice } from "../AdminConfigNotice"
import {
  deletePropertyAction,
  updatePropertyApprovalAction,
} from "./actions"

type AdminProperty = {
  id: number
  title: string
  location: string | null
  type: string | null
  price: number | null
  status_label: string | null
  approval_status: string | null
  owner_id: string | null
  created_at: string | null
}

type Profile = {
  id: string
  email: string
}

function formatDate(value: string | null) {
  if (!value) {
    return "Unknown"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function getApprovalVariant(status?: string | null) {
  if (status === "approved") {
    return "default" as const
  }

  if (status === "rejected") {
    return "outline" as const
  }

  return "secondary" as const
}

export default async function AdminPropertiesPage() {
  const { supabase, error: configError } = tryCreateSupabaseAdminClient()

  if (!supabase) {
    return <AdminConfigNotice message={configError ?? "Missing admin client."} />
  }

  const [{ data: properties, error }, { data: profiles }] = await Promise.all([
    supabase
      .from("properties")
      .select(
        "id, title, type, price, location, status_label, approval_status, owner_id, created_at"
      )
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, email"),
  ])

  if (error) {
    throw new Error(error.message)
  }

  const profileMap = new Map(
    ((profiles ?? []) as Profile[]).map((profile) => [profile.id, profile.email])
  )

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-heading-md">Properties</h2>
          <p className="mt-1 text-caption text-muted-foreground">
            Manage all active, pending, and rejected listings.
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/dashboard/properties/new">New property</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listings</CardTitle>
          <CardDescription>
            Review ownership, publication status, and approval workflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {((properties ?? []) as AdminProperty[]).map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="text-label">{property.title}</div>
                    <div className="text-eyebrow text-muted-foreground">
                      {property.type ?? "listing"}
                    </div>
                  </TableCell>
                  <TableCell>{property.location ?? "Unknown"}</TableCell>
                  <TableCell>
                    ${formatNumber(Number(property.price ?? 0))}
                  </TableCell>
                  <TableCell>
                    {property.owner_id
                      ? profileMap.get(property.owner_id) ?? "Unknown owner"
                      : "Agency"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {property.status_label ?? "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getApprovalVariant(property.approval_status)}>
                      {property.approval_status ?? "approved"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(property.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Open actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/properties/${property.id}`}>
                            <Eye className="size-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <form action={updatePropertyApprovalAction}>
                          <input
                            type="hidden"
                            name="propertyId"
                            value={property.id}
                          />
                          <input
                            type="hidden"
                            name="approvalStatus"
                            value="approved"
                          />
                          <DropdownMenuItem asChild>
                            <button type="submit" className="w-full">
                              <Check className="size-4" />
                              Approve
                            </button>
                          </DropdownMenuItem>
                        </form>
                        <form action={updatePropertyApprovalAction}>
                          <input
                            type="hidden"
                            name="propertyId"
                            value={property.id}
                          />
                          <input
                            type="hidden"
                            name="approvalStatus"
                            value="rejected"
                          />
                          <DropdownMenuItem asChild>
                            <button type="submit" className="w-full">
                              <X className="size-4" />
                              Reject
                            </button>
                          </DropdownMenuItem>
                        </form>
                        <DropdownMenuSeparator />
                        <form action={deletePropertyAction}>
                          <input
                            type="hidden"
                            name="propertyId"
                            value={property.id}
                          />
                          <DropdownMenuItem asChild variant="destructive">
                            <button type="submit" className="w-full">
                              <Trash2 className="size-4" />
                              Delete
                            </button>
                          </DropdownMenuItem>
                        </form>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
