import Link from "next/link";
import { Users, Trash2 } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import EventDialog, { type EventDialogData } from "./event-dialog";
import { deleteEvent } from "./actions";

function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
}

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { attendees: true } } },
  });

  const now = new Date();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
          <p className="mt-1 text-sm text-white/60">Create and manage events shown on the public Events page.</p>
        </div>
        <EventDialog mode="create" />
      </div>

      <div className="animate-in fade-in overflow-hidden rounded-xl border border-white/10 bg-[#102c4e]/60 backdrop-blur duration-500">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70">Event</TableHead>
              <TableHead className="text-white/70">Date</TableHead>
              <TableHead className="text-white/70">RSVPs</TableHead>
              <TableHead className="text-white/70">Status</TableHead>
              <TableHead className="text-white/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => {
              const isPast = event.date < now;
              const data: EventDialogData = {
                id: event.id,
                title: event.title,
                description: event.description,
                dateLocal: toLocalInput(event.date),
                location: event.location,
                price: event.price,
                capacity: event.capacity,
                imageUrl: event.imageUrl,
                published: event.published,
              };

              return (
                <TableRow key={event.id} className="border-white/10 text-white">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {event.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={event.imageUrl} alt="" className="size-10 rounded-md object-cover" />
                      )}
                      <div>
                        <div className="font-medium">{event.title}</div>
                        {event.location && <div className="text-xs text-white/50">{event.location}</div>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-white/70">
                    {event.date.toLocaleDateString()} · {event.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                  <TableCell className="text-sm text-white/70">
                    <Link href={`/admin/events/${event.id}`} className="inline-flex items-center gap-1.5 hover:text-white">
                      <Users className="size-4" />
                      {event._count.attendees}
                      {event.capacity !== null ? ` / ${event.capacity}` : ""}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant={event.published ? "default" : "outline"}>
                        {event.published ? "Published" : "Draft"}
                      </Badge>
                      {isPast && <Badge variant="secondary">Past</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <EventDialog mode="edit" event={data} />
                      <form action={deleteEvent}>
                        <input type="hidden" name="id" value={event.id} />
                        <Button type="submit" size="sm" variant="destructive">
                          <Trash2 className="mr-1.5 size-3.5" />
                          Delete
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {events.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={5} className="text-center text-white/50">
                  No events yet. Add your first one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
