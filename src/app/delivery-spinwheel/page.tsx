import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

import SpinWheelClient from "../spinwheel/spin-wheel-client";

// A promo tool rather than a landing page: kept out of search results.
export const metadata: Metadata = pageMetadata({
  title: "Roue de la livraison",
  description:
    "Vous commandez en livraison chez MC27 Coffee ? Tournez la roue une fois par jour pour gagner la livraison gratuite, une boisson offerte ou une remise.",
  path: "/delivery-spinwheel",
  noIndex: true,
});

// Static shell → instant navigation. Prizes are fetched client-side from
// /api/wheel/prizes so this page never blocks on the database.
export default function DeliverySpinWheelPage() {
  return (
    <SpinWheelClient
      wheel="delivery"
      badge="MC27 Coffee — Récompenses Livraison"
      title="Roue de la livraison"
      subtitle="Vous commandez en livraison ? Tournez pour gagner une récompense — livraison gratuite, une boisson offerte ou une remise sur votre commande. Un tour par jour."
    />
  );
}
