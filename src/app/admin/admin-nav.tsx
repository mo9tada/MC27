"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  MessageCircleQuestion,
  Disc3,
  Gift,
  Truck,
  CalendarHeart,
  LogOut,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { logoutAdmin } from "./actions";

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, wheel: undefined },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarCheck, wheel: undefined },
  { href: "/admin/contact", label: "Questions", icon: MessageCircleQuestion, wheel: undefined },
  { href: "/admin/events", label: "Événements", icon: CalendarHeart, wheel: undefined },
  { href: "/admin/wheel", label: "Gains de la roue", icon: Disc3, wheel: undefined },
  { href: "/admin/prizes", label: "Lots — Boutique", icon: Gift, wheel: "store" },
  { href: "/admin/prizes?wheel=delivery", label: "Lots — Livraison", icon: Truck, wheel: "delivery" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentWheel = searchParams.get("wheel") === "delivery" ? "delivery" : "store";

  return (
    <aside className="flex w-full flex-col gap-1 border-white/10 bg-[#0b1f38]/80 p-4 sm:w-56 sm:border-r">
      <div className="font-heading mb-4 px-2 text-lg font-semibold text-white">MC27 Admin</div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const pathMatches = pathname === item.href.split("?")[0];
        const isActive =
          item.href.startsWith("/admin/prizes")
            ? pathMatches && currentWheel === item.wheel
            : pathMatches;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "justify-start text-white/80 hover:bg-white/10 hover:text-white",
              isActive && "bg-white/10 text-white"
            )}
          >
            <Icon className="mr-2 size-4" />
            {item.label}
          </Link>
        );
      })}

      <form action={logoutAdmin} className="mt-4">
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start text-white/60 hover:bg-white/10 hover:text-white")}
        >
          <LogOut className="mr-2 size-4" />
          Déconnexion
        </button>
      </form>
    </aside>
  );
}
