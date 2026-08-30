import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { pages } from "@/lib/content";

const entries = pages.presse;

export const metadata: Metadata = {
  title: "Ce qu’en dit la presse",
  description:
    "Ce que la presse écrit des Éditions du Cerisier et de leurs publications.",
  alternates: { canonical: "/ce-qu-en-dit-la-presse" },
};

export default function PressePage() {
  return (
    <>
      <PageHeader
        title="Ce qu’en dit la presse"
        breadcrumb={[{ label: "Accueil", href: "/" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <ul className="space-y-8">
          {entries.map((e) => (
            <li
              key={e.title}
              className="rounded-2xl border-l-4 border-cerise-400 bg-ecorce-50 p-6 sm:p-8"
            >
              <h2 className="font-serif text-xl font-semibold text-ecorce-900">
                {e.title}
              </h2>
              <Prose html={e.html} className="mt-4" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
