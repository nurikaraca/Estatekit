import { MoreHorizontal, Shield, UserRound } from "lucide-react"

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
import { tryCreateSupabaseAdminClient } from "@/lib/supabase/admin"

import { AdminConfigNotice } from "../AdminConfigNotice"
import { updateUserRoleAction } from "./actions"

type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: "admin" | "user"
  created_at: string
}

type PropertyOwner = {
  owner_id: string | null
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export default async function AdminUsersPage() {
  const { supabase, error: configError } = tryCreateSupabaseAdminClient()

  if (!supabase) {
    return <AdminConfigNotice message={configError ?? "Missing admin client."} />
  }

  const [{ data: profiles, error }, { data: properties }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, role, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("properties").select("owner_id"),
  ])

  if (error) {
    throw new Error(error.message)
  }

  const listingCountByOwner = ((properties ?? []) as PropertyOwner[]).reduce(
    (acc, property) => {
      if (!property.owner_id) {
        return acc
      }

      acc.set(property.owner_id, (acc.get(property.owner_id) ?? 0) + 1)
      return acc
    },
    new Map<string, number>()
  )

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-heading-md">Users</h2>
        <p className="mt-1 text-caption text-muted-foreground">
          Review account roles and user listing activity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>
            Admin role changes are controlled from this protected area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Listings</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Role management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {((profiles ?? []) as Profile[]).map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-muted text-label">
                        {(profile.full_name || profile.email)
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-label">
                          {profile.full_name || "Unnamed user"}
                        </p>
                        <p className="text-caption text-muted-foreground">
                          {profile.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>
                    <Badge variant={profile.role === "admin" ? "default" : "secondary"}>
                      {profile.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {listingCountByOwner.get(profile.id) ?? 0}
                  </TableCell>
                  <TableCell>{formatDate(profile.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Open role menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Set role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <form action={updateUserRoleAction}>
                          <input type="hidden" name="userId" value={profile.id} />
                          <input type="hidden" name="role" value="admin" />
                          <DropdownMenuItem asChild>
                            <button type="submit" className="w-full">
                              <Shield className="size-4" />
                              Make admin
                            </button>
                          </DropdownMenuItem>
                        </form>
                        <form action={updateUserRoleAction}>
                          <input type="hidden" name="userId" value={profile.id} />
                          <input type="hidden" name="role" value="user" />
                          <DropdownMenuItem asChild>
                            <button type="submit" className="w-full">
                              <UserRound className="size-4" />
                              Make user
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
