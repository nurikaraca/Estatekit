import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminFavoritesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorites</CardTitle>
        <CardDescription>
          Favorite analytics and saved-listing activity will live here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
          This section is prepared in the admin navigation and can be expanded
          once user favorite workflows are active.
        </p>
      </CardContent>
    </Card>
  )
}
