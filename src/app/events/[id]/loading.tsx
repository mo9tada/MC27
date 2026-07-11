import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { FloatPanel } from "@/components/float-panel";

// Instant skeleton shown while an event's detail streams in.
export default function EventDetailLoading() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Tous les événements
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <FloatPanel glow="amber">
          <div className="animate-pulse space-y-5">
            <div className="h-64 w-full rounded-2xl bg-white/10" />
            <div className="h-3 w-40 rounded bg-white/10" />
            <div className="h-8 w-3/4 rounded bg-white/15" />
            <div className="h-3 w-1/2 rounded bg-white/10" />
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-2/3 rounded bg-white/10" />
            </div>
          </div>
        </FloatPanel>

        <FloatPanel glow="navy" className="self-start">
          <div className="animate-pulse space-y-4">
            <div className="h-3 w-32 rounded bg-white/10" />
            <div className="h-6 w-2/3 rounded bg-white/15" />
            <div className="h-10 w-full rounded bg-white/10" />
            <div className="h-10 w-full rounded bg-white/10" />
            <div className="h-10 w-full rounded bg-white/15" />
          </div>
        </FloatPanel>
      </div>
    </section>
  );
}
