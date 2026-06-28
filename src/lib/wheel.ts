import { randomBytes } from "crypto";

export type WheelSegment = {
  id?: string;
  label: string;
  weight: number;
  color: string;
};

// Used to seed the WheelPrize table; prizes are managed in the DB / admin after that.
export const DEFAULT_WHEEL_SEGMENTS: WheelSegment[] = [
  { label: "5% Off", weight: 22, color: "#163b66" },
  { label: "Try Again", weight: 20, color: "#0b1f38" },
  { label: "10% Off", weight: 18, color: "#163b66" },
  { label: "Free Pastry", weight: 10, color: "#8c5f39" },
  { label: "15% Off", weight: 12, color: "#163b66" },
  { label: "Try Again", weight: 8, color: "#0b1f38" },
  { label: "Free Coffee", weight: 6, color: "#8c5f39" },
  { label: "Buy 1 Get 1 Free", weight: 2, color: "#c58d5a" },
  { label: "20% Off", weight: 2, color: "#163b66" },
];

export function pickSegmentIndex(segments: WheelSegment[]) {
  const totalWeight = segments.reduce((sum, segment) => sum + Math.max(0, segment.weight), 0);

  if (totalWeight <= 0) {
    return Math.floor(Math.random() * segments.length);
  }

  let roll = Math.random() * totalWeight;

  for (let i = 0; i < segments.length; i++) {
    roll -= Math.max(0, segments[i].weight);
    if (roll <= 0) {
      return i;
    }
  }

  return segments.length - 1;
}

export function generateVoucherCode() {
  return `MC27-${randomBytes(4).toString("hex").toUpperCase()}`;
}
