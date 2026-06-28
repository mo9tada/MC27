"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Menu } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/reservations", label: "Reservations" },
    { href: "/contact", label: "Contact" },
    { href: "/spinwheel", label: "Spinwheel" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 16);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.17, 0.67, 0.12, 0.99] as const }}
            className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8"
        >
            <nav
                className={`mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[#071526]/50 px-4 py-4 shadow-lg shadow-black/20 backdrop-blur-2xl transition-all duration-300 sm:px-6 lg:px-8 ${
                    isScrolled ? "-translate-y-1 scale-[0.99]" : "translate-y-0"
                }`}
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/" className="font-heading text-lg font-semibold tracking-tight text-white">
                        MC27
                    </Link>
                </motion.div>

                <div className="hidden items-center gap-2 md:flex">
                    {navItems.map((item) => (
                        <motion.div key={item.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href={item.href}
                                className={buttonVariants({ variant: "ghost", className: "text-white/80 hover:bg-white/10 hover:text-white" })}
                            >
                                {item.label}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger render={<Button variant="outline" size="icon" className="border-white/20 bg-white/5 text-white hover:bg-white/10" />}>
                            <Menu className="size-4" />
                            <span className="sr-only">Open menu</span>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[280px] border-white/10 bg-[#071526]/95 backdrop-blur-xl">
                            <SheetHeader>
                                <SheetTitle className="text-white">Navigation</SheetTitle>
                                <SheetDescription className="text-white/60">Browse all pages from this menu.</SheetDescription>
                            </SheetHeader>
                            <div className="flex flex-col gap-2 px-4 pb-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={buttonVariants({
                                            variant: "ghost",
                                            className: "justify-start text-white/80 hover:bg-white/10 hover:text-white",
                                        })}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </motion.header>
    );
}