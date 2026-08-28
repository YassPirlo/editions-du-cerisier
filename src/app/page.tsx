import Image from "next/image";
import Link from "next/link";
import { BookCard } from "@/components/BookCard";
import { Prose } from "@/components/Prose";
import { SectionHeading } from "@/components/SectionHeading";
import { books, collections, excerpt, pages } from "@/lib/content";

const presentation = pages.presentation[0];
const alaune = pages.alaune[0];

const derniereParution = pages.nouveautes[0];
const livreEnAvant = books.find((b) => b.cover === derniereParution?.images[0]);

const highlights = collections
  .map((c) => ({
    ...c,
    count: books.filter((b) => b.collection === c.slug).length,
  }))
  .filter((c) => c.count > 0);

const derniers = collections
  .flatMap((c) => books.filter((b) => b.collection === c.slug && b.cover).slice(0, 2))
  .slice(0, 8);

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-ecorce-50">
        <div
          className="pointer-events-none absolute top-1/2 right-0 h-[38rem] w-[38rem] -translate-y-1/2 translate-x-1/3 rounded-[42%_58%_63%_37%/42%_38%_62%_58%] bg-cerise-100/60 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-6xl gap-16 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-cerise-600 uppercase">
              Société coopérative · depuis 1985
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-ecorce-900 sm:text-5xl lg:text-6xl">
              Bienvenue aux Éditions du Cerisier
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-ecorce-600">
              Petites, mais obstinées, les Éditions du Cerisier cherchent, avant tout,
              à rendre publics les livres qui relatent, imaginent, témoignent des
              peuples, de leurs cultures, de leurs luttes, de leurs libertés…
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/catalogue"
                className="group inline-flex items-center gap-3 border border-ecorce-900 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-ecorce-900 uppercase transition-colors hover:bg-ecorce-900 hover:text-white"
              >
                Découvrir le catalogue
                <span
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
              <Link
                href="/qui-sommes-nous"
                className="text-xs font-semibold tracking-[0.16em] text-ecorce-600 uppercase underline decoration-cerise-400 decoration-2 underline-offset-[6px] transition-colors hover:text-ecorce-900"
              >
                Qui sommes-nous ?
              </Link>
            </div>
            <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-5 border-t border-ecorce-200/70 pt-8">
              <div>
                <dt className="text-[0.7rem] tracking-[0.14em] text-ecorce-400 uppercase">
                  Titres au catalogue
                </dt>
                <dd className="mt-1.5 font-serif text-2xl font-semibold text-ecorce-900">
                  {books.length}
                </dd>
              </div>
              <div>
                <dt className="text-[0.7rem] tracking-[0.14em] text-ecorce-400 uppercase">
                  Collections
                </dt>
                <dd className="mt-1.5 font-serif text-2xl font-semibold text-ecorce-900">
                  {collections.length}
                </dd>
              </div>
              <div>
                <dt className="text-[0.7rem] tracking-[0.14em] text-ecorce-400 uppercase">
                  Fondées en
                </dt>
                <dd className="mt-1.5 font-serif text-2xl font-semibold text-ecorce-900">
                  1985
                </dd>
              </div>
            </dl>
          </div>

          {livreEnAvant?.cover && (
            <div className="relative">
              <Link href={`/catalogue/${livreEnAvant.collection}/${livreEnAvant.slug}`}>
                <div className="relative mx-auto aspect-3/4 w-full max-w-[19rem] sm:max-w-[22rem]">
                  <Image
                    src={livreEnAvant.cover}
                    alt={`Couverture de « ${livreEnAvant.title} »`}
                    fill
                    sizes="(min-width: 1024px) 22rem, (min-width: 640px) 22rem, 70vw"
                    className="object-contain drop-shadow-2xl"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
                <p className="mx-auto mt-8 max-w-xs text-center font-serif text-sm leading-relaxed text-ecorce-500">
                  <span className="block text-[0.7rem] font-semibold tracking-[0.22em] text-cerise-600 uppercase">
                    Dernière parution
                  </span>
                  <span className="mt-2 block text-ecorce-800">
                    {livreEnAvant.title}
                  </span>
                </p>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Les Éditions du Cerisier"
          title="Présentation"
        />
        {/* Le texte d'origine contient des sauts de ligne manuels : on centre le bloc,
            pas le texte, pour qu'il reste aligné sous le titre centré. */}
        <div className="mt-10 flex justify-center">
          <Prose html={presentation.html} className="max-w-2xl" />
        </div>
      </section>

      {alaune && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-10 rounded-2xl border border-ecorce-100 bg-ecorce-50 p-6 sm:p-10 md:grid-cols-[auto_1fr] md:items-center">
            {alaune.images[0] && (
              <div className="relative mx-auto h-64 w-48 shrink-0 md:h-72 md:w-52">
                <Image
                  src={alaune.images[0]}
                  alt={`Couverture de « ${alaune.title} »`}
                  fill
                  sizes="208px"
                  className="rounded-lg object-contain"
                />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-cerise-600 uppercase">
                À la une
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-balance text-ecorce-900 sm:text-3xl">
                {alaune.title}
              </h2>
              <p className="mt-4 leading-relaxed text-ecorce-600">
                {excerpt(alaune.text, 320)}
              </p>
              <Link
                href="/a-la-une"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ecorce-700 underline decoration-cerise-400 decoration-2 underline-offset-4 hover:text-ecorce-900"
              >
                Lire la suite
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Le catalogue"
          title="Nos collections"
          subtitle={`${books.length} titres répartis en ${collections.length} collections.`}
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/catalogue/${c.slug}`}
                className="group flex h-full flex-col rounded-xl border border-ecorce-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cerise-300 hover:shadow-md hover:shadow-ecorce-900/5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-lg font-semibold text-ecorce-900">
                    {c.name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-cerise-100 px-2.5 py-0.5 text-xs font-semibold text-ecorce-700">
                    {c.count}
                  </span>
                </div>
                {c.descriptionText && (
                  <p className="mt-3 text-sm leading-relaxed text-ecorce-500">
                    {excerpt(c.descriptionText, 145)}
                  </p>
                )}
                <span className="mt-4 text-sm font-medium text-ecorce-400 transition-colors group-hover:text-cerise-600">
                  Voir la collection →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link
            href="/catalogue"
            className="group inline-flex items-center gap-3 border border-ecorce-300 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-ecorce-700 uppercase transition-colors hover:border-ecorce-900 hover:bg-ecorce-900 hover:text-white"
          >
            Tout le catalogue
            <span
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading eyebrow="Vient de paraître" title="Parutions récentes" />
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {derniers.map((b) => (
            <li key={`${b.collection}/${b.slug}`}>
              <BookCard book={b} />
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Link
            href="/a-la-une/nouveautes"
            className="group inline-flex items-center gap-3 border border-ecorce-300 px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-ecorce-700 uppercase transition-colors hover:border-ecorce-900 hover:bg-ecorce-900 hover:text-white"
          >
            Toutes les nouveautés
            <span
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </section>

      <section className="border-y border-ecorce-100 bg-ecorce-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-ecorce-900 sm:text-3xl">
              Vous rêvez d’être publié ?
            </h2>
            <p className="mt-3 leading-relaxed text-ecorce-600">
              Les Éditions du Cerisier publient uniquement à compte d’éditeur. Avant
              de nous envoyer votre manuscrit, prenez le temps de faire notre
              connaissance.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/envoyer-un-manuscrit"
              className="rounded-lg bg-cerise-400 px-6 py-3 text-sm font-semibold text-ecorce-900 transition-colors hover:bg-cerise-300"
            >
              Envoyer un manuscrit
            </Link>
            <Link
              href="/ligne-editoriale"
              className="rounded-lg border border-ecorce-200 bg-white px-6 py-3 text-sm font-semibold text-ecorce-700 transition-colors hover:bg-white/60"
            >
              Notre ligne éditoriale
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
