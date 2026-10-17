import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

import SpinWheelClient from "./spin-wheel-client";

// A promo tool rather than a landing page: kept out of search results.
export const metadata: Metadata = pageMetadata({
  title: "Tournez & gagnez",
  description:
    "Tournez la roue MC27 Coffee une fois par jour pour gagner une réduction, avec un bon en PDF à présenter au comptoir.",
  path: "/spinwheel",
  noIndex: true,
});

// Static shell → instant navigation. Prizes are fetched client-side from
// /api/wheel/prizes so this page never blocks on the database.
export default function SpinWheelPage() {
  return <SpinWheelClient wheel="store" />;
}
