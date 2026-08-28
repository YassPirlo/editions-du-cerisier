import type { Metadata } from "next";
import { EntryList } from "@/components/EntryList";
import { PageHeader } from "@/components/PageHeader";
import { pages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Rencontres, salons, anniversaires : l’actualité des Éditions du Cerisier.",
  alternates: { canonical: "/a-la-une/actualites" },
};

export default function ActualitesPage() {
  return (
    <>
      <PageHeader
        eyebrow="À la une"
        title="Actualités"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "À la une", href: "/a-la-une" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <EntryList entries={pages.actualites} />
      </div>
    </>
  );
}
