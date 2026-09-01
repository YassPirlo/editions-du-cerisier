import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Recherche } from "./Recherche";

export const metadata: Metadata = {
  title: "Recherche",
  description:
    "Chercher un livre du catalogue par son titre, sa collection, un thème ou un mot de sa présentation — les fautes de frappe sont pardonnées.",
  /* Chaque recherche est un chemin, pas une page à indexer. */
  robots: { index: false, follow: true },
};

export default function RecherchePage() {
  return (
    <>
      <PageHeader
        title="Chercher un livre"
        intro="Un titre, une collection, un thème, un mot d’une présentation — même approximatif : les fautes de frappe sont pardonnées."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Catalogue", href: "/catalogue" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Recherche />
      </div>
    </>
  );
}
