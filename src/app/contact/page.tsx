"use client";

import { useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircleQuestion, CircleCheck } from "lucide-react";

import Navbar from "@/components/navbar";
import VideoBackground from "@/components/video-background";
import { FloatPanel } from "@/components/float-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { submitContactMessage } from "./actions";

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, undefined);

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      <VideoBackground overlayClassName="bg-[linear-gradient(180deg,_rgba(7,21,38,0.88),_rgba(16,44,78,0.9))]" blobs />
      <Navbar />

      <section className="relative z-10 mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
            <span className="size-2 rounded-full bg-[#c58d5a]" />
            <span>MC27 Coffee — Q&A</span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Questions & answers</h1>
          <p className="mt-3 text-white/70">
            Ask us anything — opening hours, catering, private events. Our team replies by email.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
        <FloatPanel>
          <p className="text-sm text-[#c58d5a]">We usually reply within a day</p>
          <h2 className="font-heading mt-1 flex items-center gap-2 text-xl text-white">
            <MessageCircleQuestion className="size-5 text-[#c58d5a]" />
            Send us a message
          </h2>

          <div className="mt-6">
            <AnimatePresence mode="wait">
            {state?.success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-3 py-6 text-center"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 15 }}
                >
                  <CircleCheck className="size-10 text-emerald-400" />
                </motion.span>
                <p className="text-white">Thanks! Your message has been sent.</p>
                <p className="text-sm text-white/70">We&apos;ll get back to you by email soon.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                action={formAction}
                className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-white/80">Name</Label>
                    <Input id="name" name="name" placeholder="Jane Doe" required />
                    {state?.fieldErrors?.name && (
                      <p className="text-xs text-red-300">{state.fieldErrors.name[0]}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-white/80">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="jane@example.com" required />
                    {state?.fieldErrors?.email && (
                      <p className="text-xs text-red-300">{state.fieldErrors.email[0]}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-white/80">Subject</Label>
                  <Input id="subject" name="subject" placeholder="Catering for a private event" required />
                  {state?.fieldErrors?.subject && (
                    <p className="text-xs text-red-300">{state.fieldErrors.subject[0]}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-white/80">Message</Label>
                  <Textarea id="message" name="message" rows={5} placeholder="How can we help?" required />
                  {state?.fieldErrors?.message && (
                    <p className="text-xs text-red-300">{state.fieldErrors.message[0]}</p>
                  )}
                </div>

                {state?.error && <p className="text-sm text-red-300">{state.error}</p>}

                <Button type="submit" disabled={isPending} className="w-full bg-[#163b66] text-white hover:bg-[#102c4e]">
                  {isPending ? "Sending..." : "Send message"}
                </Button>
              </motion.form>
            )}
            </AnimatePresence>
          </div>
        </FloatPanel>
        </motion.div>
      </section>
    </main>
  );
}
