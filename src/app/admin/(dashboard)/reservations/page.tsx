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

import { updateReservationStatus } from "./actions";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  confirmed: "default",
  seated: "secondary",
  cancelled: "destructive",
};

const statusLabel: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  seated: "Installée",
  cancelled: "Annulée",
};

const actionLabel: Record<string, string> = {
  confirmed: "Confirmer",
  seated: "Installer",
  cancelled: "Annuler",
};

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight">Réservations</h1>

      <div className="animate-in fade-in overflow-hidden rounded-xl border border-white/10 bg-[#102c4e]/60 backdrop-blur duration-500">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70">Client</TableHead>
              <TableHead className="text-white/70">Contact</TableHead>
              <TableHead className="text-white/70">Date / heure</TableHead>
              <TableHead className="text-white/70">Pers.</TableHead>
              <TableHead className="text-white/70">Statut</TableHead>
              <TableHead className="text-white/70">Vérifié</TableHead>
              <TableHead className="text-white/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id} className="border-white/10 text-white">
                <TableCell>
                  <div className="font-medium">{reservation.name}</div>
                  {reservation.notes && (
                    <div className="text-xs text-white/50">{reservation.notes}</div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-white/70">
                  <div>{reservation.email}</div>
                  <div>{reservation.phone}</div>
                </TableCell>
                <TableCell className="text-sm text-white/70">
                  {reservation.date.toLocaleDateString("fr-FR")} · {reservation.time}
                </TableCell>
                <TableCell>{reservation.partySize}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[reservation.status] ?? "outline"}>
                    {statusLabel[reservation.status] ?? reservation.status}
                  </Badge>
                </TableCell>
                <TableCell>{reservation.verified ? "Oui" : "Non"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {["confirmed", "seated", "cancelled"].map((status) => (
                      <form key={status} action={updateReservationStatus}>
                        <input type="hidden" name="id" value={reservation.id} />
                        <input type="hidden" name="status" value={status} />
                        <Button
                          type="submit"
                          size="sm"
                          variant={reservation.status === status ? "secondary" : "outline"}
                          disabled={reservation.status === status}
                        >
                          {actionLabel[status]}
                        </Button>
                      </form>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {reservations.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={7} className="text-center text-white/50">
                  Aucune réservation pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
