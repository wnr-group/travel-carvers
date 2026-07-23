export default function AdminLoading() {
  return (
    <div className="py-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>

      <div className="mb-8 h-9 w-56 animate-pulse rounded-lg bg-black/10" />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-xl bg-black/5" />
        ))}
      </div>

      <div className="h-72 animate-pulse rounded-xl bg-black/5" />
    </div>
  );
}
