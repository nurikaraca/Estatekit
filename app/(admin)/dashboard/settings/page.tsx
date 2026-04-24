import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Workspace settings, listing defaults, and agency configuration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
          Settings are intentionally minimal for now while the core listing and
          approval workflows are being completed.
        </p>
      </CardContent>
    </Card>
  )
}
