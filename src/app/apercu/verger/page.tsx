import Link from "next/link";
import { Branche, Cerise } from "@/components/Cerisier";
import { Livre3D } from "@/components/Livre3D";
import { Prose } from "@/components/Prose";
import { type Book, books, collections, pages } from "@/lib/content";

const presentation = pages.presentation[0];

const index = collections
  .map((c) => ({ ...c, count: books.filter((b) => b.collection === c.slug).length }))
  .filter((c) => c.count > 0);

const parutions = pages.nouveautes
  .slice(0, 8)
  .map((n) => books.find((b) => b.cover === n.images[0]))
  // Ici la couverture n'est pas un ornement : sans image, pas de volume à
  // montrer. On écarte donc les titres qui n'en ont pas.
  .filter((b): b is Book & { cover: string } => b?.cover != null);

/* Trois épaisseurs qui reviennent en boucle. Une pile de volumes strictement
   identiques se lit comme un gabarit ; un rayonnage, non. */
const epaisseurs = ["1.5rem", "2.1rem", "1.75rem", "2.4rem"];

export default function VarianteVerger() {
  const vitrine = parutions.slice(0, 3);

  return (
    <div className="bg-feuille-900 text-fleur-100">
      {/* Sous l'arbre : le feuillage sombre, la lumière qui tombe en oblique,
          et trois volumes posés dessous. */}
      <section className="relative overflow-hidden">
        {/* La branche traverse le haut du champ et sort par les deux bords.
            En feuille-700 elle reste une ombre portée, pas une illustration.
            Sur mobile, une pleine largeur ne laisse voir qu'un tronçon rectiligne
            au milieu du tracé : on donne au SVG une largeur plus grande que le
            viewport pour qu'il retombe sur une portion qui porte des fruits. */}
        <Branche className="pointer-events-none absolute -top-16 -left-8 h-[13rem] w-[34rem] text-feuille-700 sm:hidden" />
        <Branche className="pointer-events-none absolute -top-24 left-0 hidden h-[22rem] w-full text-feuille-700 sm:block" />
        <div className="relative mx-auto grid max-w-6xl gap-16 px-4 pt-28 pb-24 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:pt-40 lg:pb-32">
          <div className="lg:col-span-6 lg:pt-6">
            <p className="flex items-center gap-3 text-[0.7rem] tracking-[0.28em] text-feuille-300 uppercase">
              <Cerise filled className="h-4 w-4 shrink-0 text-griotte-300" />
              Cuesmes · Belgique · Depuis 1985
            </p>
            <h1 className="mt-7 font-serif text-[2.75rem] leading-[1.04] font-normal text-balance text-fleur-50 sm:text-6xl">
              Bienvenue aux
              <br />
              Éditions du Cerisier
            </h1>
            <p className="mt-8 max-w-lg font-serif text-lg leading-relaxed text-fleur-200 italic">
              Petites, mais obstinées, les Éditions du Cerisier cherchent, avant
              tout, à rendre publics les livres qui relatent, imaginent,
              témoignent des peuples, de leurs cultures, de leurs luttes, de
              leurs libertés…
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/catalogue"
                className="inline-block bg-cerise-400 px-7 py-3.5 text-xs font-bold tracking-[0.16em] text-ecorce-900 uppercase transition-colors hover:bg-fleur-100"
              >
                Découvrir les {books.length} titres
              </Link>
              <Link
                href="/envoyer-un-manuscrit"
                className="border-b border-feuille-400 pb-1 font-serif text-fleur-200 transition-colors hover:border-griotte-300 hover:text-fleur-50"
              >
                Envoyer un manuscrit
              </Link>
            </div>
          </div>

          {/* Les volumes ne sont pas alignés : ils sont posés, décalés en
              hauteur comme sur une table de libraire. */}
          <ul className="flex items-end justify-center gap-5 sm:gap-8 lg:col-span-6 lg:justify-end">
            {vitrine.map((b, i) => (
              <li
                key={`${b.collection}/${b.slug}`}
                className={`w-[7.5rem] shrink-0 sm:w-40 lg:w-44 ${
                  i === 1 ? "mb-10" : i === 2 ? "mb-4 hidden sm:block" : ""
                }`}
              >
                <Link href={`/catalogue/${b.collection}/${b.slug}`} className="block">
                  <Livre3D
                    src={b.cover}
                    alt={`Couverture de « ${b.title} »`}
                    sizes="(min-width: 1024px) 176px, (min-width: 640px) 160px, 120px"
                    epaisseur={epaisseurs[i]}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* La clairière : le texte long revient sur du papier. Composer un
          avant-propos de cette longueur en clair sur vert le rendrait
          illisible, et c'est le texte de l'éditeur, pas un ornement. */}
      <section className="bg-fleur-50 text-ecorce-900">
        <div className="mx-auto max-w-2xl px-6 py-20 sm:py-24">
          <p className="flex items-center gap-3 text-[0.7rem] tracking-[0.28em] text-ecorce-500 uppercase">
            <Cerise className="h-3.5 w-3.5 shrink-0 text-griotte-500" />
            Avant-propos
          </p>
          <Prose
            html={presentation.html}
            className="lettrine mt-8 font-serif text-[1.0625rem] leading-[1.9]"
          />
        </div>
      </section>

      {/* Le tronc : citation reprise mot pour mot du site */}
      <section className="border-b border-feuille-700 bg-feuille-800">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <blockquote className="font-serif text-4xl leading-[1.08] text-balance text-fleur-50 sm:text-5xl">
            « Ni dieu, ni maître. Juste un grand réservoir d’enthousiasme,
            d’esprit critique et de connivence avec la révolution permanente. »
          </blockquote>
          <p className="mt-8 max-w-xl leading-relaxed text-fleur-200/80">
            Le socle des Editions, constituées en société coopérative, c’est leur
            indépendance matérielle et intellectuelle.
          </p>
          <p className="mt-6 text-[0.7rem] tracking-[0.22em] text-griotte-300 uppercase">
            Jean Delval
          </p>
        </div>
      </section>

      {/* Les collections : les branches. Le fruit mûrit au survol. */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
        <p className="text-[0.7rem] tracking-[0.28em] text-feuille-300 uppercase">
          Les collections
        </p>
        <ol className="mt-10 border-t border-feuille-700">
          {index.map((c, i) => (
            <li key={c.slug} className="border-b border-feuille-700">
              <Link
                href={`/catalogue/${c.slug}`}
                className="group flex items-baseline gap-4 py-5 transition-colors sm:gap-8"
              >
                <span className="w-7 shrink-0 font-serif text-sm text-feuille-400 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-serif text-xl text-fleur-100 group-hover:text-griotte-300 sm:text-2xl">
                  {c.name}
                </span>
                <Cerise className="h-4 w-4 shrink-0 translate-y-0.5 text-feuille-500 transition-colors group-hover:hidden" />
                <Cerise
                  filled
                  className="hidden h-4 w-4 shrink-0 translate-y-0.5 text-griotte-300 group-hover:block"
                />
                <span className="w-6 shrink-0 text-right font-serif text-sm text-feuille-300 tabular-nums">
                  {c.count}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* La récolte */}
      <section className="bg-feuille-800">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <p className="text-[0.7rem] tracking-[0.28em] text-feuille-300 uppercase">
            Vient de paraître
          </p>
          <ul className="mt-14 grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-3 sm:gap-x-12 lg:grid-cols-4">
            {parutions.map((b, i) => (
              <li key={`${b.collection}/${b.slug}`}>
                <Link href={`/catalogue/${b.collection}/${b.slug}`} className="group block">
                  <Livre3D
                    src={b.cover}
                    alt={`Couverture de « ${b.title} »`}
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 28vw, 42vw"
                    epaisseur={epaisseurs[i % epaisseurs.length]}
                  />
                  <p className="mt-7 font-serif text-[0.95rem] leading-snug text-fleur-100 group-hover:text-griotte-300">
                    {b.title}
                  </p>
                  <p className="mt-1.5 text-[0.68rem] tracking-[0.16em] text-feuille-300 uppercase">
                    {b.collectionName}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Le jaune imposé garde le dernier mot */}
      <section className="bg-cerise-400 text-ecorce-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
              Vous écrivez ?
            </h2>
            <p className="mt-3 max-w-md leading-relaxed text-ecorce-800">
              Les Éditions du Cerisier publient uniquement à compte d’éditeur. Le
              manuscrit doit nous parvenir en version papier, par courrier normal.
            </p>
          </div>
          <Link
            href="/envoyer-un-manuscrit"
            className="shrink-0 self-start bg-ecorce-900 px-8 py-4 text-xs font-bold tracking-[0.16em] text-cerise-400 uppercase transition-colors hover:bg-white hover:text-ecorce-900 md:self-auto"
          >
            Envoyer un manuscrit
          </Link>
        </div>
      </section>
    </div>
  );
}
