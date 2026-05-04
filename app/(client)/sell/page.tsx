import type { Metadata } from "next"

import { SellPropertyForm } from "./SellPropertyForm"

export const metadata: Metadata = {
  title: "Sell or Rent Your Home | EstateKit",
  description:
    "Submit a home for sale or rent and send it into the EstateKit admin approval workflow.",
}

export default function SellPage() {
  return (
    <main className="min-h-screen bg-background px-6 pb-16 pt-28">
      <div className="mx-auto grid w-full max-w-6xl gap-8">
        <section className="grid gap-4">
          <p className="text-eyebrow text-muted-foreground">Owner listing</p>
          <div className="grid gap-4 lg:grid-cols-[1fr_24rem] lg:items-end">
            <div>
              <h1 className="text-page-title">Sell or rent your home</h1>
              <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">
                Create a property submission with photos, pricing, home details,
                amenities, and rental terms. Approved listings become visible in
                the public marketplace.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-label">Approval workflow</p>
              <p className="mt-2 text-caption text-muted-foreground">
                Submissions are saved as pending, reviewed in the admin
                dashboard, then published or rejected from the approval queue.
              </p>
            </div>
          </div>
        </section>

        <SellPropertyForm />
      </div>
    </main>
  )
}
