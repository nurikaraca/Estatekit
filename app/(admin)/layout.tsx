import { requireAdmin } from "@/lib/supabase/auth"

import { AdminSidebar } from "./dashboard/AdminSidebar"
import { AdminQueryProvider } from "./dashboard/AdminQueryProvider"
import { AdminTopbar } from "./dashboard/AdminTopbar"

export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AdminShell>{children}</AdminShell>
}

async function AdminShell({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin()

  return (
    <AdminQueryProvider>
      <section className="min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="min-h-screen lg:pl-72">
          <AdminTopbar profile={user} />
          <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </section>
    </AdminQueryProvider>
  )
}
