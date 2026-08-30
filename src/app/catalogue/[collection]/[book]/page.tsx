import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/BookCard";
import { epaisseurDe, Livre3D } from "@/components/Livre3D";
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
    .filter((x) => x.slug !== b.slug)
    .slice(0, 4);

  const specs = [
    b.pages && { label: "Pages", value: `${b.pages} p.` },
    b.price && { label: "Prix", value: b.price },
    b.isbn && { label: "ISBN", value: b.isbn },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Fil d’Ariane" className="mb-10">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ecorce-400">
          <li className="flex items-center gap-1.5">
            <Link href="/" className="transition-colors hover:text-ecorce-700">
              Accueil
            </Link>
            <span aria-hidden="true">/</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Link href="/catalogue" className="transition-colors hover:text-ecorce-700">
              Catalogue
            </Link>
            <span aria-hidden="true">/</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Link
              href={`/catalogue/${b.collection}`}
              className="transition-colors hover:text-ecorce-700"
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

      <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          {/* Le livre est en volume ici aussi : c'est l'objet qu'on vend par
              courrier, pas une vignette. Le survol le redresse pour montrer
              la couverture bien en face. */}
          <div
            className="entree tempo-1 mx-auto w-full max-w-[260px] pt-4"
            style={{ "--souleve": "3.5rem", "--pivote": "2.5deg" } as React.CSSProperties}
          >
            <Livre3D
              src={b.cover}
              titre={b.title}
              collection={b.collectionName}
              sizes="(max-width: 1024px) 260px, 300px"
              epaisseur={epaisseurDe(b.pages)}
            />
          </div>

          {/* Le colophon : pagination, prix, ISBN sur conduites pointillées,
              comme en fin d'ouvrage. */}
          {specs.length > 0 && (
            <dl className="entree tempo-2 mt-12 border-t border-ecorce-200">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-baseline gap-2 border-b border-ecorce-200 py-3"
                >
                  <dt className="shrink-0 text-xs tracking-[0.14em] text-ecorce-500 uppercase">
                    {s.label}
                  </dt>
                  <span className="leader" aria-hidden="true" />
                  <dd className="shrink-0 text-sm font-medium text-ecorce-800 tabular-nums">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Commande : ${b.title}`)}`}
            className="entree tempo-2 mt-6 block bg-cerise-400 px-5 py-3.5 text-center text-xs font-bold tracking-[0.16em] text-ecorce-900 uppercase transition-colors hover:bg-cerise-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ecorce-900"
          >
            Commander ce livre
          </a>
          <p className="mt-3 text-center text-xs text-ecorce-500">
            Envois franco de port · {CONTACT.phone}
          </p>
        </div>

        <div>
          <h1 className="titre-verger entree tempo-1 text-3xl leading-tight text-balance text-ecorce-900 sm:text-4xl">
            {b.title}
          </h1>
          {/* La collection sous le titre, pas d'étiquette au-dessus. */}
          <p className="entree tempo-2 mt-4 font-serif text-ecorce-600 italic">
            Collection{" "}
            <Link
              href={`/catalogue/${b.collection}`}
              className="underline decoration-cerise-400 decoration-2 underline-offset-4 transition-colors hover:text-griotte-500"
            >
              {b.collectionName}
            </Link>
          </p>

          <div className="entree tempo-2 mt-8">
            <Prose html={b.html} />
          </div>
        </div>
      </div>

      {voisins.length > 0 && c && (
        <section className="mt-24 border-t border-ecorce-200 pt-12">
          <div className="flex items-baseline gap-4 sm:gap-6">
            <h2 className="titre-verger text-xl text-ecorce-900 sm:text-2xl">
              Sur la même table
            </h2>
            <span className="leader" aria-hidden="true" />
            <Link
              href={`/catalogue/${c.slug}`}
              className="shrink-0 font-serif text-sm text-ecorce-600 underline decoration-cerise-400 decoration-2 underline-offset-4 transition-colors hover:text-griotte-500"
            >
              {c.name} →
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4">
            {voisins.map((x) => (
              <li key={x.slug} className="pousse">
                <BookCard book={x} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
