import SpinWheelClient from "../spinwheel/spin-wheel-client";

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
