import "server-only";
import * as z from "zod";

import { MENU_APP_URL } from "@/lib/site";

// The menu (items and prices) is maintained in the QR-code menu app
// (MC27-Menu repo), which publishes it as JSON at /api/menu. This site reads
// it so both always show the same prices — edit the menu there, not here.
const menuSchema = z.object({
  categories: z.array(
    z.object({
      title: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          price: z.string(),
          ingredients: z.string().nullish(),
        }),
      ),
    }),
  ),
});

export type MenuCategory = z.infer<typeof menuSchema>["categories"][number];

/** Returns the menu, or null if the menu app can't be reached right now. */
export async function getMenu(): Promise<MenuCategory[] | null> {
  try {
    const res = await fetch(`${MENU_APP_URL}/api/menu`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const { categories } = menuSchema.parse(await res.json());
    return categories.filter((category) => category.items.length > 0);
  } catch (error) {
    console.error(`menu: could not load ${MENU_APP_URL}/api/menu`, error);
    return null;
  }
}

/** "Cocktails DUO" → "cocktails-duo", "Supplèments" → "supplements". */
export function categorySlug(title: string) {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
