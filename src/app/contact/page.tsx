"use client";

import { useActionState, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircleQuestion, CircleCheck, Phone, Share2 } from "lucide-react";

import Navbar from "@/components/navbar";
import VideoBackground from "@/components/video-background";
import { FloatPanel } from "@/components/float-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { submitContactMessage } from "./actions";

// Lucide (this version) ships no brand icons, so the social marks are inline SVGs.
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M14 8.5V7c0-.7.3-1 1-1h1.5V3H14c-2.2 0-3.5 1.4-3.5 3.7v1.8H8V11h2.5v10H14V11h2.2l.4-2.5H14z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M16.7 3c.3 1.9 1.4 3.4 3.3 3.7v2.7c-1.2 0-2.4-.4-3.3-1v5.9c0 3-2.4 5.4-5.4 5.4s-5.4-2.4-5.4-5.4 2.4-5.4 5.4-5.4c.3 0 .5 0 .8.1v2.8c-.3-.1-.5-.1-.8-.1-1.4 0-2.6 1.2-2.6 2.6s1.2 2.6 2.6 2.6 2.6-1.2 2.6-2.6V3h2.4z" />
    </svg>
  );
}

// TODO: replace the hrefs and phone number with MC27's real accounts.
const socials: { label: string; handle: string; href: string; Icon: ComponentType<{ className?: string }> }[] = [
  { label: "Facebook", handle: "Club MC27", href: "https://www.facebook.com/clubmc27/", Icon: FacebookIcon },
  { label: "Instagram", handle: "@club_mc27", href: "https://instagram.com/club_mc27/", Icon: InstagramIcon },
  { label: "TikTok", handle: "@club.mc27", href: "https://tiktok.com/@club.mc27", Icon: TikTokIcon },
  { label: "Téléphone", handle: "+216 21 414 040", href: "tel:+21621414040", Icon: Phone },
];

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
            <span>MC27 Coffee — Questions</span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Questions & réponses</h1>
          <p className="mt-3 text-white/70">
            Posez-nous toutes vos questions — horaires, traiteur, événements privés. Notre équipe répond par e-mail.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-8"
        >
        <FloatPanel>
          <p className="text-sm text-[#c58d5a]">Restons en contact</p>
          <h2 className="font-heading mt-1 flex items-center gap-2 text-xl text-white">
            <Share2 className="size-5 text-[#c58d5a]" />
            Suivez-nous
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {socials.map(({ label, handle, href, Icon }) => {
              const external = href.startsWith("http");
              return (
                <motion.a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-[#c58d5a]/40 hover:bg-white/10"
                >
                  <div className="relative grid size-11 shrink-0 place-items-center rounded-full bg-white/5">
                    <span aria-hidden className="absolute inset-0 rounded-full bg-[#c58d5a]/30 blur-lg transition-colors group-hover:bg-[#c58d5a]/50" />
                    <Icon className="relative size-5 text-[#c58d5a]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="truncate text-xs text-white/60">{handle}</p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </FloatPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
        <FloatPanel>
          <p className="text-sm text-[#c58d5a]">Nous répondons généralement sous 24 h</p>
          <h2 className="font-heading mt-1 flex items-center gap-2 text-xl text-white">
            <MessageCircleQuestion className="size-5 text-[#c58d5a]" />
            Envoyez-nous un message
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
                <p className="text-white">Merci ! Votre message a bien été envoyé.</p>
                <p className="text-sm text-white/70">Nous vous répondrons bientôt par e-mail.</p>
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
                    <Label htmlFor="name" className="text-white/80">Nom</Label>
                    <Input id="name" name="name" placeholder="Jean Dupont" required />
                    {state?.fieldErrors?.name && (
                      <p className="text-xs text-red-300">{state.fieldErrors.name[0]}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-white/80">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="jean@exemple.com" required />
                    {state?.fieldErrors?.email && (
                      <p className="text-xs text-red-300">{state.fieldErrors.email[0]}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-white/80">Sujet</Label>
                  <Input id="subject" name="subject" placeholder="Traiteur pour un événement privé" required />
                  {state?.fieldErrors?.subject && (
                    <p className="text-xs text-red-300">{state.fieldErrors.subject[0]}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-white/80">Message</Label>
                  <Textarea id="message" name="message" rows={5} placeholder="Comment pouvons-nous vous aider ?" required />
                  {state?.fieldErrors?.message && (
                    <p className="text-xs text-red-300">{state.fieldErrors.message[0]}</p>
                  )}
                </div>

                {state?.error && <p className="text-sm text-red-300">{state.error}</p>}

                <Button type="submit" disabled={isPending} className="w-full bg-[#163b66] text-white hover:bg-[#102c4e]">
                  {isPending ? "Envoi..." : "Envoyer le message"}
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
