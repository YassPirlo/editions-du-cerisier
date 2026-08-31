import type { Metadata } from "next";
import Link from "next/link";
import { epaisseurDe, Livre3D } from "@/components/Livre3D";
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
        title="Catalogue"
        intro={`${books.length} titres répartis en ${collections.length} collections.`}
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap gap-3">
        <Link
          href="/catalogue/tous-les-titres"
          className="pousse inline-flex items-center gap-2.5 border border-ecorce-300 bg-white px-5 py-3 text-sm font-semibold text-ecorce-700 transition-colors hover:border-cerise-400 hover:bg-cerise-50 focus-visible:outline-2 focus-visible:outline-cerise-400"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="m13.5 13.5 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Chercher parmi les {books.length} titres
        </Link>
        <a
          href="/documents/cerisier_catalogue_2021.pdf"
          className="pousse inline-flex items-center gap-2.5 border border-ecorce-300 bg-white px-5 py-3 text-sm font-semibold text-ecorce-700 transition-colors hover:border-cerise-400 hover:bg-cerise-50 focus-visible:outline-2 focus-visible:outline-cerise-400"
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
        </div>

        {/* Chaque collection est une table de libraire : l'index en tête
            (nom … nombre de titres, en conduite pointillée), la ligne
            éditoriale de la collection, puis quelques volumes posés. */}
        <ul className="mt-14 space-y-20">
          {items.map((c) => (
            <li key={c.slug} className="pousse">
              <Link
                href={`/catalogue/${c.slug}`}
                className="group flex items-baseline gap-4 border-b border-ecorce-300 pb-4 focus-visible:outline-2 focus-visible:outline-cerise-400 sm:gap-6"
              >
                <h2 className="titre-verger text-2xl text-ecorce-900 transition-colors group-hover:text-griotte-500 sm:text-3xl">
                  {c.name}
                </h2>
                <span className="leader" aria-hidden="true" />
                <span className="shrink-0 font-serif text-sm text-ecorce-500 tabular-nums">
                  {c.livres.length} {c.livres.length > 1 ? "titres" : "titre"}
                </span>
              </Link>

              {c.descriptionHtml && (
                <Prose html={c.descriptionHtml} className="mt-6 max-w-3xl" />
              )}

              <ul className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-8">
                {c.livres
                  .filter((b) => b.cover)
                  .slice(0, 6)
                  .map((b) => (
                    <li key={b.slug} className="w-24 sm:w-28">
                      <Link
                        href={`/catalogue/${c.slug}/${b.slug}`}
                        title={b.title}
                        className="groupe-livre block focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-cerise-400"
                      >
                        <Livre3D
                          src={b.cover}
                          titre={b.title}
                          sizes="112px"
                          epaisseur={epaisseurDe(b.pages)}
                        />
                      </Link>
                    </li>
                  ))}
                <li className="w-24 sm:w-28">
                  <Link
                    href={`/catalogue/${c.slug}`}
                    className="flex aspect-3/4 items-center justify-center border border-dashed border-ecorce-300 px-2 text-center font-serif text-sm text-ecorce-600 transition-colors hover:border-griotte-400 hover:bg-cerise-50 hover:text-griotte-500 focus-visible:outline-2 focus-visible:outline-cerise-400"
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
