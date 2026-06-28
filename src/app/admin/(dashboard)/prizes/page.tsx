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

import PrizeDialog from "./prize-dialog";
import { deletePrize } from "./actions";

export default async function AdminPrizesPage() {
  const prizes = await prisma.wheelPrize.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const totalWeight = prizes.reduce((sum, prize) => sum + Math.max(0, prize.weight), 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Wheel prizes</h1>
          <p className="mt-1 text-sm text-white/60">
            These are the slices on the public spin wheel. Changes apply immediately.
          </p>
        </div>
        <PrizeDialog mode="create" defaultOrder={prizes.length} />
      </div>

      <div className="animate-in fade-in overflow-hidden rounded-xl border border-white/10 bg-[#102c4e]/60 backdrop-blur duration-500">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70">Color</TableHead>
              <TableHead className="text-white/70">Label</TableHead>
              <TableHead className="text-white/70">Weight</TableHead>
              <TableHead className="text-white/70">Win chance</TableHead>
              <TableHead className="text-white/70">Order</TableHead>
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
                      <PrizeDialog mode="edit" prize={prize} />
                      <form action={deletePrize}>
                        <input type="hidden" name="id" value={prize.id} />
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

            {prizes.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="text-center text-white/50">
                  No prizes yet. Add one to populate the wheel.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
