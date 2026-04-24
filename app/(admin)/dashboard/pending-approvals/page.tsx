import Link from "next/link"
import { Check, Eye, X } from "lucide-react"

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

import { AdminConfigNotice } from "../AdminConfigNotice"
import { updatePropertyApprovalAction } from "../properties/actions"

type PendingProperty = {
  id: number
  title: string
  location: string | null
  type: string | null
  price: number | null
  created_at: string | null
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

export default async function PendingApprovalsPage() {
  const { supabase, error: configError } = tryCreateSupabaseAdminClient()

  if (!supabase) {
    return <AdminConfigNotice message={configError ?? "Missing admin client."} />
  }

  const { data: properties, error } = await supabase
    .from("properties")
    .select("id, title, location, type, price, created_at")
    .eq("approval_status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-heading-md">
          Pending Approvals
        </h2>
        <p className="mt-1 text-caption text-muted-foreground">
          Review user-submitted listings before they become public.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval queue</CardTitle>
          <CardDescription>
            Only listings with approval_status set to pending are shown here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {((properties ?? []) as PendingProperty[]).map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="text-label">{property.title}</div>
                    <div className="text-eyebrow text-muted-foreground">
                      {property.type ?? "listing"}
                    </div>
                  </TableCell>
                  <TableCell>{property.location ?? "Unknown"}</TableCell>
                  <TableCell>${formatNumber(Number(property.price ?? 0))}</TableCell>
                  <TableCell>{formatDate(property.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">pending</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/properties/${property.id}`}>
                          <Eye className="size-4" />
                          Preview
                        </Link>
                      </Button>
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
                        <Button type="submit" size="sm">
                          <Check className="size-4" />
                          Approve
                        </Button>
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
                        <Button type="submit" variant="destructive" size="sm">
                          <X className="size-4" />
                          Reject
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {(properties ?? []).length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-body-sm text-muted-foreground">
              No pending approvals right now.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
