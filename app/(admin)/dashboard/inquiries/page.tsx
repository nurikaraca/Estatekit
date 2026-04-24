import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminInquiriesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inquiries</CardTitle>
        <CardDescription>
          Buyer and renter inquiries will be managed from this queue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
          Inquiry capture is not connected yet, but the route is ready for the
          production workflow.
        </p>
      </CardContent>
    </Card>
  )
}
