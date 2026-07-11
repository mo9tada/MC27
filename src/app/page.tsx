"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Coffee, Croissant, Disc3, Clock3, MapPin, CalendarCheck } from "lucide-react";

import Navbar from "../components/navbar";
import ScrollVideo from "../components/scroll-video";
import { FloatPanel } from "@/components/float-panel";
import { buttonVariants } from "@/components/ui/button";

const MotionLink = motion.create(Link);

const rotatingLines = [
  "Des matins tranquilles, un espresso parfaitement extrait.",
  "Des espaces aux tons bleu nuit pensés pour les conversations chaleureuses.",
  "Pâtisseries fraîches, service à table et une roue de réductions.",
];

const highlights = [
  {
    icon: Coffee,
    title: "Café torréfié maison et bons petits plats",
    description: "Des grains de pure origine torréfiés chaque semaine, préparés par des baristas qui soignent chaque tasse.",
  },
  {
    icon: CalendarCheck,
    title: "Réservation de table facile",
    description: "Réservez votre table en ligne et confirmez instantanément avec un code envoyé par e-mail.",
  },
  {
    icon: Disc3,
    title: "Tournez & gagnez",
    description: "Chaque visiteur a droit à un tour de notre roue de réductions, avec un bon en PDF à conserver.",
  },
];

const stats = [
  { value: "140+", label: "Articles au menu" },
  { value: "4.7/5", label: "Note des clients" },
  { value: "1", label: "Tour gratuit par jour" },
];

const details = [
  { icon: MapPin, label: "Adresse", value: "Menzel Temime, Nabeul" },
  { icon: Croissant, label: "Cuisine", value: "Pâtisseries fraîches chaque jour" },
  { icon: Clock3, label: "Horaires", value: "8:00 – 00:00" },
];

const heroContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.17, 0.67, 0.12, 0.99] as const } },
};

export default function Home() {
  const [currentLine, setCurrentLine] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const bottomSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentLine((value) => (value + 1) % rotatingLines.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isScrolling) {
      return;
    }

    const resetTimer = window.setTimeout(() => {
      setIsScrolling(false);
    }, 900);

    return () => window.clearTimeout(resetTimer);
  }, [isScrolling]);

  const scrollToBottom = () => {
    bottomSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsScrolling(true);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden text-foreground">
      <ScrollVideo
        baseSrc="/bg.mp4"
        src="/beans-scroll.mp4"
        overlayClassName="bg-[linear-gradient(180deg,_rgba(7,21,38,0.5),_rgba(7,21,38,0.72))]"
      />

      <motion.div
        aria-hidden
        className="fixed -left-32 top-1/4 -z-10 size-72 rounded-full bg-[#c58d5a]/20 blur-3xl"
        animate={{ y: [0, 30, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="fixed -right-24 top-1/2 -z-10 size-96 rounded-full bg-[#163b66]/30 blur-3xl"
        animate={{ y: [0, -40, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <Navbar />

      <section className="relative z-10 min-h-[88vh]">
        <div className="mx-auto flex min-h-[88vh] w-full max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <FloatPanel glow="amber" className="max-w-3xl">
            <motion.div variants={heroContainer} initial="hidden" animate="show">
              <motion.div
                variants={heroItem}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur"
              >
                <motion.span
                  className="size-2 rounded-full bg-[#c58d5a]"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span>MC27</span>
              </motion.div>

              <motion.h1
                variants={heroItem}
                className="font-heading max-w-2xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl"
              >
                MC27 Coffee, plus chaleureux, plus doux, plus vivant.
              </motion.h1>

              <motion.p variants={heroItem} className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                Café torréfié maison, pâtisseries et plats frais, et une table toujours prête pour vous.
              </motion.p>
              <motion.p variants={heroItem} className="mt-2 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                Réservez une table, posez-nous vos questions ou tournez la roue pour gagner un cadeau.
              </motion.p>

              <motion.div variants={heroItem} className="mt-8 flex flex-wrap items-center gap-3">
                <MotionLink
                  href="/reservations"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={buttonVariants({ className: "bg-[#163b66] text-white hover:bg-[#102c4e]" })}
                >
                  Réserver une table
                  <ArrowRight className="ml-2 size-4" />
                </MotionLink>
                <MotionLink
                  href="/spinwheel"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={buttonVariants({ variant: "outline", className: "border-white/20 bg-white/10 text-white hover:bg-white/15" })}
                >
                  <Disc3 className="mr-2 size-4" />
                  Tourner & gagner
                </MotionLink>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={scrollToBottom}
                  className={buttonVariants({ variant: "ghost", className: "text-white/80 hover:bg-white/10 hover:text-white" })}
                >
                  {isScrolling ? "Défilement..." : "En savoir plus"}
                </motion.button>
              </motion.div>
            </motion.div>
          </FloatPanel>
        </div>
      </section>

      <section
        id="bottom"
        ref={bottomSectionRef}
        className="relative z-10 mx-auto w-full max-w-6xl space-y-24 px-4 py-20 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-start gap-4">
            <motion.span
              className="mt-2 h-16 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#c58d5a] to-transparent"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#c58d5a]">L&apos;ambiance en direct</p>
              <h2 className="font-heading mt-2 grid overflow-hidden text-3xl text-white sm:text-4xl">
                {/* Invisible sizers reserve the tallest line's height at the current width, so no line is ever clipped. */}
                {rotatingLines.map((line) => (
                  <span key={line} aria-hidden className="invisible col-start-1 row-start-1 block">
                    {line}
                  </span>
                ))}
                <span className="col-start-1 row-start-1 block">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentLine}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.45 }}
                      className="block"
                    >
                      {rotatingLines[currentLine]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {details.map((detail, index) => {
              const Icon = detail.icon;

              return (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="flex items-start gap-3 border-white/10 sm:border-l sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
                >
                  <div className="relative grid size-11 shrink-0 place-items-center rounded-full bg-white/5">
                    <span aria-hidden className="absolute inset-0 rounded-full bg-[#c58d5a]/30 blur-lg" />
                    <Icon className="relative size-5 text-[#c58d5a]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/60">{detail.label}</p>
                    <p className="mt-1 text-base text-white">{detail.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-[0.3em] text-[#c58d5a]"
          >
            Nos points forts
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading mt-2 text-3xl text-white sm:text-4xl"
          >
            Une expérience pensée dans les moindres détails
          </motion.h2>

          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="text-center sm:text-left"
                >
                  <div className="relative mx-auto grid size-16 place-items-center rounded-full bg-white/5 sm:mx-0">
                    <span aria-hidden className="absolute inset-0 rounded-full bg-[#163b66]/50 blur-xl" />
                    <Icon className="relative size-7 text-[#c58d5a]" />
                  </div>
                  <h3 className="font-heading mt-4 text-lg text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-10 border-t border-white/10 pt-12 sm:flex-row sm:items-end sm:justify-between">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.04 }}
            >
              <div className="font-heading text-4xl text-[#c58d5a] sm:text-5xl">{stat.value}</div>
              <motion.div
                className="mt-3 h-px w-12 bg-[#c58d5a]"
                animate={{ width: [48, 64, 48] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <p className="mt-3 text-sm uppercase tracking-[0.24em] text-white/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
