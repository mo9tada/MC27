// Instant skeleton for every admin dashboard section. The (dashboard) layout
// (background + nav + auth) persists across navigations, so switching sections
// shows this skeleton immediately while the section's data streams in.
export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-white/10" />

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#102c4e]/60 backdrop-blur">
        <div className="border-b border-white/10 p-4">
          <div className="h-5 w-full max-w-md animate-pulse rounded bg-white/10" />
        </div>
        <div className="divide-y divide-white/5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="h-4 flex-1 animate-pulse rounded bg-white/10" />
              <div className="hidden h-4 w-40 animate-pulse rounded bg-white/10 sm:block" />
              <div className="hidden h-4 w-24 animate-pulse rounded bg-white/10 sm:block" />
              <div className="h-7 w-20 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
