// Single source of truth for MC27's public details. Used by the page metadata,
// sitemap, robots.txt, JSON-LD structured data, the home page and the contact
// page — update a value here and every place (including what Google reads)
// stays in sync.

/**
 * Canonical origin of the site. When the café moves to its own domain, set
 * NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://mc27coffee.tn) and redeploy.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://mc-27.vercel.app").replace(/\/+$/, "");

/** The interactive QR-code menu (separate Vercel project, MC27-Menu repo). */
export const MENU_APP_URL = (process.env.MENU_APP_URL || "https://mc27m.vercel.app").replace(/\/+$/, "");

export const BUSINESS = {
  name: "MC27 Coffee",
  alternateName: "Club MC27",
  locality: "Menzel Temime",
  region: "Nabeul",
  countryCode: "TN",
  // Opening hours, shown on the home page and published to search engines.
  opens: "08:00",
  closes: "00:00",
  hoursLabel: "8:00 – 00:00",
  priceRange: "3 – 43 DT",
} as const;

// TODO: make sure these are MC27's real accounts and phone number — they are
// shown on the contact page and published to Google as structured data.
export const PHONE = { label: "+216 21 414 040", href: "tel:+21621414040", e164: "+21621414040" } as const;

export const SOCIAL_LINKS = [
  { label: "Facebook", handle: "Club MC27", href: "https://www.facebook.com/clubmc27/" },
  { label: "Instagram", handle: "@club_mc27", href: "https://instagram.com/club_mc27/" },
  { label: "TikTok", handle: "@club.mc27", href: "https://tiktok.com/@club.mc27" },
] as const;

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
