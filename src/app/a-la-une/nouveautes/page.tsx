import type { Metadata } from "next";
import { EntryList } from "@/components/EntryList";
import { PageHeader } from "@/components/PageHeader";
import { pages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Nouveautés",
  description: "Les dernières parutions des Éditions du Cerisier.",
  alternates: { canonical: "/a-la-une/nouveautes" },
};

export default function NouveautesPage() {
  return (
    <>
      <PageHeader
        eyebrow="À la une"
        title="Nouveautés"
        intro={`${pages.nouveautes.length} parutions récentes.`}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "À la une", href: "/a-la-une" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <EntryList entries={pages.nouveautes} />
      </div>
    </>
  );
}
