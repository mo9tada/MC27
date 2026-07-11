import SpinWheelClient from "./spin-wheel-client";

// Static shell → instant navigation. Prizes are fetched client-side from
// /api/wheel/prizes so this page never blocks on the database.
export default function SpinWheelPage() {
  return <SpinWheelClient wheel="store" />;
}
