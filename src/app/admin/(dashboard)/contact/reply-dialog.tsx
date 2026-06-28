"use client";

import { useActionState, useEffect, useState } from "react";
import { Reply } from "lucide-react";

import { Button } from "@/components/ui/button";
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

import { replyToContactMessage } from "./actions";

type Props = {
  id: string;
  name: string;
  subject: string;
  message: string;
  existingReply: string | null;
};

export default function ReplyDialog({ id, name, subject, message, existingReply }: Props) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(replyToContactMessage, undefined);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <Reply className="mr-1.5 size-3.5" />
        {existingReply ? "View / edit reply" : "Reply"}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reply to {name}</DialogTitle>
          <DialogDescription>{subject}</DialogDescription>
        </DialogHeader>

        <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">{message}</p>

        <form action={formAction} className="space-y-3">
          <input type="hidden" name="id" value={id} />
          <Textarea
            name="reply"
            rows={4}
            placeholder="Write your reply..."
            defaultValue={existingReply ?? ""}
            required
          />
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Send reply"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
