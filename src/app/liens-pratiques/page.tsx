import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { pages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Liens pratiques",
  description:
    "Ressources et partenaires des Éditions du Cerisier : Centre de Théâtre Action, Promotion des Lettres.",
  alternates: { canonical: "/liens-pratiques" },
};

export default function LiensPratiquesPage() {
  return (
    <>
      <PageHeader
        title="Liens pratiques"
        breadcrumb={[{ label: "Accueil", href: "/" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <ul className="grid gap-5 sm:grid-cols-2">
          {pages.liens.map((e) => (
            <li
              key={e.title}
              className="flex flex-col rounded-xl border border-ecorce-100 p-6 transition-colors hover:border-cerise-300"
            >
              <h2 className="font-serif text-lg font-semibold text-ecorce-900">
                {e.title}
              </h2>
              <Prose html={e.html} className="mt-3 text-base" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
