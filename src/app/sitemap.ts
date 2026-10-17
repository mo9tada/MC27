import type { MetadataRoute } from "next";

import { getUpcomingEvents } from "@/lib/events-data";
import { absoluteUrl } from "@/lib/site";

// Rebuilt at most once an hour so new events show up without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/menu"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/reservations"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/events"), changeFrequency: "daily", priority: 0.7 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.5 },
  ];

  try {
    const events = await getUpcomingEvents();
    return [
      ...pages,
      ...events.map((event) => ({
        url: absoluteUrl(`/events/${event.id}`),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch (error) {
    // Never fail the build (or the sitemap) because the database is unreachable.
    console.error("sitemap: could not load events", error);
    return pages;
  }
}
