"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { createPrize, updatePrize, type PrizeFormState } from "./actions";

type Prize = { id: string; label: string; weight: number; color: string; order: number };

type Props =
  | { mode: "create"; defaultOrder: number; prize?: undefined }
  | { mode: "edit"; prize: Prize; defaultOrder?: undefined };

export default function PrizeDialog({ mode, prize, defaultOrder }: Props) {
  const [open, setOpen] = useState(false);
  const action = mode === "create" ? createPrize : updatePrize;
  const [state, formAction, isPending] = useActionState<PrizeFormState, FormData>(action, undefined);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          mode === "create" ? (
            <Button size="sm" className="bg-[#163b66] text-white hover:bg-[#102c4e]" />
          ) : (
            <Button size="sm" variant="outline" />
          )
        }
      >
        {mode === "create" ? (
          <>
            <Plus className="mr-1.5 size-3.5" />
            Add prize
          </>
        ) : (
          <>
            <Pencil className="mr-1.5 size-3.5" />
            Edit
          </>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add a prize" : "Edit prize"}</DialogTitle>
          <DialogDescription>
            Higher weight means a higher chance of landing on this slice. Set weight to 0 to keep a slice on the
            wheel without ever awarding it.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {mode === "edit" && <input type="hidden" name="id" value={prize.id} />}

          <div className="space-y-1.5">
            <Label htmlFor="label">Label</Label>
            <Input id="label" name="label" defaultValue={prize?.label ?? ""} placeholder="10% Off" required />
            {state?.fieldErrors?.label && <p className="text-xs text-destructive">{state.fieldErrors.label[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="weight">Weight (chance)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                min={0}
                max={1000}
                defaultValue={prize?.weight ?? 10}
                required
              />
              {state?.fieldErrors?.weight && (
                <p className="text-xs text-destructive">{state.fieldErrors.weight[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                min={0}
                max={999}
                defaultValue={prize?.order ?? defaultOrder ?? 0}
                required
              />
              {state?.fieldErrors?.order && (
                <p className="text-xs text-destructive">{state.fieldErrors.order[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="color">Slice color</Label>
            <input
              id="color"
              name="color"
              type="color"
              defaultValue={prize?.color ?? "#163b66"}
              className="h-9 w-full cursor-pointer rounded-lg border border-input bg-transparent"
            />
            {state?.fieldErrors?.color && <p className="text-xs text-destructive">{state.fieldErrors.color[0]}</p>}
          </div>

          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : mode === "create" ? "Add prize" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
