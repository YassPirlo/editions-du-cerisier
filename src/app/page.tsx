import Image from "next/image";
import Link from "next/link";
import { Branche, Cerise, Fleuron, Petale } from "@/components/Cerisier";
import { FluxCouvertures } from "@/components/FluxCouvertures";
import { LampeDeLecture } from "@/components/LampeDeLecture";
import { epaisseurDe, Livre3D } from "@/components/Livre3D";
import { Prose } from "@/components/Prose";
import { type Book, books, collections, excerpt, pages } from "@/lib/content";

const presentation = pages.presentation[0];
const alaune = pages.alaune[0];
const presse = pages.presse;

/* Les parutions récentes : les entrées « Nouveautés » raccrochées à leur
   fiche par la couverture. Ici la couverture n'est pas un ornement — sans
   image, pas de volume à poser — on écarte donc les titres qui n'en ont pas. */
const parutions = pages.nouveautes
  .map((n) => books.find((b) => b.cover === n.images[0]))
  .filter((b): b is Book & { cover: string } => b?.cover != null);

const recolte = parutions.slice(0, 8);

const index = collections
  .map((c) => {
    const siens = books.filter((b) => b.collection === c.slug);
    return {
      ...c,
      count: siens.length,
      /* Trois couvertures en main de cartes au bout de la ligne. */
      apercus: siens.filter((b) => b.cover).slice(0, 3),
    };
  })
  .filter((c) => c.count > 0);

const avecCouverture = books.filter(
  (b): b is Book & { cover: string } => b.cover != null,
);
/* Le couloir du héros montre les parutions par ordre de nouveauté : la
   rubrique « Nouveautés » fait foi (l'ordre y est celui de l'éditeur). */
const flux = parutions.slice(0, 12);
/* Seize couvertures pour le rayonnage, prélevées régulièrement dans tout
   le catalogue. */
const pasRayon = Math.max(1, Math.floor(avecCouverture.length / 16));
const rayonnage = avecCouverture
  .filter((_, i) => (i + Math.floor(pasRayon / 2)) % pasRayon === 0)
  .slice(0, 16);

/* Les pétales du premier écran : position, taille, durée et vent fixés une
   fois pour toutes — le hasard à l'exécution ferait clignoter l'hydratation. */
const petales = [
  { x: "6%", taille: "0.7rem", duree: "17s", retard: "-3s", vent: "3rem", voile: "0.4" },
  { x: "16%", taille: "1rem", duree: "13s", retard: "-9s", vent: "-2.5rem", voile: "0.5" },
  { x: "31%", taille: "0.6rem", duree: "19s", retard: "-6s", vent: "4.5rem", voile: "0.35" },
  { x: "47%", taille: "0.85rem", duree: "14s", retard: "-1s", vent: "-3rem", voile: "0.45" },
  { x: "62%", taille: "0.7rem", duree: "16s", retard: "-12s", vent: "2rem", voile: "0.4" },
  { x: "74%", taille: "1.05rem", duree: "12s", retard: "-5s", vent: "-4rem", voile: "0.55" },
  { x: "86%", taille: "0.75rem", duree: "18s", retard: "-8s", vent: "3.5rem", voile: "0.4" },
  { x: "94%", taille: "0.9rem", duree: "15s", retard: "-2s", vent: "-2rem", voile: "0.5" },
];

