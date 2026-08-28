import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/BookCard";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { booksOf, collections, excerpt, getCollection } from "@/lib/content";

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
      <PageHeader
        eyebrow="Collection"
        title={c.name}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Catalogue", href: "/catalogue" },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {c.descriptionHtml && (
          <div className="max-w-3xl rounded-xl border-l-4 border-cerise-400 bg-cerise-50 p-6">
            <Prose html={c.descriptionHtml} />
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-2">
          {autres.map((x) => (
            <Link
              key={x.slug}
              href={`/catalogue/${x.slug}`}
              className="rounded-full border border-ecorce-200 px-4 py-1.5 text-sm text-ecorce-600 transition-colors hover:border-cerise-400 hover:bg-cerise-50 hover:text-ecorce-900"
            >
              {x.name}
            </Link>
          ))}
        </div>

        <p className="mt-10 text-sm text-ecorce-400">
          {livres.length} {livres.length > 1 ? "titres" : "titre"}
        </p>

        <ul className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
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
