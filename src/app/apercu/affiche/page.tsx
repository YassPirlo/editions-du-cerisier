import Image from "next/image";
import Link from "next/link";
import { Branche, Cerise } from "@/components/Cerisier";
import { books, collections, pages } from "@/lib/content";

const index = collections
  .map((c) => ({ ...c, count: books.filter((b) => b.collection === c.slug).length }))
  .filter((c) => c.count > 0);

const couvertures = pages.nouveautes
  .slice(0, 8)
  .map((n) => books.find((b) => b.cover === n.images[0]))
  .filter((b) => b !== undefined);

export default function VarianteAffiche() {
  return (
    <div className="bg-white text-ecorce-900">
      {/* Aplat jaune, composition décalée.
          La branche traverse tout le champ et sort par les deux bords : on n'en
          voit qu'un fragment, comme depuis une fenêtre. Elle passe DERRIÈRE le
          titre, elle ne l'illustre pas. */}
      <section className="relative overflow-hidden bg-cerise-400">
        {/* Elle entre par le bord droit, au-dessus du titre, et reste franche :
            un aplat d'affiche ne supporte pas le filet timide.
            Sur mobile il n'y a pas de place à droite du titre : elle passe en
            bas, débordant largement du cadre pour rester coupée. */}
        {/* La dérive est portée par un conteneur : sur la version bureau, le
            SVG utilise déjà son `transform` pour le miroir. */}
        <div className="branche-derive pointer-events-none absolute bottom-0 -left-8 h-[10rem] w-[34rem] sm:hidden">
          <Branche className="h-full w-full text-ecorce-900" />
        </div>
        {/* Décalée hors cadre à droite : la dérive la ramène vers le bord au
            lieu de découvrir le fond derrière elle. */}
        <div className="branche-derive pointer-events-none absolute -top-10 -right-16 hidden h-[19rem] w-[38rem] sm:block lg:h-[22rem] lg:w-[46rem]">
          <Branche className="h-full w-full -scale-x-100 text-ecorce-900" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-44 sm:px-6 sm:py-24">
          <p className="text-[0.7rem] font-bold tracking-[0.24em] text-ecorce-900 uppercase">
            Société coopérative d’édition · Cuesmes · Belgique · Depuis 1985
          </p>
          <h1 className="mt-8 text-[3.25rem] leading-[0.86] font-black tracking-[-0.03em] text-ecorce-900 uppercase sm:text-[6rem] lg:text-[8rem]">
            Éditions
            <br />
            du Cerisier
          </h1>
          <div className="mt-14 grid gap-8 sm:grid-cols-12">
            <p className="text-lg leading-snug font-semibold text-ecorce-900 sm:col-span-6 sm:col-start-6 sm:text-xl">
              Petites, mais obstinées, les Éditions du Cerisier cherchent, avant
              tout, à rendre publics les livres qui relatent, imaginent, témoignent
              des peuples, de leurs cultures, de leurs luttes, de leurs libertés…
            </p>
            <div className="sm:col-span-6 sm:col-start-6">
              <Link
                href="/catalogue"
                className="inline-block bg-ecorce-900 px-8 py-4 text-xs font-bold tracking-[0.18em] text-cerise-400 uppercase transition-colors hover:bg-white hover:text-ecorce-900"
              >
                Découvrir les {books.length} titres
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bandeau noir : citation reprise mot pour mot du site */}
      <section className="bg-ecorce-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <blockquote className="text-4xl leading-[0.95] font-black tracking-tight uppercase sm:text-6xl lg:text-7xl">
            Ni dieu,
            <br />
            ni maître.
          </blockquote>
          {/* Exergue : le texte complet est repris tel quel, la citation ci-dessus
              le répète comme dans un imprimé, elle ne le remplace pas. */}
          <p className="mt-10 max-w-xl leading-relaxed text-neutral-300">
            Le socle des Editions, constituées en société coopérative, c’est leur
            indépendance matérielle et intellectuelle. Ni dieu, ni maître. Juste un
            grand réservoir d’enthousiasme, d’esprit critique et de connivence avec
            la révolution permanente.
          </p>
          <p className="mt-5 text-xs font-bold tracking-[0.2em] text-cerise-400 uppercase">
            Jean Delval
          </p>
        </div>
      </section>

      {/* Collections : lignes pleine largeur qui s'inversent au survol */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <h2 className="text-xs font-bold tracking-[0.24em] text-ecorce-900 uppercase">
          Les collections
        </h2>
        <ol className="mt-10 border-t-2 border-ecorce-900">
          {index.map((c, i) => (
            <li key={c.slug} className="border-b border-ecorce-200">
              <Link
                href={`/catalogue/${c.slug}`}
                className="group flex items-center gap-5 px-2 py-6 transition-colors hover:bg-ecorce-900 sm:gap-10 sm:px-4"
              >
                <span className="w-8 shrink-0 text-xs font-bold text-ecorce-400 tabular-nums group-hover:text-cerise-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-xl leading-none font-black tracking-tight text-ecorce-900 uppercase group-hover:text-white sm:text-3xl">
                  {c.name}
                </span>
                {/* Le fruit mûrit au survol : cercle ouvert, puis plein. */}
                <Cerise className="h-5 w-5 shrink-0 text-ecorce-300 transition-colors group-hover:hidden" />
                <Cerise
                  filled
                  className="hidden h-5 w-5 shrink-0 text-griotte-400 group-hover:block"
                />
                <span className="w-6 shrink-0 text-right text-sm font-bold text-ecorce-400 tabular-nums group-hover:text-cerise-400">
                  {c.count}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Couvertures serrées, calées sur le noir */}
      <section className="bg-ecorce-900">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <h2 className="text-xs font-bold tracking-[0.24em] text-cerise-400 uppercase">
            Vient de paraître
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-px bg-neutral-700 sm:grid-cols-4">
            {couvertures.map((b) => (
              <li key={`${b.collection}/${b.slug}`} className="bg-ecorce-900">
                <Link
                  href={`/catalogue/${b.collection}/${b.slug}`}
                  className="group block"
                >
                  {b.cover && (
                    <div className="relative aspect-3/4 w-full bg-white p-3">
                      <Image
                        src={b.cover}
                        alt={`Couverture de « ${b.title} »`}
                        fill
                        sizes="(min-width: 640px) 25vw, 50vw"
                        className="object-contain p-3"
                      />
                    </div>
                  )}
                  <p className="px-3 py-4 text-xs leading-snug font-bold text-white uppercase group-hover:text-cerise-400">
                    {b.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Appel manuscrit */}
      <section className="bg-cerise-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-end md:justify-between">
          <h2 className="text-3xl leading-[0.95] font-black tracking-tight text-ecorce-900 uppercase sm:text-5xl">
            Vous écrivez ?
            <br />
            Envoyez-nous ça.
          </h2>
          <Link
            href="/envoyer-un-manuscrit"
            className="shrink-0 self-start bg-ecorce-900 px-8 py-4 text-xs font-bold tracking-[0.18em] text-cerise-400 uppercase transition-colors hover:bg-white hover:text-ecorce-900 md:self-auto"
          >
            Envoyer un manuscrit
          </Link>
        </div>
      </section>
    </div>
  );
}
