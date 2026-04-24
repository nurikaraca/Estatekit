import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminConfigNotice({ message }: { message: string }) {
  return (
    <Card className="border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100">
      <CardHeader>
        <CardTitle>Supabase admin key is required</CardTitle>
        <CardDescription className="text-amber-800 dark:text-amber-200/80">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6">
          Add <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900/60">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          to <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900/60">.env.local</code>, then restart the dev server. This key must stay server-only and must never use the <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900/60">NEXT_PUBLIC_</code> prefix.
        </p>
      </CardContent>
    </Card>
  )
}
