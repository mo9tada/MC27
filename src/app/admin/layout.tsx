import type { Metadata } from "next";

// Applies to the login page and the whole dashboard: never indexed.
export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
