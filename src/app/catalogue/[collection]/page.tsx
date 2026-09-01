import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/BookCard";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { booksOf, collections, excerpt, getCollection } from "@/lib/content";
import { DonneesStructurees } from "@/components/DonneesStructurees";
import { schemaFilAriane } from "@/lib/schema";

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/catalogue/[collection]">): Promise<Metadata> {
  const { collection } = await params;
  const c = getCollection(collection);
  if (!c) return {};
  return {
    title: c.name,
    description: c.descriptionText
      ? excerpt(c.descriptionText, 155)
      : `Les titres de la collection ${c.name} aux Éditions du Cerisier.`,
    alternates: { canonical: `/catalogue/${c.slug}` },
  };
}

export default async function CollectionPage({
  params,
}: PageProps<"/catalogue/[collection]">) {
  const { collection } = await params;
  const c = getCollection(collection);
  if (!c) notFound();

  const livres = booksOf(c.slug);
  const autres = collections.filter((x) => x.slug !== c.slug);

  return (
    <>
      <DonneesStructurees
        donnees={schemaFilAriane([
          { label: "Accueil", chemin: "/" },
          { label: "Catalogue", chemin: "/catalogue" },
          { label: c.name, chemin: `/catalogue/${c.slug}` },
        ])}
      />
      <PageHeader
        title={c.name}
        intro={`${livres.length} ${livres.length > 1 ? "titres" : "titre"}`}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Catalogue", href: "/catalogue" },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* La ligne éditoriale de la collection, mot pour mot, en exergue
            sous le filet jaune — la seconde encre de la maison. */}
        {c.descriptionHtml && (
          <div className="entree tempo-2 max-w-3xl border-l-4 border-cerise-400 pl-6">
            <Prose html={c.descriptionHtml} />
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-2">
          {autres.map((x) => (
            <Link
              key={x.slug}
              href={`/catalogue/${x.slug}`}
              className="rounded-full border border-ecorce-300 px-4 py-1.5 text-sm text-ecorce-600 transition-colors hover:border-griotte-400 hover:bg-cerise-50 hover:text-griotte-500 focus-visible:outline-2 focus-visible:outline-cerise-400"
            >
              {x.name}
            </Link>
          ))}
        </div>

        {/* Pas de « pousse » ici : sur cent titres, l'effet répété devient un
            tic — et cent timelines de défilement pèsent pour rien. La grille
            est simplement là, comme un rayonnage. */}
        <ul className="etagere mt-14 grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4">
          {livres.map((b) => (
            <li key={b.slug}>
              <BookCard book={b} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
