"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, MessageCircleQuestion, Disc3, Gift, CalendarHeart, LogOut } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { logoutAdmin } from "./actions";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarCheck },
  { href: "/admin/contact", label: "Contact Q&A", icon: MessageCircleQuestion },
  { href: "/admin/events", label: "Events", icon: CalendarHeart },
  { href: "/admin/wheel", label: "Spin wheel", icon: Disc3 },
  { href: "/admin/prizes", label: "Wheel prizes", icon: Gift },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col gap-1 border-white/10 bg-[#0b1f38]/80 p-4 sm:w-56 sm:border-r">
      <div className="font-heading mb-4 px-2 text-lg font-semibold text-white">MC27 Admin</div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

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
          Log out
        </button>
      </form>
    </aside>
  );
}
