"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { createEvent, updateEvent, type EventFormState } from "./actions";

export type EventDialogData = {
  id: string;
  title: string;
  description: string;
  dateLocal: string;
  location: string | null;
  price: string | null;
  capacity: number | null;
  imageUrl: string | null;
  published: boolean;
};

type Props = { mode: "create"; event?: undefined } | { mode: "edit"; event: EventDialogData };

export default function EventDialog({ mode, event }: Props) {
  const [open, setOpen] = useState(false);
  const action = mode === "create" ? createEvent : updateEvent;
  const [state, formAction, isPending] = useActionState<EventFormState, FormData>(action, undefined);

  useEffect(() => {
    if (state?.success) setOpen(false);
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
            Add event
          </>
        ) : (
          <>
            <Pencil className="mr-1.5 size-3.5" />
            Edit
          </>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add an event" : "Edit event"}</DialogTitle>
          <DialogDescription>Events appear on the public Events page while published and upcoming.</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {mode === "edit" && <input type="hidden" name="id" value={event.id} />}

          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={event?.title ?? ""} placeholder="Latte art workshop" required />
            {state?.fieldErrors?.title && <p className="text-xs text-destructive">{state.fieldErrors.title[0]}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={event?.description ?? ""}
              placeholder="What's the event about?"
              required
            />
            {state?.fieldErrors?.description && (
              <p className="text-xs text-destructive">{state.fieldErrors.description[0]}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date &amp; time</Label>
              <Input id="date" name="date" type="datetime-local" defaultValue={event?.dateLocal ?? ""} required />
              {state?.fieldErrors?.date && <p className="text-xs text-destructive">{state.fieldErrors.date[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="capacity">Capacity (optional)</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min={1}
                defaultValue={event?.capacity ?? ""}
                placeholder="Unlimited"
              />
              {state?.fieldErrors?.capacity && (
                <p className="text-xs text-destructive">{state.fieldErrors.capacity[0]}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="location">Location (optional)</Label>
              <Input id="location" name="location" defaultValue={event?.location ?? ""} placeholder="MC27 Coffee" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (optional)</Label>
              <Input id="price" name="price" defaultValue={event?.price ?? ""} placeholder="Free entry" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image">Image (optional)</Label>
            {event?.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={event.imageUrl} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
            )}
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {event?.imageUrl ? "Upload a new file to replace the current image." : "JPG or PNG."}
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={event ? event.published : true}
              className="size-4 rounded border-input"
            />
            Published (visible on the public site)
          </label>

          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : mode === "create" ? "Add event" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
