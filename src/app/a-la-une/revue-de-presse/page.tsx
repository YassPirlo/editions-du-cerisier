import type { Metadata } from "next";
import { EntryList } from "@/components/EntryList";
import { PageHeader } from "@/components/PageHeader";
import { pages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lu dans la presse et sur le net",
  description:
    "Articles, critiques et recensions consacrés aux livres des Éditions du Cerisier.",
  alternates: { canonical: "/a-la-une/revue-de-presse" },
};

export default function RevueDePressePage() {
  return (
    <>
      <PageHeader
        eyebrow="À la une"
        title="Lu dans la presse et sur le net"
        intro={`${pages.revueDePresse.length} articles et recensions.`}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "À la une", href: "/a-la-une" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <EntryList entries={pages.revueDePresse} />
      </div>
    </>
  );
}
