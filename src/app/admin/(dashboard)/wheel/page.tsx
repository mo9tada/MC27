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

import { toggleRedeemed } from "./actions";

export default async function AdminWheelPage() {
  const spins = await prisma.wheelSpin.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight">Gains de la roue</h1>

      <div className="animate-in fade-in overflow-hidden rounded-xl border border-white/10 bg-[#102c4e]/60 backdrop-blur duration-500">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70">Client</TableHead>
              <TableHead className="text-white/70">Roue</TableHead>
              <TableHead className="text-white/70">Lot</TableHead>
              <TableHead className="text-white/70">Code</TableHead>
              <TableHead className="text-white/70">Date</TableHead>
              <TableHead className="text-white/70">Utilisé</TableHead>
              <TableHead className="text-white/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spins.map((spin) => (
              <TableRow key={spin.id} className="border-white/10 text-white">
                <TableCell>
                  <div className="font-medium">{spin.name}</div>
                  <div className="text-xs text-white/50">{spin.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={spin.wheel === "delivery" ? "default" : "outline"}>
                    {spin.wheel === "delivery" ? "Livraison" : "Boutique"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-white/70">{spin.prize}</TableCell>
                <TableCell className="font-mono text-sm text-[#c58d5a]">{spin.code}</TableCell>
                <TableCell className="text-sm text-white/70">{spin.createdAt.toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>
                  <Badge variant={spin.redeemed ? "secondary" : "outline"}>
                    {spin.redeemed ? "Utilisé" : "Non utilisé"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <form action={toggleRedeemed}>
                    <input type="hidden" name="id" value={spin.id} />
                    <input type="hidden" name="redeemed" value={String(spin.redeemed)} />
                    <Button type="submit" size="sm" variant="outline">
                      Marquer comme {spin.redeemed ? "non utilisé" : "utilisé"}
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}

            {spins.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={7} className="text-center text-white/50">
                  Aucun tour pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
