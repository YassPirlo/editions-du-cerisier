import Image from "next/image";
import Link from "next/link";
import { Branche, Cerise } from "@/components/Cerisier";
import { epaisseurDe, Livre3D } from "@/components/Livre3D";
import { Prose } from "@/components/Prose";
import { type Book, books, collections, excerpt, pages } from "@/lib/content";

const presentation = pages.presentation[0];
const alaune = pages.alaune[0];

/* Les parutions récentes : les entrées « Nouveautés » raccrochées à leur
   fiche par la couverture. Ici la couverture n'est pas un ornement — sans
   image, pas de volume à poser — on écarte donc les titres qui n'en ont pas. */
const parutions = pages.nouveautes
  .map((n) => books.find((b) => b.cover === n.images[0]))
  .filter((b): b is Book & { cover: string } => b?.cover != null);

const vitrine = parutions.slice(0, 3);
const recolte = parutions.slice(0, 8);

const index = collections
  .map((c) => ({ ...c, count: books.filter((b) => b.collection === c.slug).length }))
  .filter((c) => c.count > 0);

export default function Home() {
  return (
    <>
      {/* Sous la branche : le premier écran est la vitrine à la tombée du
          jour. Deux branches à deux vitesses font la profondeur du feuillage,
          et tout se met en place comme on dresse une table — le décor, le
          titre, puis les volumes (voir « L'ENTRÉE », globals.css). */}
      <section className="relative overflow-hidden bg-feuille-900 text-fleur-100">
        <div className="entree-opacite tempo-1 pointer-events-none absolute inset-0" aria-hidden="true">
          {/* La branche lointaine, presque immobile. */}
          <div className="branche-derive-lente absolute -top-8 left-[-6%] hidden h-[19rem] w-[125%] opacity-60 sm:block">
            <Branche className="h-full w-full text-feuille-800" />
          </div>
          {/* La branche proche, qui voyage vraiment au défilement. Sur
              mobile, une pleine largeur ne montrerait qu'un tronçon nu : on
              donne au SVG plus large que l'écran pour retomber sur une
              portion qui porte des fruits. */}
          <div className="branche-derive absolute -top-14 -left-10 h-[14rem] w-[40rem] sm:hidden">
            <Branche className="h-full w-full text-feuille-700" />
          </div>
          {/* 130 % de large : la branche doit déborder largement des deux
              côtés en fin de dérive, sinon elle découvrirait son bord droit
              en glissant. */}
          <div className="branche-derive absolute -top-24 left-[-8%] hidden h-[24rem] w-[130%] sm:block">
            <Branche className="h-full w-full text-feuille-700" />
          </div>
        </div>

        <div className="relative mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-6xl content-center gap-14 px-4 pt-28 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pt-32 lg:pb-20">
          <div className="lg:col-span-6 lg:self-center">
            <h1 className="titre-verger entree tempo-1 text-[2.9rem] leading-[1.02] text-balance text-fleur-50 sm:text-6xl lg:text-7xl">
              Bienvenue aux
              <br />
              Éditions du Cerisier
            </h1>
            <p className="entree tempo-2 mt-9 max-w-lg font-serif text-lg leading-relaxed text-fleur-200 italic sm:text-xl">
              Petites, mais obstinées, les Éditions du Cerisier cherchent, avant
              tout, à rendre publics les livres qui relatent, imaginent,
              témoignent des peuples, de leurs cultures, de leurs luttes, de
              leurs libertés…
            </p>
            <div className="entree tempo-3 mt-11 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/catalogue"
                className="inline-block bg-cerise-400 px-7 py-3.5 text-xs font-bold tracking-[0.16em] text-ecorce-900 uppercase transition-colors hover:bg-fleur-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cerise-400"
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
              hauteur comme sur une table de libraire — et ils se hissent de
              plus bas que le texte, en dernier. */}
          <ul className="flex items-end justify-center gap-5 sm:gap-8 lg:col-span-6 lg:justify-end lg:self-center">
            {vitrine.map((b, i) => (
              <li
                key={`${b.collection}/${b.slug}`}
                className={`entree w-[7.5rem] shrink-0 sm:w-40 lg:w-44 ${
                  i === 1 ? "mb-12" : i === 2 ? "mb-5 hidden sm:block" : ""
                }`}
                style={
                  {
                    "--tempo": `${0.5 + i * 0.16}s`,
                    "--souleve": "5rem",
                  } as React.CSSProperties
                }
              >
                <Link
                  href={`/catalogue/${b.collection}/${b.slug}`}
                  className="groupe-livre block focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-cerise-400"
                >
                  <Livre3D
                    src={b.cover}
                    titre={b.title}
                    sizes="(min-width: 1024px) 176px, (min-width: 640px) 160px, 120px"
                    epaisseur={epaisseurDe(b.pages)}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* La clairière : le texte de l'éditeur revient sur papier. Composer un
          avant-propos de cette longueur en clair sur vert le rendrait
          illisible — et c'est son texte, pas un ornement. */}
      <section className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
        <div className="pousse">
          <h2 className="titre-verger text-2xl text-ecorce-900 sm:text-3xl">
            Avant-propos
          </h2>
          <Prose
            html={presentation.html}
            className="lettrine mt-9 font-serif text-[1.0625rem] leading-[1.9]"
          />
        </div>
      </section>

      {/* Le tronc : la citation, reprise mot pour mot du site, se pose en
          pleine scène — c'est le moment fort de la page, il a droit au
          grand geste. */}
      <section className="overflow-hidden border-y border-feuille-700 bg-feuille-800">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <blockquote className="pousse-scene titre-verger max-w-4xl text-4xl leading-[1.08] text-balance text-fleur-50 sm:text-6xl">
            « Ni dieu, ni maître. Juste un grand réservoir d’enthousiasme,
            d’esprit critique et de connivence avec la révolution permanente. »
          </blockquote>
          <p className="pousse mt-10 max-w-xl leading-relaxed text-fleur-200/80">
            Le socle des Editions, constituées en société coopérative, c’est leur
            indépendance matérielle et intellectuelle.
          </p>
          <p className="pousse mt-6 font-serif text-fleur-200 italic">Jean Delval</p>
        </div>
      </section>

      {/* La table des collections : un index de catalogue imprimé — le nom,
          la conduite pointillée, le nombre de titres. Le chiffre est une
          information réelle, pas un numéro d'ordre décoratif. */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="pousse">
          <div className="flex items-baseline gap-4 sm:gap-6">
            <h2 className="titre-verger text-2xl text-ecorce-900 sm:text-3xl">
              Les collections
            </h2>
            <span className="leader" aria-hidden="true" />
            <p className="shrink-0 font-serif text-sm text-ecorce-500 tabular-nums">
              {books.length} titres
            </p>
          </div>
          <ol className="mt-10 border-t border-ecorce-200">
            {index.map((c) => (
              <li key={c.slug} className="border-b border-ecorce-200">
                <Link
                  href={`/catalogue/${c.slug}`}
                  className="group flex items-baseline gap-4 py-5 focus-visible:outline-2 focus-visible:outline-cerise-400 sm:gap-6"
                >
                  <span className="font-serif text-xl text-ecorce-900 transition-colors group-hover:text-griotte-500 sm:text-2xl">
                    {c.name}
                  </span>
                  <span className="leader" aria-hidden="true" />
                  <Cerise className="h-4 w-4 shrink-0 translate-y-0.5 text-ecorce-300 group-hover:hidden" />
                  <Cerise
                    filled
                    className="hidden h-4 w-4 shrink-0 translate-y-0.5 text-griotte-500 group-hover:block"
                  />
                  <span className="w-8 shrink-0 text-right font-serif text-sm text-ecorce-500 tabular-nums">
                    {c.count}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Link
              href="/catalogue"
              className="font-serif text-ecorce-700 underline decoration-cerise-400 decoration-2 underline-offset-[6px] transition-colors hover:text-griotte-500"
            >
              Parcourir tout le catalogue →
            </Link>
          </div>
        </div>
      </section>

      {/* La récolte : les dernières parutions. Chaque volume se redresse en
          entrant dans le champ — le geste du libraire qui met un livre
          debout (.poser). */}
      <section className="border-y border-feuille-700 bg-feuille-900 text-fleur-100">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <h2 className="pousse titre-verger text-2xl text-fleur-50 sm:text-3xl">
            Vient de paraître
          </h2>
          <ul className="mt-16 grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-3 sm:gap-x-12 lg:grid-cols-4">
            {recolte.map((b) => (
              <li key={`${b.collection}/${b.slug}`} className="poser">
                <Link
                  href={`/catalogue/${b.collection}/${b.slug}`}
                  className="groupe-livre group block focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-cerise-400"
                >
                  <Livre3D
                    src={b.cover}
                    titre={b.title}
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 28vw, 42vw"
                    epaisseur={epaisseurDe(b.pages)}
                  />
                  <p className="mt-7 font-serif text-[0.95rem] leading-snug text-fleur-100 transition-colors group-hover:text-griotte-300">
                    {b.title}
                  </p>
                  <p className="mt-1 text-xs text-feuille-300">{b.collectionName}</p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="pousse mt-14">
            <Link
              href="/a-la-une/nouveautes"
              className="font-serif text-fleur-200 underline decoration-cerise-400 decoration-2 underline-offset-[6px] transition-colors hover:text-fleur-50"
            >
              Toutes les nouveautés →
            </Link>
          </div>
        </div>
      </section>

      {/* À la une : la vie de la maison, sur papier. */}
      {alaune && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <h2 className="pousse titre-verger text-2xl text-ecorce-900 sm:text-3xl">
            À la une
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
            {alaune.images[0] && (
              <div className="pousse-scene relative mx-auto h-64 w-48 shrink-0 md:h-80 md:w-56">
                <Image
                  src={alaune.images[0]}
                  alt={`Couverture de « ${alaune.title} »`}
                  fill
                  sizes="224px"
                  className="object-contain drop-shadow-xl"
                />
              </div>
            )}
            <div className="pousse">
              <h3 className="titre-verger text-xl leading-tight text-balance text-ecorce-900 sm:text-2xl">
                {alaune.title}
              </h3>
              <p className="mt-4 max-w-2xl leading-relaxed text-ecorce-700">
                {excerpt(alaune.text, 320)}
              </p>
              <Link
                href="/a-la-une"
                className="mt-6 inline-block font-serif text-ecorce-700 underline decoration-cerise-400 decoration-2 underline-offset-[6px] transition-colors hover:text-griotte-500"
              >
                Lire la suite →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Le jaune imposé garde le dernier mot. */}
      <section className="bg-cerise-400 text-ecorce-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-20 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="titre-verger text-3xl leading-tight sm:text-4xl">
              Vous rêvez d’être publié ?
            </h2>
            <p className="mt-3 max-w-md leading-relaxed text-ecorce-800">
              Les Éditions du Cerisier publient uniquement à compte d’éditeur. Le
              manuscrit doit nous parvenir en version papier, par courrier normal.
            </p>
          </div>
          <Link
            href="/envoyer-un-manuscrit"
            className="shrink-0 self-start bg-ecorce-900 px-8 py-4 text-xs font-bold tracking-[0.16em] text-cerise-400 uppercase transition-colors hover:bg-feuille-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ecorce-900 md:self-auto"
          >
            Envoyer un manuscrit
          </Link>
        </div>
      </section>
    </>
  );
}
