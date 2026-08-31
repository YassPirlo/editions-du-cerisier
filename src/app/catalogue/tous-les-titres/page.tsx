import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { TriDesLivres } from "@/components/TriDesLivres";
import { books, collections } from "@/lib/content";
import { anneeDeParution } from "@/lib/parution";

export const metadata: Metadata = {
  title: "Tous les titres",
  description:
    "Le catalogue complet des Éditions du Cerisier : recherche, filtre par collection, tri par date de parution ou par titre.",
  alternates: { canonical: "/catalogue/tous-les-titres" },
};

/* Le composant client ne reçoit que la vignette de chaque fiche — jamais le
   html/text, qui alourdirait le payload de 253 livres pour rien. */
const vignettes = books.map((b) => ({
  slug: b.slug,
  title: b.title,
  collection: b.collection,
  collectionName: b.collectionName,
  cover: b.cover,
  pages: b.pages,
  price: b.price,
  annee: anneeDeParution(b.text),
}));

const rayons = collections.map((c) => ({ slug: c.slug, name: c.name }));

export default function TousLesTitresPage() {
  return (
    <>
      <PageHeader
        title="Tous les titres"
        intro={`${books.length} titres au catalogue — cherchez, filtrez par collection, triez par date de parution.`}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Catalogue", href: "/catalogue" },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <TriDesLivres livres={vignettes} collections={rayons} />
      </div>
    </>
  );
}
