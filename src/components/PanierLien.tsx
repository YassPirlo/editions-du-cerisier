"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { abonnePanier, lisPanier, lisPanierServeur } from "@/lib/panier";

/**
 * Le panier dans l'en-tête : un panier d'osier au trait, et le nombre de
 * livres cueillis en pastille cerise. Toujours visible — un panier qu'on ne
 * retrouve pas est un panier qu'on abandonne.
 */
export function PanierLien() {
  const articles = useSyncExternalStore(abonnePanier, lisPanier, lisPanierServeur);
  const nombre = articles.reduce((s, a) => s + a.quantite, 0);

  return (
    <Link
      href="/panier"
      aria-label={`Panier${nombre ? ` — ${nombre} ${nombre > 1 ? "livres" : "livre"}` : ""}`}
      className="relative -mr-1 rounded-md p-2 text-fleur-100 transition-colors hover:bg-ecorce-900 focus-visible:outline-2 focus-visible:outline-cerise-400"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M4.5 9.5h15l-1.6 9a2 2 0 0 1-2 1.6H8.1a2 2 0 0 1-2-1.6l-1.6-9Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 9.5 12 4l3.5 5.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.3 13v3.5M12 13v3.5M14.7 13v3.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      {nombre > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-cerise-400 px-1 text-[0.7rem] font-bold text-ecorce-900 tabular-nums">
          {nombre > 99 ? "99+" : nombre}
        </span>
      )}
    </Link>
  );
}
