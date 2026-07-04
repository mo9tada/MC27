import { getWheelPrizes } from "@/lib/wheel-data";
import SpinWheelClient from "../spinwheel/spin-wheel-client";

export const dynamic = "force-dynamic";

export default async function DeliverySpinWheelPage() {
  const prizes = await getWheelPrizes("delivery");

  return (
    <SpinWheelClient
      prizes={prizes.map((p) => ({ id: p.id, label: p.label, color: p.color }))}
      wheel="delivery"
      badge="MC27 Coffee — Récompenses Livraison"
      title="Roue de la livraison"
      subtitle="Vous commandez en livraison ? Tournez pour gagner une récompense — livraison gratuite, une boisson offerte ou une remise sur votre commande. Un tour par jour."
    />
  );
}
