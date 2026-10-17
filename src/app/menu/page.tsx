import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, QrCode } from "lucide-react";

import Navbar from "@/components/navbar";
import VideoBackground from "@/components/video-background";
import { FloatPanel } from "@/components/float-panel";
import { buttonVariants } from "@/components/ui/button";
import { categorySlug, getMenu } from "@/lib/menu";
import { pageMetadata } from "@/lib/seo";
import { BUSINESS, MENU_APP_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

// Static page, refreshed hourly from the QR-code menu app (see src/lib/menu.ts).
export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Menu & prix : café, crêpes, burgers",
  description:
    "La carte complète de MC27 Coffee à Menzel Temime avec les prix : cafés, thés, mojitos, smoothies, milkshakes, crêpes, tacos, burgers et petit-déjeuner.",
  path: "/menu",
});

const QR_IMAGE_SRC = "/mc27qr.png";

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      <VideoBackground overlayClassName="bg-[linear-gradient(180deg,_rgba(7,21,38,0.88),_rgba(16,44,78,0.9))]" blobs />
      <Navbar />

      <section className="relative z-10 mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10 text-center duration-500 animate-in fade-in slide-in-from-top-4">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
            <span className="size-2 rounded-full bg-[#c58d5a]" />
            <span>MC27 Coffee — Menu</span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Notre Menu</h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/70">
            Cafés, thés, mojitos, smoothies, crêpes, tacos, burgers et petit-déjeuner : toute la carte de MC27 Coffee à{" "}
            {BUSINESS.locality}, avec les prix.
          </p>
        </header>

        <FloatPanel className="mx-auto mb-12 max-w-2xl">
          <div className="flex items-center gap-6">
            <div className="hidden w-36 shrink-0 rounded-3xl bg-white p-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QR_IMAGE_SRC}
                alt="Code QR du menu interactif MC27 Coffee"
                width={220}
                height={220}
                loading="lazy"
                className="aspect-square h-auto w-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-heading flex items-center gap-2 text-xl text-white">
                <QrCode className="size-5 shrink-0 text-[#c58d5a]" />
                La carte en photos
              </h2>
              <p className="mt-2 text-sm text-white/70">
                <span className="sm:hidden">Parcourez notre menu interactif, avec une photo pour chaque catégorie.</span>
                <span className="hidden sm:inline">
                  Scannez le code QR avec votre téléphone pour parcourir notre menu interactif, avec photos.
                </span>
              </p>
              <Link
                href={MENU_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants(),
                  "mt-5 h-10 w-full bg-[#163b66] text-base text-white hover:bg-[#102c4e] sm:w-auto sm:px-6",
                )}
              >
                Ouvrir le menu interactif
                <ArrowUpRight className="ml-1 size-4" />
              </Link>
            </div>
          </div>
        </FloatPanel>

        {menu && (
          <>
            {/* One swipeable row on phones, wrapped and centred on larger screens. */}
            <nav
              aria-label="Catégories du menu"
              className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0"
            >
              {menu.map((category) => (
                <a
                  key={category.title}
                  href={`#${categorySlug(category.title)}`}
                  className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm whitespace-nowrap text-white/80 transition-colors hover:border-[#c58d5a]/50 hover:bg-white/10 hover:text-white"
                >
                  {category.title}
                </a>
              ))}
            </nav>

            <div className="columns-1 gap-6 md:columns-2">
              {menu.map((category) => (
                <section
                  key={category.title}
                  id={categorySlug(category.title)}
                  aria-labelledby={`${categorySlug(category.title)}-title`}
                  className="mb-6 scroll-mt-28 break-inside-avoid rounded-[2rem] border border-white/10 bg-[#0b1f38]/80 p-6 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.65)]"
                >
                  <h2 id={`${categorySlug(category.title)}-title`} className="font-heading text-2xl text-white">
                    {category.title}
                  </h2>
                  <ul className="mt-3 divide-y divide-white/10">
                    {category.items.map((item) => (
                      <li key={`${item.name}-${item.price}`} className="flex items-baseline justify-between gap-4 py-2.5">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white">{item.name}</p>
                          {item.ingredients && (
                            <p className="mt-0.5 text-xs leading-snug text-white/55 italic">{item.ingredients}</p>
                          )}
                        </div>
                        <span className="shrink-0 text-sm font-semibold whitespace-nowrap text-[#c58d5a] tabular-nums">
                          {item.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