export default function Home() {
  return (
    <>
      {/* L'encre et l'or : le premier écran est un couloir de couvertures
          qui émergent du point de fuite et balaient vers les bords, en
          boucle — la vitrine d'une librairie qui n'en finit pas (adapté de
          l'Image Stream Hero de ruixen.ui). Les pétales d'avril tombent
          par-dessus, le titre se compose ligne à ligne au centre. */}
      <section className="relative overflow-hidden bg-ecorce-950 text-fleur-100">
        <FluxCouvertures
          couvertures={flux.map((b) => b.cover)}
          duree={22}
          axe={56}
          className="min-h-[calc(100svh-4.5rem)]"
        >
          {/* Le voile : une pénombre radiale sous le texte, pour que le
              titre reste net au-dessus du défilé. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[4] bg-[radial-gradient(ellipse_55%_60%_at_50%_46%,rgba(23,16,8,0.9)_0%,rgba(23,16,8,0.45)_55%,transparent_78%)]"
          />
          {/* L'enseigne veille sur le couloir : la branche se trace à l'or
              au-dessus des couvertures, et dérive au défilement. */}
          <div
            aria-hidden="true"
            className="entree-opacite tempo-1 pointer-events-none absolute inset-0 z-[5] text-cerise-600/60"
          >
            <div className="branche-derive absolute -top-10 left-[-8%] h-[12rem] w-[135%] sm:-top-16 sm:h-[18rem]">
              <Branche className="branche-trace h-full w-full" />
            </div>
          </div>
          {/* Les pétales d'avril. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[6]">
            {petales.map((p, i) => (
              <span
                key={i}
                className="petale text-fleur-200"
                style={
                  {
                    "--x": p.x,
                    "--taille": p.taille,
                    "--duree": p.duree,
                    "--retard": p.retard,
                    "--vent": p.vent,
                    "--voile": p.voile,
                  } as React.CSSProperties
                }
              >
                <Petale />
              </span>
            ))}
          </div>

          <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-4xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
            <h1 className="titre-verger text-5xl leading-[1.02] text-balance text-fleur-50 sm:text-7xl">
              <span className="ligne-masque">
                <span
                  className="ligne entree tempo-1"
                  style={{ "--souleve": "1.15em" } as React.CSSProperties}
                >
                  Bienvenue aux
                </span>
              </span>
              <span className="ligne-masque">
                <span
                  className="ligne entree tempo-2"
                  style={{ "--souleve": "1.15em" } as React.CSSProperties}
                >
                  {/* Comme sur l'enseigne historique : les cerises font les
                      points des deux i de « Cerisier ». Lettres sans point
                      (ı) pour l'œil, mot entier pour les lecteurs d'écran. */}
                  <span aria-hidden="true">
                    Éditions du Cer
                    <span className="i-cerise">
                      ı<Cerise filled className="text-griotte-300" />
                    </span>
                    s
                    <span className="i-cerise">
                      ı<Cerise filled className="text-griotte-300" />
                    </span>
                    er
                  </span>
                  <span className="sr-only">Éditions du Cerisier</span>
                </span>
              </span>
            </h1>
            <p className="entree tempo-3 mt-9 max-w-2xl font-serif text-lg leading-relaxed text-fleur-200 italic sm:text-xl">
              Petites, mais obstinées, les Éditions du Cerisier cherchent, avant
              tout, à rendre publics les livres qui relatent, imaginent,
              témoignent des peuples, de leurs cultures, de leurs luttes, de
              leurs libertés…
            </p>
            <div className="entree tempo-4 mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <Link
                href="/catalogue"
                className="inline-block bg-cerise-400 px-7 py-3.5 text-xs font-bold tracking-[0.16em] text-ecorce-900 uppercase transition-colors hover:bg-fleur-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cerise-400"
              >
                Découvrir les {books.length} titres
              </Link>
              <Link
                href="/envoyer-un-manuscrit"
                className="border-b border-ecorce-400 pb-1 font-serif text-fleur-200 transition-colors hover:border-griotte-300 hover:text-fleur-50"
              >
                Envoyer un manuscrit
              </Link>
            </div>
          </div>
        </FluxCouvertures>
      </section>

      {/* La clairière : le texte de l'éditeur revient sur papier. Composer un
          avant-propos de cette longueur en clair sur l'encre le rendrait
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
          {/* Le fleuron referme l'avant-propos, comme en fin de chapitre. */}
          <Fleuron className="mx-auto mt-14 h-9 w-28 text-ecorce-400" />
        </div>
      </section>

      {/* Le rayonnage : une frise de couvertures longe la page, en boucle.
          La marche s'arrête sous le curseur ; sans animation, elle redevient
          une étagère qu'on fait défiler à la main. */}
      <section
        aria-label="Quelques couvertures du catalogue"
        className="rayon-fenetre border-y border-ecorce-800 bg-ecorce-900 py-12"
      >
        <div className="rayon-defilant flex w-max">
          {[0, 1].map((copie) => (
            <ul
              key={copie}
              aria-hidden={copie === 1 || undefined}
              className={`flex items-center ${copie === 1 ? "rayon-copie" : ""}`}
            >
              {rayonnage.map((b) => (
                <li
                  key={`${copie}-${b.slug}`}
                  className="shrink-0 pr-14 transition-transform duration-300 odd:-rotate-2 even:rotate-[1.6deg] hover:rotate-0 hover:scale-[1.07]"
                >
                  <Link
                    href={`/catalogue/${b.collection}/${b.slug}`}
                    aria-label={b.title}
                    tabIndex={copie === 1 ? -1 : undefined}
                    className="relative block h-44 w-30 sm:h-52 sm:w-36"
                  >
                    <Image
                      src={b.cover}
                      alt=""
                      fill
                      sizes="144px"
                      className="object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.5)]"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* Le tronc : la citation, reprise mot pour mot du site. Elle se pose
          en scène, puis la lumière la traverse au fil de la lecture. */}
      <LampeDeLecture className="bg-ecorce-900">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="pousse-scene">
            <blockquote className="balayage-lumiere titre-verger max-w-4xl text-4xl leading-[1.08] text-balance text-fleur-50 sm:text-6xl">
              « Ni dieu, ni maître. Juste un grand réservoir d’enthousiasme,
              d’esprit critique et de connivence avec la révolution permanente. »
            </blockquote>
          </div>
          <p className="pousse mt-10 max-w-xl leading-relaxed text-fleur-200/80">
            Le socle des Editions, constituées en société coopérative, c’est leur
            indépendance matérielle et intellectuelle.
          </p>
          <p className="pousse mt-6 font-serif text-fleur-200 italic">Jean Delval</p>
        </div>
      </LampeDeLecture>

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
          {/* Chaque ligne est une vitrine : le nom, une ligne de la ligne
              éditoriale, l'éventail de trois couvertures qui s'ouvre au
              survol, et le nombre de titres en folio. */}
          <ol className="mt-10 border-t border-ecorce-200">
            {index.map((c) => (
              <li key={c.slug} className="border-b border-ecorce-200">
                <Link
                  href={`/catalogue/${c.slug}`}
                  className="group -mx-4 flex items-center gap-5 px-4 py-4 transition-colors hover:bg-cerise-50 focus-visible:outline-2 focus-visible:outline-cerise-400 sm:gap-8 sm:py-5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-2xl leading-snug text-ecorce-900 transition-colors group-hover:text-griotte-500 sm:text-[1.75rem]">
                      {c.name}
                    </span>
                    {c.descriptionText && (
                      <span className="mt-1.5 hidden max-w-xl truncate text-sm text-ecorce-500 md:block">
                        {excerpt(c.descriptionText, 110)}
                      </span>
                    )}
                  </span>

                  {c.apercus.length > 0 && (
                    <span
                      className="pile-couvertures relative hidden h-16 w-28 shrink-0 items-center justify-center sm:flex"
                      aria-hidden="true"
                    >
                      {c.apercus.map((b) => (
                        <span
                          key={b.slug}
                          className="absolute h-16 w-11 overflow-hidden rounded-[2px] bg-fleur-100 shadow-md ring-1 ring-ecorce-900/15"
                        >
                          <Image
                            src={b.cover as string}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </span>
                      ))}
                    </span>
                  )}

                  <span className="w-10 shrink-0 text-right font-serif text-base text-ecorce-600 tabular-nums">
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
      <LampeDeLecture className="border-y border-ecorce-800 bg-ecorce-950 text-fleur-100">
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
                  <p className="mt-1 text-xs text-ecorce-300">{b.collectionName}</p>
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
      </LampeDeLecture>

      {/* Ce qu'en dit la presse, au long cours : quatre voix passent
          lentement — mot pour mot, sources à l'appui. */}
      <section
        aria-label="Ce qu’en dit la presse"
        className="rayon-fenetre border-b border-ecorce-200 bg-fleur-100/70 py-10"
      >
        <div className="rayon-defilant rayon-lent flex w-max items-center">
          {[0, 1].map((copie) => (
            <ul
              key={copie}
              aria-hidden={copie === 1 || undefined}
              className={`flex items-center ${copie === 1 ? "rayon-copie" : ""}`}
            >
              {presse.map((e, i) => (
                <li key={`${copie}-${i}`} className="flex max-w-2xl items-baseline gap-5 pr-24">
                  <Cerise
                    filled
                    className="h-3 w-3 shrink-0 translate-y-0.5 text-griotte-500"
                  />
                  <p className="font-serif text-lg leading-snug text-ecorce-800 italic">
                    {excerpt(e.text, 150)}
                    <span className="ml-3 text-sm not-italic tracking-wide text-ecorce-500">
                      — {e.title}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          ))}
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
            className="shrink-0 self-start bg-ecorce-900 px-8 py-4 text-xs font-bold tracking-[0.16em] text-cerise-400 uppercase transition-colors hover:bg-ecorce-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ecorce-900 md:self-auto"
          >
            Envoyer un manuscrit
          </Link>
        </div>
      </section>
    </>
  );
}
