"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { QrCode } from "lucide-react";

import Navbar from "@/components/navbar";
import VideoBackground from "@/components/video-background";
import { FloatPanel } from "@/components/float-panel";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// TODO: place your QR code image in /public and update this path + the link target.
const QR_IMAGE_SRC = "/mc27qr.png";
const MENU_URL = "https://mc27m.vercel.app/";

export default function MenuPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      <VideoBackground overlayClassName="bg-[linear-gradient(180deg,_rgba(7,21,38,0.88),_rgba(16,44,78,0.9))]" blobs />
      <Navbar />

      <section className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
            <span className="size-2 rounded-full bg-[#c58d5a]" />
            <span>MC27 Coffee — Menu</span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Notre Menu</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.17, 0.67, 0.12, 0.99] as const }}
          className="w-full max-w-md"
        >
          <FloatPanel>
            <div className="flex flex-col items-center text-center">
              <h2 className="font-heading flex items-center gap-2 text-xl text-white">
                <QrCode className="size-5 text-[#c58d5a]" />
                Scannez pour découvrir
              </h2>
              <p className="mt-3 text-sm text-white/70">
                Scannez le code QR ci-dessous avec votre téléphone pour parcourir notre carte complète de boissons et
                de plats.
              </p>

              <div className="mt-6 w-full max-w-[252px] rounded-3xl bg-white p-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={QR_IMAGE_SRC}
                  alt="Code QR du menu MC27 Coffee"
                  width={220}
                  height={220}
                  className="aspect-square h-auto w-full object-contain"
                />
              </div>

              <Link
                href={MENU_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants(),
                  "mt-8 h-10 w-full bg-[#163b66] text-base text-white hover:bg-[#102c4e]",
                )}
              >
                Visiter le menu
              </Link>
            </div>
          </FloatPanel>
        </motion.div>
      </section>
    </main>
  );
}
