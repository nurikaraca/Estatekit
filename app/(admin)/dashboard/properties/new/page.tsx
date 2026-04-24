import { NewPropertyForm } from "./NewPropertyForm"

export default function NewPropertyPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-heading-lg text-neutral-950 dark:text-white">
          New property
        </h1>
        <p className="mt-2 text-caption text-neutral-500 dark:text-neutral-300">
          Images are uploaded server-side with the service role key.
        </p>
      </div>

      <NewPropertyForm />
    </div>
  )
}
