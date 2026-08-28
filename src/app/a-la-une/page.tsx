import type { Metadata } from "next";
import Link from "next/link";
import { EntryList } from "@/components/EntryList";
import { PageHeader } from "@/components/PageHeader";
import { excerpt, pages } from "@/lib/content";

const entries = pages.alaune;

const sections = [
  {
    href: "/a-la-une/actualites",
    label: "Actualités",
    count: pages.actualites.length,
    desc: "Rencontres, salons, anniversaires et vie de la maison.",
  },
  {
    href: "/a-la-une/nouveautes",
    label: "Nouveautés",
    count: pages.nouveautes.length,
    desc: "Les dernières parutions du Cerisier.",
  },
  {
    href: "/a-la-une/revue-de-presse",
    label: "Lu dans la presse et sur le net",
    count: pages.revueDePresse.length,
    desc: "Ce que la presse et le web disent de nos livres.",
  },
];

export const metadata: Metadata = {
  title: "À la une",
  description: entries[0]
    ? excerpt(entries[0].text, 155)
    : "Actualités, nouveautés et revue de presse des Éditions du Cerisier.",
  alternates: { canonical: "/a-la-une" },
};

export default function ALaUnePage() {
  return (
    <>
      <PageHeader
        eyebrow="Actualité"
        title="À la une"
        breadcrumb={[{ label: "Accueil", href: "/" }]}
      />
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <ul className="mb-14 grid gap-4 sm:grid-cols-3">
          {sections.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-xl border border-ecorce-100 p-5 transition-all hover:-translate-y-0.5 hover:border-cerise-300 hover:shadow-md hover:shadow-ecorce-900/5"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-serif text-base leading-snug font-semibold text-ecorce-900">
                    {s.label}
                  </h2>
                  <span className="shrink-0 rounded-full bg-cerise-100 px-2 py-0.5 text-xs font-semibold text-ecorce-700">
                    {s.count}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ecorce-500">
                  {s.desc}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <EntryList entries={entries} />
      </div>
    </>
  );
}
