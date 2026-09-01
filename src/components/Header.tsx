"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/nav";
import { CherryLogo } from "./CherryLogo";
import { ChoixSaison } from "./ChoixSaison";
import { PanierLien } from "./PanierLien";

/**
 * L'en-tête est la frondaison : le vert profond enveloppe le site, le papier
 * reste aux pages. Sur mobile, le menu occupe tout l'écran et ses entrées se
 * posent l'une après l'autre (@starting-style, voir globals.css) — c'est le
 * seul moment où la navigation a le droit d'être spectaculaire.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Une seule entrée active à la fois : la correspondance la plus longue
     l'emporte (« Nouveautés » plutôt que « À la une » sur sa propre page). */
  const actif = nav
    .map((item) => item.href)
    .filter((href) => (href === "/" ? pathname === "/" : pathname.startsWith(href)))
    .sort((a, b) => b.length - a.length)[0];
  const isActive = (href: string) => href === actif;

  return (
    <header className="deja-nuit sticky top-0 z-50 border-b border-ecorce-800 bg-ecorce-950/95 text-fleur-100 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cerise-400"
        >
          <CherryLogo className="h-9 w-9 text-fleur-300" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-semibold tracking-tight text-fleur-50">
              Éditions du Cerisier
            </span>
            <span className="mt-0.5 text-[0.6875rem] tracking-[0.14em] text-ecorce-300 uppercase">
              Cuesmes · Belgique
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-cerise-400 ${
                  isActive(item.href)
                    ? "text-fleur-50"
                    : "text-fleur-300 hover:text-fleur-50"
                }`}
              >
                {item.label}
                {item.children && (
                  <svg
                    viewBox="0 0 12 12"
                    className="h-2.5 w-2.5 transition-transform group-hover:rotate-180"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 4.5 6 8.5 10 4.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </Link>
              <span
                className={`absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-cerise-400 transition-transform duration-200 ${
                  isActive(item.href) ? "scale-x-100" : "scale-x-0"
                }`}
              />
              {item.children && (
                <div className="invisible absolute top-full left-0 min-w-56 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="overflow-hidden rounded-xl border border-ecorce-800 bg-ecorce-900 py-1.5 shadow-lg shadow-black/30">
                    {item.children.map((child) => (
                      <li key={child.href + child.label}>
                        <Link
                          href={child.href}
                          className="block px-4 py-2 text-sm text-fleur-200 transition-colors hover:bg-ecorce-800 hover:text-fleur-50 focus-visible:bg-ecorce-800 focus-visible:outline-none"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-0.5">
          <ChoixSaison />
          <Link
            href="/recherche"
            aria-label="Chercher un livre"
            className="rounded-md p-2 text-fleur-100 transition-colors hover:bg-ecorce-900 focus-visible:outline-2 focus-visible:outline-cerise-400"
          >
            <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" fill="none" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="m15.5 15.5 4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </Link>
          <PanierLien />
          <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="-mr-1 rounded-md p-2 text-fleur-100 transition-colors hover:bg-ecorce-900 focus-visible:outline-2 focus-visible:outline-cerise-400 lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-ecorce-800 bg-ecorce-950 lg:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            {nav.map((item, i) => (
              <li
                key={item.href}
                className="entree border-b border-ecorce-800 last:border-0"
                style={{ "--tempo": `${i * 0.06}s` } as React.CSSProperties}
              >
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={`flex-1 py-4 font-serif text-2xl ${
                      isActive(item.href) ? "text-cerise-400" : "text-fleur-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((v) => (v === item.href ? null : item.href))
                      }
                      aria-expanded={expanded === item.href}
                      aria-label={`Afficher les sous-rubriques de ${item.label}`}
                      className="p-3 text-ecorce-300"
                    >
                      <svg
                        viewBox="0 0 12 12"
                        className={`h-3.5 w-3.5 transition-transform ${
                          expanded === item.href ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <path
                          d="M2 4.5 6 8.5 10 4.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {item.children && expanded === item.href && (
                  <ul className="pb-3 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href + child.label}>
                        <Link
                          href={child.href}
                          className="block border-l-2 border-cerise-400/70 py-2.5 pl-4 text-[0.9375rem] text-fleur-300 hover:text-fleur-50"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
