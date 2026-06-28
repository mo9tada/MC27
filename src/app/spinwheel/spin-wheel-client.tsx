"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";
import { Download } from "lucide-react";

import Navbar from "@/components/navbar";
import VideoBackground from "@/components/video-background";
import { FloatPanel } from "@/components/float-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { spinWheel } from "./actions";

export type WheelPrizeView = { id: string; label: string; color: string };

const SPIN_DURATION_MS = 3200;
const RIM_DOTS = 16;

function buildWheelBackground(prizes: WheelPrizeView[], sliceAngle: number) {
  const stops = prizes.map((prize, index) => {
    const start = index * sliceAngle;
    const end = start + sliceAngle;
    return `${prize.color} ${start}deg ${end}deg`;
  });
  return `conic-gradient(from 0deg, ${stops.join(", ")})`;
}

export default function SpinWheelClient({ prizes }: { prizes: WheelPrizeView[] }) {
  const [state, formAction, isPending] = useActionState(spinWheel, undefined);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const sliceAngle = prizes.length > 0 ? 360 / prizes.length : 360;

  useEffect(() => {
    if (state?.segmentIndex === undefined) {
      return;
    }

    const targetCenter = state.segmentIndex * sliceAngle + sliceAngle / 2;
    const extraSpins = 5;
    const newRotation = extraSpins * 360 + (360 - targetCenter);

    setShowResult(false);
    setIsSpinning(true);
    setRotation(newRotation);

    timeoutRef.current = window.setTimeout(() => {
      setIsSpinning(false);
      setShowResult(true);

      if (state.prize && state.prize !== "Try Again") {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#c58d5a", "#163b66", "#ffffff"],
        });
      }
    }, SPIN_DURATION_MS);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [state, sliceAngle]);

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <VideoBackground overlayClassName="bg-[linear-gradient(180deg,_rgba(7,21,38,0.9),_rgba(16,44,78,0.92))]" blobs />
      <Navbar />

      <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur"
        >
          <span className="size-2 rounded-full bg-[#c58d5a]" />
          <span>MC27 Coffee — Spin & Win</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          Spin to win
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 max-w-xl text-white/70"
        >
          Enter your details and spin the wheel for a one-time discount. Your prize comes with a downloadable
          voucher PDF.
        </motion.p>

        {prizes.length === 0 ? (
          <FloatPanel className="mt-10 w-full max-w-md">
            <p className="text-white/80">The wheel is currently being refreshed. Please check back soon.</p>
          </FloatPanel>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15, type: "spring", stiffness: 120, damping: 14 }}
              className="relative mt-10 flex flex-col items-center"
            >
              {/* soft amber glow behind the wheel */}
              <div
                aria-hidden
                className="pointer-events-none absolute size-80 rounded-full bg-[#c58d5a]/25 blur-3xl sm:size-[26rem]"
              />

              {/* pointer */}
              <motion.div
                className="absolute -top-2 left-1/2 z-30 -translate-x-1/2"
                animate={isSpinning ? { y: [0, 4, 0] } : {}}
                transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
              >
                <div className="size-0 border-x-[12px] border-t-[22px] border-x-transparent border-t-[#f0c890] drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]" />
              </motion.div>

              {/* wheel assembly */}
              <div className="relative size-72 sm:size-80">
                {/* metallic gold rim (static) */}
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#8c5f39,#f7e0b5,#c58d5a,#f0c890,#8c5f39,#c58d5a,#f7e0b5,#8c5f39)] p-[7px] shadow-[0_10px_40px_-5px_rgba(0,0,0,0.6)]">
                  {/* rotating wheel */}
                  <div
                    className="relative size-full overflow-hidden rounded-full ring-2 ring-[#071526]/40"
                    style={{
                      background: buildWheelBackground(prizes, sliceAngle),
                      transform: `rotate(${rotation}deg)`,
                      transition: `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`,
                    }}
                  >
                    {/* thin spoke dividers between slices */}
                    {prizes.map((prize, index) => (
                      <div
                        key={`divider-${prize.id}`}
                        className="absolute inset-0"
                        style={{ transform: `rotate(${index * sliceAngle}deg)` }}
                      >
                        <div className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 bg-white/25" />
                      </div>
                    ))}

                    {/* prize labels */}
                    {prizes.map((prize, index) => {
                      const angle = index * sliceAngle + sliceAngle / 2;

                      return (
                        <div key={prize.id} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                          <span className="absolute top-4 left-1/2 w-16 -translate-x-1/2 text-center text-[10px] leading-tight font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] sm:top-5 sm:w-20 sm:text-xs">
                            {prize.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* static glowing rim lights */}
                {Array.from({ length: RIM_DOTS }).map((_, index) => (
                  <div
                    key={`dot-${index}`}
                    className="absolute inset-0"
                    style={{ transform: `rotate(${(index * 360) / RIM_DOTS}deg)` }}
                  >
                    <motion.span
                      className="absolute left-1/2 top-[3px] size-1.5 -translate-x-1/2 rounded-full bg-[#f7e0b5] shadow-[0_0_8px_2px_rgba(247,224,181,0.8)]"
                      animate={{ opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: (index % 4) * 0.2, ease: "easeInOut" }}
                    />
                  </div>
                ))}

                {/* branded center hub */}
                <motion.div
                  className="absolute left-1/2 top-1/2 z-20 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#071526] shadow-lg ring-2 ring-[#c58d5a]/70"
                  animate={isSpinning ? { scale: [1, 1.12, 1], rotate: [0, 8, -8, 0] } : { scale: 1 }}
                  transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
                >
                  <span className="font-heading text-sm font-semibold tracking-tight text-[#c58d5a]">MC27</span>
                </motion.div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {!showResult && (
                <motion.div
                  key="spin-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                  className="w-full max-w-md"
                >
                  <FloatPanel className="mt-10 w-full max-w-md">
                    <p className="text-sm text-[#c58d5a]">One spin per email</p>
                    <h2 className="font-heading mt-1 text-xl text-white">Enter your details</h2>

                    <form action={formAction} className="mt-6 space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-white/80">Name</Label>
                        <Input id="name" name="name" placeholder="Jane Doe" required disabled={isSpinning} />
                        {state?.fieldErrors?.name && (
                          <p className="text-xs text-red-300">{state.fieldErrors.name[0]}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-white/80">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="jane@example.com" required disabled={isSpinning} />
                        {state?.fieldErrors?.email && (
                          <p className="text-xs text-red-300">{state.fieldErrors.email[0]}</p>
                        )}
                      </div>

                      {state?.error && <p className="text-sm text-red-300">{state.error}</p>}

                      <Button
                        type="submit"
                        disabled={isPending || isSpinning}
                        className="w-full bg-[#163b66] text-white hover:bg-[#102c4e]"
                      >
                        {isPending || isSpinning ? "Spinning..." : "Spin the wheel"}
                      </Button>
                    </form>
                  </FloatPanel>
                </motion.div>
              )}

              {showResult && state?.prize && (
                <motion.div
                  key="spin-result"
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.45, type: "spring", stiffness: 180, damping: 16 }}
                  className="w-full max-w-md"
                >
                  <FloatPanel glow="navy" className="mt-10 w-full max-w-md">
                    <p className="text-sm text-[#c58d5a]">
                      {state.alreadySpun ? "You already spun today — here's your prize" : "Congratulations!"}
                    </p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <h2 className="font-heading mt-1 text-3xl text-white">{state.prize}</h2>
                    </motion.div>

                    <div className="mt-6 space-y-4">
                      <p className="text-sm text-white/70">
                        Voucher code <span className="font-semibold text-[#c58d5a]">{state.code}</span>
                      </p>
                      <a href={`/api/wheel/${state.id}`} download>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button className="w-full bg-[#163b66] text-white hover:bg-[#102c4e]">
                            <Download className="mr-2 size-4" />
                            Download voucher PDF
                          </Button>
                        </motion.div>
                      </a>
                    </div>
                  </FloatPanel>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </section>
    </main>
  );
}
