import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cerise } from "@/components/Cerisier";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { type Book, books, pages } from "@/lib/content";
import { dateDeParution } from "@/lib/parution";

export const metadata: Metadata = {
  title: "Nouveautés",
  description: "Les dernières parutions des Éditions du Cerisier.",
  alternates: { canonical: "/a-la-une/nouveautes" },
};

/* Chaque entrée « Nouveautés » raccrochée à sa fiche par la couverture,
   dans l'ordre de la rubrique — c'est l'ordre de parution de l'éditeur. */
const parutions = pages.nouveautes.map((e) => ({
  ...e,
  book: e.images[0]
    ? books.find((b) => b.cover === e.images[0])
    : undefined,
  date: dateDeParution(e.text),
}));

const [alaune, ...suite] = parutions;

function BadgeParution({ date }: { date: string | null }) {
  if (!date) return null;
  return (
    <p className="flex items-center gap-1.5 text-[0.8125rem] font-semibold tracking-[0.08em] text-griotte-500 uppercase">
      <Cerise filled className="h-4 w-4 -translate-y-px" />
      {date}
    </p>
  );
}

function LienFiche({ book }: { book?: Book }) {
  if (!book) return null;
  return (
    <p className="mt-6">
      <Link
        href={`/catalogue/${book.collection}/${book.slug}`}
        className="font-serif text-ecorce-700 underline decoration-cerise-400 decoration-2 underline-offset-[6px] transition-colors hover:text-griotte-500"
      >
        Voir la fiche du livre
      </Link>
      {book.price ? (
        <span className="ml-3 text-sm text-ecorce-600">
          {book.price}
          {book.pages ? ` · ${book.pages} p.` : null}
        </span>
      ) : null}
    </p>
  );
}

export default function NouveautesPage() {
  return (
    <>
      <PageHeader
        title="Nouveautés"
        intro={`${pages.nouveautes.length} parutions récentes.`}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "À la une", href: "/a-la-une" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        {/* La dernière parution ouvre la page en pleine largeur : c'est
            l'étal du libraire, le livre posé face au lecteur. */}
        {alaune ? (
          <article className="pousse-scene grid gap-8 border-b border-ecorce-200 pb-14 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-12">
            {alaune.images[0] ? (
              <div className="relative mx-auto h-80 w-56 shrink-0 md:mx-0 md:h-[22rem] md:w-full">
                <Image
                  src={alaune.images[0]}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 240px, 224px"
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </div>
            ) : null}
            <div className="min-w-0">
              <BadgeParution date={alaune.date} />
              <h2 className="titre-verger mt-3 text-3xl leading-tight text-balance text-ecorce-900 sm:text-4xl">
                {alaune.title}
              </h2>
              <Prose html={alaune.html} className="mt-6" />
              <LienFiche book={alaune.book} />
            </div>
          </article>
        ) : null}

        {/* Les parutions suivantes en sommaire de revue, la couverture
            changeant de côté une fois sur deux — le regard descend la page
            en zigzag, comme on parcourt un étal. */}
        <ul className="divide-y divide-ecorce-200">
          {suite.map((e, i) => {
            const droite = i % 2 === 1;
            return (
              <li
                key={`${e.title}-${i}`}
                className={`pousse grid gap-8 py-12 ${
                  droite ? "md:grid-cols-[1fr_auto]" : "md:grid-cols-[auto_1fr]"
                }`}
              >
                {e.images[0] ? (
                  <div
                    className={`relative mx-auto h-56 w-40 shrink-0 md:mx-0 md:h-64 md:w-44 ${
                      droite ? "md:order-2" : ""
                    }`}
                  >
                    <Image
                      src={e.images[0]}
                      alt=""
                      fill
                      sizes="176px"
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                ) : null}
                <div className="min-w-0">
                  <BadgeParution date={e.date} />
                  <h2 className="titre-verger mt-2 text-xl leading-snug text-balance text-ecorce-900 sm:text-2xl">
                    {e.title}
                  </h2>
                  <Prose html={e.html} className="mt-5" />
                  <LienFiche book={e.book} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
