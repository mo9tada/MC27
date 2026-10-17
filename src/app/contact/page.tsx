import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

import ContactClient from "./contact-client";

export const metadata: Metadata = pageMetadata({
  title: "Contact & questions",
  description:
    "Une question sur nos horaires, le traiteur ou un événement privé ? Écrivez à MC27 Coffee à Menzel Temime, appelez-nous ou suivez-nous sur les réseaux sociaux.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactClient />;
}
