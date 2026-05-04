import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function SellSuccessPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-28">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-foreground" />
        <h1 className="mt-5 text-heading-lg">Listing submitted</h1>
        <p className="mt-3 text-body-md text-muted-foreground">
          Your property is now in the admin approval queue. It will stay hidden
          from public search results until an admin approves it.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/properties?type=buy">Browse listings</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sell">Submit another</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
