import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { HOME_DESCRIPTION, HOME_TITLE, businessJsonLd, pageMetadata } from "@/lib/seo";

import HomeClient from "./home-client";

export const metadata: Metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={businessJsonLd()} />
      <HomeClient />
    </>
  );
}
