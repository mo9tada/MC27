"use client";

import { useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { rsvpToEvent } from "./actions";

export default function RsvpForm({ eventId }: { eventId: string }) {
  const [state, formAction, isPending] = useActionState(rsvpToEvent, undefined);

  return (
    <AnimatePresence mode="wait">
      {state?.success ? (
        <motion.div
          key="rsvp-success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 py-4 text-center"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <CircleCheck className="size-10 text-emerald-400" />
          </motion.span>
          <p className="text-white">You&apos;re on the list!</p>
          <p className="text-sm text-white/70">We&apos;ll see you there. A reminder may follow by email.</p>
        </motion.div>
      ) : (
        <motion.form
          key="rsvp-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          action={formAction}
          className="space-y-4"
        >
          <input type="hidden" name="eventId" value={eventId} />
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-white/80">Name</Label>
            <Input id="name" name="name" placeholder="Jane Doe" required />
            {state?.fieldErrors?.name && <p className="text-xs text-red-300">{state.fieldErrors.name[0]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white/80">Email</Label>
            <Input id="email" name="email" type="email" placeholder="jane@example.com" required />
            {state?.fieldErrors?.email && <p className="text-xs text-red-300">{state.fieldErrors.email[0]}</p>}
          </div>

          {state?.error && <p className="text-sm text-red-300">{state.error}</p>}

          <Button type="submit" disabled={isPending} className="w-full bg-[#163b66] text-white hover:bg-[#102c4e]">
            {isPending ? "Reserving..." : "RSVP to this event"}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
