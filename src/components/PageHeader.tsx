import Link from "next/link";
import { Branche } from "@/components/Cerisier";

/**
 * Le bandeau des pages intérieures : la frondaison, en plus calme que le
 * premier écran de l'accueil — la branche y est immobile, on est déjà entré.
 * Le titre se pose à chaque navigation (.entree, voir globals.css). Pas
 * d'étiquette au-dessus du titre : le fil d'Ariane situe, le titre nomme.
 */
export function PageHeader({
  title,
  intro,
  breadcrumb,
}: {
  title: string;
  intro?: string;
  breadcrumb?: { label: string; href: string }[];
}) {
  return (
    <div className="relative overflow-hidden border-b border-ecorce-800 bg-ecorce-950 text-fleur-100">
      {/* La branche se trace à l'or sur l'encre : le bandeau historique de
          la maison, or sur brun, devenu geste. */}
      <div
        className="pointer-events-none absolute -top-20 -right-16 h-[16rem] w-[34rem] text-cerise-600/70"
        aria-hidden="true"
      >
        {/* La branche se dessine à chaque arrivée sur la page (.branche-trace). */}
        <Branche className="branche-trace h-full w-full -scale-x-100" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {breadcrumb && (
          <nav aria-label="Fil d’Ariane" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ecorce-300">
              {breadcrumb.map((c) => (
                <li key={c.href} className="flex items-center gap-1.5">
                  <Link href={c.href} className="transition-colors hover:text-fleur-100">
                    {c.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </li>
              ))}
              <li aria-current="page" className="text-fleur-200">
                {title}
              </li>
            </ol>
          </nav>
        )}
        <h1 className="titre-verger entree tempo-1 text-4xl leading-tight tracking-tight text-balance text-fleur-50 sm:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="entree tempo-2 mt-5 max-w-2xl font-serif text-lg leading-relaxed text-fleur-200 italic">
            {intro}
          </p>
        )}
      </div>
    </div>
  );
}
