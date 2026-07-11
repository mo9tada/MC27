import { getWheelPrizes } from "@/lib/wheel-data";
import { normalizeWheel } from "@/lib/wheel";

// Lightweight prize list for the (now static) spin-wheel pages to fetch on the
// client, so navigation to the wheel is instant instead of blocking on the DB.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wheel = normalizeWheel(searchParams.get("wheel"));
  const prizes = await getWheelPrizes(wheel);

  return Response.json(prizes.map((p) => ({ id: p.id, label: p.label, color: p.color })));
}
