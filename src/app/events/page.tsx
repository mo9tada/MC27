import Link from "next/link";
import { CalendarDays, MapPin, Ticket, ArrowRight } from "lucide-react";

import Navbar from "@/components/navbar";
import VideoBackground from "@/components/video-background";
import { FloatPanel } from "@/components/float-panel";
import { getUpcomingEvents } from "@/lib/events-data";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  const day = date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return `${day} · ${time}`;
}

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      <VideoBackground overlayClassName="bg-[linear-gradient(180deg,_rgba(7,21,38,0.9),_rgba(16,44,78,0.92))]" blobs />
      <Navbar />

      <section className="relative z-10 mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
            <span className="size-2 rounded-full bg-[#c58d5a]" />
            <span>MC27 Coffee — What&apos;s on</span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Upcoming events</h1>
          <p className="mt-3 text-white/70">
            Tastings, latte-art workshops, live music nights and more. Reserve your spot below.
          </p>
        </div>

        {events.length === 0 ? (
          <FloatPanel className="mx-auto max-w-md text-center">
            <p className="text-white/80">No upcoming events right now — check back soon!</p>
          </FloatPanel>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {events.map((event) => {
              const spotsLeft = event.capacity ? Math.max(0, event.capacity - event._count.attendees) : null;
              const isFull = spotsLeft !== null && spotsLeft === 0;

              return (
                <Link key={event.id} href={`/events/${event.id}`} className="group block">
                  <FloatPanel className="h-full">
                    {event.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="mb-5 h-44 w-full rounded-2xl object-cover ring-1 ring-white/10"
                      />
                    )}

                    <p className="flex items-center gap-2 text-sm text-[#c58d5a]">
                      <CalendarDays className="size-4" />
                      {formatDate(event.date)}
                    </p>

                    <h2 className="font-heading mt-2 text-2xl text-white">{event.title}</h2>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/70">
                      {event.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-4" />
                          {event.location}
                        </span>
                      )}
                      {event.price && (
                        <span className="flex items-center gap-1.5">
                          <Ticket className="size-4" />
                          {event.price}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/70">{event.description}</p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-sm font-medium text-[#c58d5a] transition-transform group-hover:translate-x-1">
                        View &amp; RSVP <ArrowRight className="ml-1 inline size-4" />
                      </span>
                      {spotsLeft !== null && (
                        <span className={`text-xs ${isFull ? "text-red-300" : "text-white/60"}`}>
                          {isFull ? "Fully booked" : `${spotsLeft} spots left`}
                        </span>
                      )}
                    </div>
                  </FloatPanel>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
