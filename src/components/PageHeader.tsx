import Link from "next/link";
import { Branche, Cerise } from "@/components/Cerisier";

/**
 * Le bandeau des pages intérieures : la frondaison, en plus calme que le
 * premier écran de l'accueil — la branche y est immobile, on est déjà entré.
 * Le titre se pose à chaque navigation (.entree, voir globals.css).
 */
export function PageHeader({
  title,
  eyebrow,
  intro,
  breadcrumb,
}: {
  title: string;
  eyebrow?: string;
  intro?: string;
  breadcrumb?: { label: string; href: string }[];
}) {
  return (
    <div className="relative overflow-hidden border-b border-feuille-700 bg-feuille-900 text-fleur-100">
      <div
        className="pointer-events-none absolute -top-20 -right-16 h-[16rem] w-[34rem] text-feuille-800"
        aria-hidden="true"
      >
        <Branche className="h-full w-full -scale-x-100" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {breadcrumb && (
          <nav aria-label="Fil d’Ariane" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-feuille-300">
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
        {eyebrow && (
          <p className="entree flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.24em] text-feuille-300 uppercase">
            <Cerise filled className="h-3.5 w-3.5 shrink-0 text-griotte-300" />
            {eyebrow}
          </p>
        )}
        <h1 className="titre-verger entree tempo-1 mt-4 text-3xl leading-tight tracking-tight text-balance text-fleur-50 sm:text-4xl">
          {title}
        </h1>
        {intro && (
          <p className="entree tempo-2 mt-4 max-w-2xl text-lg leading-relaxed text-fleur-200">
            {intro}
          </p>
        )}
      </div>
    </div>
  );
}
