"use client";

import { useRef } from "react";
import type { ReactNode, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

type FloatPanelProps = {
  children: ReactNode;
  className?: string;
  glow?: "amber" | "navy" | "none";
};

export function FloatPanel({ children, className, glow = "amber" }: FloatPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [7, -7]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-7, 7]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  const glowClass = glow === "amber" ? "bg-[#c58d5a]/25" : glow === "navy" ? "bg-[#163b66]/35" : "";

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
      className={cn("relative", className)}
    >
      {glow !== "none" && <div aria-hidden className={cn("absolute -inset-4 -z-10 rounded-[3rem] blur-2xl", glowClass)} />}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ y: -4 }}
        className="rounded-[2.5rem] bg-[#102c4e]/40 p-6 text-white shadow-[0_25px_70px_-15px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:p-8"
      >
        {children}
      </motion.div>
    </div>
  );
}
