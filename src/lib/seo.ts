import type { Metadata } from "next";

import { BUSINESS, PHONE, SITE_URL, SOCIAL_LINKS, absoluteUrl } from "@/lib/site";

export const SITE_NAME = BUSINESS.name;

export const HOME_TITLE = "MC27 Coffee – Café & pâtisserie à Menzel Temime, Nabeul";
export const HOME_DESCRIPTION =
  "Café torréfié maison, pâtisseries fraîches, petit-déjeuner, crêpes et burgers à Menzel Temime (Nabeul). Ouvert de 8h à minuit, réservez votre table en ligne.";

// Shared social-preview image (1200×630). Kept in /public and referenced
// explicitly, because a page that sets `openGraph` replaces its parent's
// openGraph block — a file-based opengraph-image would be dropped there.
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "MC27 Coffee – café & pâtisserie à Menzel Temime",
};

type PageMetadataInput = {
  /** Page title without the brand; the layout template appends "| MC27 Coffee". */
  title: string;
  description: string;
  /** Path of the page, used for the canonical URL and og:url. */
  path: string;
  /** Use the title as-is, without the "| MC27 Coffee" suffix. */
  absoluteTitle?: boolean;
  /** Keep the page out of search results (links on it are still followed). */
  noIndex?: boolean;
  image?: { url: string; width?: number; height?: number; alt?: string };
};

/**
 * Builds a page's metadata: unique title and description, canonical URL and a
 * complete Open Graph block (Twitter/X cards inherit from it).
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noIndex = false,
  image = OG_IMAGE,
}: PageMetadataInput): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_TN",
      siteName: SITE_NAME,
      url: path,
      title: absoluteTitle ? title : `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Café + website structured data, rendered on the home page. */
export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CafeOrCoffeeShop",
        "@id": `${SITE_URL}/#business`,
        name: BUSINESS.name,
        alternateName: BUSINESS.alternateName,
        description: HOME_DESCRIPTION,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/mc.png"),
        image: absoluteUrl(OG_IMAGE.url),
        telephone: PHONE.e164,
        address: {
          "@type": "PostalAddress",
          addressLocality: BUSINESS.locality,
          addressRegion: BUSINESS.region,
          addressCountry: BUSINESS.countryCode,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ALL_DAYS,
            opens: BUSINESS.opens,
            // Schema.org has no "24:00"; closing at midnight is written 23:59.
            closes: BUSINESS.closes === "00:00" ? "23:59" : BUSINESS.closes,
          },
        ],
        servesCuisine: ["Café", "Pâtisseries", "Petit-déjeuner", "Crêpes", "Burgers"],
        priceRange: BUSINESS.priceRange,
        currenciesAccepted: "TND",
        hasMenu: absoluteUrl("/menu"),
        acceptsReservations: absoluteUrl("/reservations"),
        sameAs: SOCIAL_LINKS.map((social) => social.href),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: BUSINESS.name,
        alternateName: [BUSINESS.alternateName, "MC27"],
        url: absoluteUrl("/"),
        inLanguage: "fr",
        publisher: { "@id": `${SITE_URL}/#business` },
      },
    ],
  };
}

type EventForJsonLd = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string | null;
  price: string | null;
  imageUrl: string | null;
};

/**
 * Event dates are entered in the admin as Tunisian wall-clock time and stored
 * as that same wall time in UTC, so the UTC fields are read back and labelled
 * with Tunisia's fixed offset (UTC+1, no daylight saving).
 */
function toTunisIsoString(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:00+01:00`
  );
}

/** "15 DT" → 15, "Entrée gratuite" → 0, anything less clear → null. */
function parsePrice(price: string | null) {
  if (!price) return null;
  const value = price.trim().toLowerCase();
  if (/gratuit|offert|free/.test(value)) return 0;
  const match = value.match(/^(\d+(?:[.,]\d+)?)\s*(dt|tnd|dinars?)?$/);
  return match ? Number(match[1].replace(",", ".")) : null;
}

export function eventJsonLd(event: EventForJsonLd, { isFull }: { isFull: boolean }) {
  const url = absoluteUrl(`/events/${event.id}`);
  const price = parsePrice(event.price);
  const image = event.imageUrl
    ? event.imageUrl.startsWith("/")
      ? absoluteUrl(event.imageUrl)
      : event.imageUrl
    : absoluteUrl(OG_IMAGE.url);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: toTunisIsoString(event.date),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url,
    image: [image],
    location: {
      "@type": "Place",
      name: event.location || BUSINESS.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: BUSINESS.locality,
        addressRegion: BUSINESS.region,
        addressCountry: BUSINESS.countryCode,
      },
    },
    organizer: { "@type": "Organization", name: BUSINESS.name, url: absoluteUrl("/") },
    ...(price !== null
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "TND",
            url,
            availability: isFull ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

/** Plain-text excerpt for meta descriptions. */
export function excerpt(text: string, maxLength = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const cut = clean.slice(0, maxLength - 1);
  const atWord = cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length);
  return `${atWord.replace(/[\s.,;:!?·–-]+$/, "")}…`;
}
