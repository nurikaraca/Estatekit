export function PropertyEmptyState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/70 p-10 text-center dark:border-white/10 dark:bg-white/5">
      <p className="text-heading-md text-neutral-950 dark:text-white">
        No matches for these filters yet.
      </p>
      <p className="mt-2 text-body-md text-neutral-500 dark:text-neutral-300">
        Try a different location, lower the minimum price, or switch the active
        property type.
      </p>
    </div>
  )
}
