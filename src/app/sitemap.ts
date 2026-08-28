import type { MetadataRoute } from "next";
import { books, collections } from "@/lib/content";

const BASE = "https://editions-du-cerisier.be";

export default function sitemap(): MetadataRoute.Sitemap {
  const statiques = [
    "/",
    "/qui-sommes-nous",
    "/ligne-editoriale",
    "/ce-qu-en-dit-la-presse",
    "/envoyer-un-manuscrit",
    "/a-la-une",
    "/a-la-une/actualites",
    "/a-la-une/nouveautes",
    "/a-la-une/revue-de-presse",
    "/catalogue",
    "/contact",
    "/contact/commander",
    "/liens-pratiques",
  ];

  return [
    ...statiques.map((p) => ({
      url: BASE + p,
      changeFrequency: "monthly" as const,
      priority: p === "/" ? 1 : 0.7,
    })),
    ...collections.map((c) => ({
      url: `${BASE}/catalogue/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...books.map((b) => ({
      url: `${BASE}/catalogue/${b.collection}/${b.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
