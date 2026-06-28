import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminEventAttendeesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: { attendees: { orderBy: { createdAt: "asc" } } },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
      <div>
        <Link
          href="/admin/events"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          All events
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">{event.title}</h1>
        <p className="mt-1 text-sm text-white/60">
          {event.attendees.length}
          {event.capacity !== null ? ` / ${event.capacity}` : ""} attendees
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#102c4e]/60 backdrop-blur">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70">Name</TableHead>
              <TableHead className="text-white/70">Email</TableHead>
              <TableHead className="text-white/70">RSVP&apos;d</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {event.attendees.map((attendee) => (
              <TableRow key={attendee.id} className="border-white/10 text-white">
                <TableCell className="font-medium">{attendee.name}</TableCell>
                <TableCell className="text-sm text-white/70">{attendee.email}</TableCell>
                <TableCell className="text-sm text-white/70">
                  {attendee.createdAt.toLocaleDateString()} · {attendee.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </TableCell>
              </TableRow>
            ))}

            {event.attendees.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={3} className="text-center text-white/50">
                  No RSVPs yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
