import Image from "next/image";
import Link from "next/link";
import { Prose } from "@/components/Prose";
import { books, collections, pages } from "@/lib/content";

const presentation = pages.presentation[0];

const index = collections
  .map((c) => ({ ...c, count: books.filter((b) => b.collection === c.slug).length }))
  .filter((c) => c.count > 0);

const parutions = pages.nouveautes
  .slice(0, 6)
  .map((n) => books.find((b) => b.cover === n.images[0]))
  .filter((b) => b !== undefined);

export default function VarianteLivre() {
  return (
    <div className="bg-[#faf7f2] text-ecorce-900">
      {/* Page de titre */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-24 text-center sm:pt-28">
        <p className="text-[0.7rem] tracking-[0.35em] text-ecorce-500 uppercase">
          Éditions du Cerisier
        </p>
        <div className="mt-5 border-t border-b border-ecorce-300 py-10">
          <h1 className="font-serif text-4xl leading-[1.12] font-normal text-balance sm:text-5xl">
            Bienvenue aux Éditions du Cerisier
          </h1>
          <p className="mt-7 font-serif text-lg leading-relaxed text-ecorce-700 italic">
            Petites, mais obstinées, les Éditions du Cerisier cherchent, avant tout,
            à rendre publics les livres qui relatent, imaginent, témoignent des
            peuples, de leurs cultures, de leurs luttes, de leurs libertés…
          </p>
        </div>
        <p className="mt-6 text-[0.7rem] tracking-[0.28em] text-ecorce-500 uppercase">
          Cuesmes · Belgique · Depuis 1985
        </p>
      </section>

      {/* Avant-propos, en double colonne avec lettrine */}
      {/* Le texte d'origine est composé en lignes courtes manuelles : une seule
          colonne large les respecte, deux colonnes les réduisent à des moignons. */}
      <section className="mx-auto max-w-2xl px-6 pb-24">
        <p className="mb-8 border-b border-ecorce-200 pb-3 text-[0.7rem] tracking-[0.28em] text-ecorce-500 uppercase">
          Avant-propos
        </p>
        <Prose html={presentation.html} className="lettrine font-serif text-[1.0625rem] leading-[1.9]" />
      </section>

      {/* Index des collections, avec conduite pointillée */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="mb-8 flex items-baseline justify-between border-b border-ecorce-200 pb-3">
          <p className="text-[0.7rem] tracking-[0.28em] text-ecorce-500 uppercase">
            Table des collections
          </p>
          <p className="font-serif text-sm text-ecorce-500">{books.length} titres</p>
        </div>

        <ol>
          {index.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/catalogue/${c.slug}`}
                className="group flex items-baseline py-3.5 transition-colors hover:text-ecorce-500"
              >
                <span className="w-9 shrink-0 font-serif text-sm text-ecorce-400 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-xl group-hover:underline group-hover:underline-offset-4">
                  {c.name}
                </span>
                <span className="leader" aria-hidden="true" />
                <span className="shrink-0 font-serif text-sm text-ecorce-500 tabular-nums">
                  {c.count}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Parutions : pas de cartes, seulement des couvertures posées sur la page */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <p className="mb-10 border-b border-ecorce-200 pb-3 text-[0.7rem] tracking-[0.28em] text-ecorce-500 uppercase">
          Dernières parutions
        </p>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3">
          {parutions.map((b) => (
            <li key={`${b.collection}/${b.slug}`}>
              <Link href={`/catalogue/${b.collection}/${b.slug}`} className="group block">
                {b.cover && (
                  <div className="relative aspect-3/4 w-full">
                    <Image
                      src={b.cover}
                      alt={`Couverture de « ${b.title} »`}
                      fill
                      sizes="(min-width: 640px) 260px, 45vw"
                      className="object-contain object-bottom"
                    />
                  </div>
                )}
                <p className="mt-5 border-t border-ecorce-200 pt-3 font-serif text-[0.95rem] leading-snug group-hover:underline group-hover:underline-offset-4">
                  {b.title}
                </p>
                <p className="mt-1.5 text-[0.7rem] tracking-[0.16em] text-ecorce-400 uppercase">
                  {b.collectionName}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Colophon */}
      <section className="border-t border-ecorce-300">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-[0.7rem] tracking-[0.28em] text-ecorce-500 uppercase">
            Colophon
          </p>
          <p className="mx-auto mt-6 max-w-md font-serif leading-relaxed text-ecorce-700">
            Les Éditions du Cerisier publient uniquement à compte d’éditeur. Le
            manuscrit doit nous parvenir en version papier, par courrier normal.
          </p>
          <Link
            href="/envoyer-un-manuscrit"
            className="mt-8 inline-block border-b border-ecorce-900 pb-1 font-serif text-lg hover:text-ecorce-500"
          >
            Envoyer un manuscrit
          </Link>
        </div>
      </section>
    </div>
  );
}
