import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Ticket, Users } from "lucide-react";

import { FloatPanel } from "@/components/float-panel";
import { getEventForPublic } from "@/lib/events-data";

import RsvpForm from "./rsvp-form";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  const day = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${day} · ${time}`;
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventForPublic(id);

  if (!event) {
    notFound();
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const isPast = event.date < startOfToday;

  const spotsLeft = event.capacity !== null ? Math.max(0, event.capacity - event._count.attendees) : null;
  const isFull = spotsLeft !== null && spotsLeft === 0;

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
            {event.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.imageUrl}
                alt={event.title}
                className="mb-6 h-64 w-full rounded-2xl object-cover ring-1 ring-white/10"
              />
            )}

            <p className="flex items-center gap-2 text-sm text-[#c58d5a]">
              <CalendarDays className="size-4" />
              {formatDate(event.date)}
            </p>

            <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{event.title}</h1>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
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
              {event.capacity !== null && (
                <span className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  {event._count.attendees}/{event.capacity} inscrits
                </span>
              )}
            </div>

            <p className="mt-6 whitespace-pre-line leading-7 text-white/85">{event.description}</p>
          </FloatPanel>

          <FloatPanel glow="navy" className="self-start">
            <p className="text-sm text-[#c58d5a]">Réservez votre place</p>
            <h2 className="font-heading mt-1 text-xl text-white">Inscription</h2>

            <div className="mt-6">
              {isPast ? (
                <p className="text-white/70">Cet événement a déjà eu lieu.</p>
              ) : isFull ? (
                <p className="text-white/70">Cet événement est complet. Revenez pour les prochaines dates !</p>
              ) : (
                <>
                  {spotsLeft !== null && (
                    <p className="mb-4 text-sm text-white/60">{spotsLeft} places restantes</p>
                  )}
                  <RsvpForm eventId={event.id} />
                </>
              )}
            </div>
          </FloatPanel>
        </div>
      </section>
  );
}
