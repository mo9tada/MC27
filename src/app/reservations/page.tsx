import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

import ReservationsClient from "./reservations-client";

export const metadata: Metadata = pageMetadata({
  title: "Réserver une table",
  description:
    "Réservez votre table chez MC27 Coffee à Menzel Temime en moins d'une minute. Votre place est confirmée par un code envoyé par e-mail.",
  path: "/reservations",
});

export default function ReservationsPage() {
  return <ReservationsClient />;
}
