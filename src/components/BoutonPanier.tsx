"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Cerise } from "./Cerisier";
import {
  abonnePanier,
  ajouteAuPanier,
  basculeAuPanier,
  lisPanier,
  lisPanierServeur,
  type ArticlePanier,
} from "@/lib/panier";

type Livre = Omit<ArticlePanier, "quantite">;

/**
 * Les deux gestes d'ajout au panier. La cerise des vignettes (on cueille,
 * on repose) et le bouton de la fiche (chaque pression ajoute un
 * exemplaire). Tous deux lisent le même panier et s'accordent en direct
 * avec le compteur de l'en-tête.
 */

export function CerisePanier({ livre }: { livre: Livre }) {
  const articles = useSyncExternalStore(abonnePanier, lisPanier, lisPanierServeur);
  const cueillie = articles.some(
    (a) => a.collection === livre.collection && a.slug === livre.slug,
  );

  return (
    <button
      type="button"
      onClick={() => basculeAuPanier(livre)}
      aria-pressed={cueillie}
      title={cueillie ? "Retirer du panier" : "Ajouter au panier"}
      aria-label={
        cueillie
          ? `Retirer « ${livre.titre} » du panier`
          : `Ajouter « ${livre.titre} » au panier`
      }
      className={`pression absolute -top-1 -right-1 z-10 flex h-9 w-9 items-center justify-center rounded-full border shadow-md transition-[opacity,background-color,border-color,color] focus-visible:outline-2 focus-visible:outline-cerise-400 ${
        cueillie
          ? "border-griotte-400/40 bg-fleur-50 opacity-100"
          : "border-ecorce-200 bg-fleur-50/95 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-lg:opacity-100"
      }`}
    >
      <Cerise
        filled={cueillie}
        className={`h-4.5 w-4.5 ${cueillie ? "text-griotte-500" : "text-ecorce-500"}`}
      />
    </button>
  );
}

export function AjoutPanierFiche({ livre }: { livre: Livre }) {
  const articles = useSyncExternalStore(abonnePanier, lisPanier, lisPanierServeur);
  const present = articles.find(
    (a) => a.collection === livre.collection && a.slug === livre.slug,
  );

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => ajouteAuPanier(livre)}
        className="pression block w-full border border-ecorce-300 bg-white px-5 py-3 text-center text-xs font-bold tracking-[0.16em] text-ecorce-800 uppercase transition-colors hover:border-cerise-400 hover:bg-cerise-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cerise-400"
      >
        {present ? "En ajouter un exemplaire" : "Ajouter au panier"}
      </button>
      <p aria-live="polite" className="mt-2 text-center text-xs text-ecorce-500">
        {present ? (
          <>
            {present.quantite} {present.quantite > 1 ? "exemplaires" : "exemplaire"} dans{" "}
            <Link
              href="/panier"
              className="underline decoration-cerise-400 decoration-2 underline-offset-2 hover:text-griotte-500"
            >
              le panier
            </Link>
          </>
        ) : (
          "Se garde dans votre navigateur, sans compte."
        )}
      </p>
    </div>
  );
}
