import { FloatPanel } from "@/components/float-panel";

// Instant skeleton shown while the events list streams in. The shared shell
// (navbar + background) comes from events/layout.tsx, so only this content
// area swaps — the navigation feels instant.
export default function EventsLoading() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
          <span className="size-2 rounded-full bg-[#c58d5a]" />
          <span>MC27 Coffee — À l&apos;affiche</span>
        </div>
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Événements à venir</h1>
        <p className="mt-3 text-white/70">
          Dégustations, ateliers de latte art, soirées musique live et plus encore. Réservez votre place ci-dessous.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <FloatPanel key={i} className="h-full">
            <div className="animate-pulse space-y-4">
              <div className="h-44 w-full rounded-2xl bg-white/10" />
              <div className="h-3 w-32 rounded bg-white/10" />
              <div className="h-6 w-3/4 rounded bg-white/15" />
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-2/3 rounded bg-white/10" />
            </div>
          </FloatPanel>
        ))}
      </div>
    </section>
  );
}
