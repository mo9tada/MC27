import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeWheel } from "@/lib/wheel";

import PrizeDialog from "./prize-dialog";
import { deletePrize } from "./actions";

const TABS = [
  { wheel: "store", label: "Roue boutique" },
  { wheel: "delivery", label: "Roue livraison" },
] as const;

export default async function AdminPrizesPage({
  searchParams,
}: {
  searchParams: Promise<{ wheel?: string }>;
}) {
  const { wheel: wheelParam } = await searchParams;
  const wheel = normalizeWheel(wheelParam);

  const prizes = await prisma.wheelPrize.findMany({
    where: { wheel },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const totalWeight = prizes.reduce((sum, prize) => sum + Math.max(0, prize.weight), 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Lots de la roue</h1>
          <p className="mt-1 text-sm text-white/60">
            Ce sont les segments de la roue {wheel === "delivery" ? "livraison" : "boutique"} publique. Les
            changements s&apos;appliquent immédiatement.
          </p>
        </div>
        <PrizeDialog mode="create" wheel={wheel} defaultOrder={prizes.length} />
      </div>

      <div className="flex gap-1.5">
        {TABS.map((tab) => (
          <Link
            key={tab.wheel}
            href={tab.wheel === "store" ? "/admin/prizes" : `/admin/prizes?wheel=${tab.wheel}`}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm transition-colors",
              wheel === tab.wheel ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="animate-in fade-in overflow-hidden rounded-xl border border-white/10 bg-[#102c4e]/60 backdrop-blur duration-500">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70">Couleur</TableHead>
              <TableHead className="text-white/70">Libellé</TableHead>
              <TableHead className="text-white/70">Poids</TableHead>
              <TableHead className="text-white/70">Probabilité</TableHead>
              <TableHead className="text-white/70">Ordre</TableHead>
              <TableHead className="text-white/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prizes.map((prize) => {
              const chance = totalWeight > 0 ? (Math.max(0, prize.weight) / totalWeight) * 100 : 0;

              return (
                <TableRow key={prize.id} className="border-white/10 text-white">
                  <TableCell>
                    <span
                      className="inline-block size-5 rounded-full ring-1 ring-white/30"
                      style={{ backgroundColor: prize.color }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{prize.label}</TableCell>
                  <TableCell className="text-white/70">{prize.weight}</TableCell>
                  <TableCell className="text-white/70">{chance.toFixed(1)}%</TableCell>
                  <TableCell className="text-white/70">{prize.order}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <PrizeDialog mode="edit" wheel={wheel} prize={prize} />
                      <form action={deletePrize}>
                        <input type="hidden" name="id" value={prize.id} />
                        <input type="hidden" name="wheel" value={wheel} />
                        <Button type="submit" size="sm" variant="destructive">
                          <Trash2 className="mr-1.5 size-3.5" />
                          Supprimer
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {prizes.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="text-center text-white/50">
                  Aucun lot pour le moment. Ajoutez-en un pour remplir la roue.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
