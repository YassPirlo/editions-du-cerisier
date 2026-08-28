import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/BookCard";
import { Prose } from "@/components/Prose";
import { books, booksOf, excerpt, getBook, getCollection } from "@/lib/content";
import { CONTACT } from "@/lib/nav";

export function generateStaticParams() {
  return books.map((b) => ({ collection: b.collection, book: b.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/catalogue/[collection]/[book]">): Promise<Metadata> {
  const { collection, book } = await params;
  const b = getBook(collection, book);
  if (!b) return {};
  return {
    title: b.title,
    description: excerpt(b.text, 155),
    alternates: { canonical: `/catalogue/${b.collection}/${b.slug}` },
    openGraph: {
      title: b.title,
      description: excerpt(b.text, 200),
      type: "article",
      images: b.cover ? [{ url: b.cover }] : undefined,
    },
  };
}

export default async function BookPage({
  params,
}: PageProps<"/catalogue/[collection]/[book]">) {
  const { collection, book } = await params;
  const b = getBook(collection, book);
  if (!b) notFound();

  const c = getCollection(b.collection);
  const voisins = booksOf(b.collection)
    .filter((x) => x.slug !== b.slug && x.cover)
    .slice(0, 4);

  const specs = [
    b.pages && { label: "Pages", value: `${b.pages} p.` },
    b.price && { label: "Prix", value: b.price },
    b.isbn && { label: "ISBN", value: b.isbn },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Fil d’Ariane" className="mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ecorce-400">
          <li className="flex items-center gap-1.5">
            <Link href="/" className="hover:text-ecorce-700">
              Accueil
            </Link>
            <span aria-hidden="true">/</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Link href="/catalogue" className="hover:text-ecorce-700">
              Catalogue
            </Link>
            <span aria-hidden="true">/</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Link
              href={`/catalogue/${b.collection}`}
              className="hover:text-ecorce-700"
            >
              {b.collectionName}
            </Link>
            <span aria-hidden="true">/</span>
          </li>
          <li aria-current="page" className="text-ecorce-600">
            {b.title}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative mx-auto aspect-3/4 w-full max-w-[280px] overflow-hidden rounded-xl border border-ecorce-100 bg-ecorce-50 shadow-sm">
            {b.cover ? (
              <Image
                src={b.cover}
                alt={`Couverture de « ${b.title} »`}
                fill
                sizes="(max-width: 1024px) 280px, 320px"
                className="object-contain p-2"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6">
                <span className="text-center font-serif text-ecorce-300">
                  {b.title}
                </span>
              </div>
            )}
          </div>

          {specs.length > 0 && (
            <dl className="mt-6 divide-y divide-ecorce-100 rounded-xl border border-ecorce-100">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-baseline justify-between gap-4 px-4 py-3"
                >
                  <dt className="text-xs tracking-[0.1em] text-ecorce-400 uppercase">
                    {s.label}
                  </dt>
                  <dd className="text-right text-sm font-medium text-ecorce-800">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Commande : ${b.title}`)}`}
            className="mt-4 block rounded-lg bg-cerise-400 px-5 py-3 text-center text-sm font-semibold text-ecorce-900 transition-colors hover:bg-cerise-300"
          >
            Commander ce livre
          </a>
          <p className="mt-2 text-center text-xs text-ecorce-400">
            Envois franco de port · {CONTACT.phone}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-cerise-600 uppercase">
            <Link href={`/catalogue/${b.collection}`} className="hover:underline">
              {b.collectionName}
            </Link>
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight font-semibold text-balance text-ecorce-900 sm:text-4xl">
            {b.title}
          </h1>

          <div className="mt-8">
            <Prose html={b.html} />
          </div>

          {b.links.length > 0 && (
            <div className="mt-10 rounded-xl border border-ecorce-100 bg-ecorce-50 p-5">
              <h2 className="text-xs font-semibold tracking-[0.12em] text-ecorce-400 uppercase">
                En savoir plus
              </h2>
              <ul className="mt-3 space-y-2">
                {b.links.map((l) => (
                  <li key={l}>
                    <a
                      href={l}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm break-all text-ecorce-600 underline decoration-cerise-400 decoration-2 underline-offset-2 hover:text-ecorce-900"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {voisins.length > 0 && c && (
        <section className="mt-20 border-t border-ecorce-100 pt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-xl font-semibold text-ecorce-900 sm:text-2xl">
              Dans la même collection
            </h2>
            <Link
              href={`/catalogue/${c.slug}`}
              className="shrink-0 text-sm font-semibold text-ecorce-600 underline decoration-cerise-400 decoration-2 underline-offset-4 hover:text-ecorce-900"
            >
              {c.name} →
            </Link>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {voisins.map((x) => (
              <li key={x.slug}>
                <BookCard book={x} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
