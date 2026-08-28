import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { books, collections } from "@/lib/content";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Nos collections : Faits et Gestes, Place publique, Quotidiennes, Griottes, Cerisier noir, Théâtre-Action, Feux Follets et hors collections.",
  alternates: { canonical: "/catalogue" },
};

export default function CataloguePage() {
  const items = collections.map((c) => ({
    ...c,
    livres: books.filter((b) => b.collection === c.slug),
  }));

  return (
    <>
      <PageHeader
        eyebrow="Nos collections"
        title="Catalogue"
        intro={`${books.length} titres répartis en ${collections.length} collections.`}
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <a
          href="/documents/cerisier_catalogue_2021.pdf"
          className="inline-flex items-center gap-2.5 rounded-lg border border-ecorce-200 bg-white px-5 py-3 text-sm font-semibold text-ecorce-700 transition-colors hover:border-cerise-400 hover:bg-cerise-50"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
            <path
              d="M10 3v10m0 0 4-4m-4 4-4-4M3.5 15.5h13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Télécharger le catalogue en PDF
        </a>

        <ul className="mt-12 space-y-14">
          {items.map((c) => (
            <li key={c.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-ecorce-100 pb-4">
                <h2 className="font-serif text-2xl font-semibold text-ecorce-900">
                  <Link
                    href={`/catalogue/${c.slug}`}
                    className="transition-colors hover:text-ecorce-600"
                  >
                    {c.name}
                  </Link>
                </h2>
                <span className="text-sm text-ecorce-400">
                  {c.livres.length} {c.livres.length > 1 ? "titres" : "titre"}
                </span>
              </div>

              {c.descriptionHtml && (
                <Prose html={c.descriptionHtml} className="mt-5 max-w-3xl" />
              )}

              <ul className="mt-6 flex flex-wrap gap-3">
                {c.livres.slice(0, 7).map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/catalogue/${c.slug}/${b.slug}`}
                      title={b.title}
                      className="group block"
                    >
                      <div className="relative h-32 w-22 overflow-hidden rounded-md border border-ecorce-100 bg-ecorce-50 transition-transform group-hover:-translate-y-1">
                        {b.cover ? (
                          <Image
                            src={b.cover}
                            alt={`Couverture de « ${b.title} »`}
                            fill
                            sizes="88px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center p-1.5 text-center text-[0.5625rem] leading-tight text-ecorce-300">
                            {b.title}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/catalogue/${c.slug}`}
                    className="flex h-32 w-22 items-center justify-center rounded-md border border-dashed border-ecorce-200 px-2 text-center text-xs font-medium text-ecorce-500 transition-colors hover:border-cerise-400 hover:bg-cerise-50 hover:text-ecorce-800"
                  >
                    Voir les {c.livres.length}
                  </Link>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
