import { getWheelPrizes } from "@/lib/wheel-data";
import SpinWheelClient from "./spin-wheel-client";

export const dynamic = "force-dynamic";

export default async function SpinWheelPage() {
  const prizes = await getWheelPrizes();

  return <SpinWheelClient prizes={prizes.map((p) => ({ id: p.id, label: p.label, color: p.color }))} />;
}
