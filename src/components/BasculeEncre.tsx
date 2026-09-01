"use client";

import { useSyncExternalStore } from "react";
import { abonneAmbiance, basculeNoirEtBlanc, lisEncre } from "@/lib/ambiance";

/**
 * L'édition noir et blanc, version pied de page : la bascule rapide —
 * un geste pour passer au gris, le même pour rendre les couleurs de la
 * saison en cours. Le grand choix (les quatre saisons) vit dans le menu
 * de l'en-tête ; les deux parlent au même magasin (lib/ambiance.ts) et
 * restent d'accord.
 */
export function BasculeEncre() {
  const nb = useSyncExternalStore(abonneAmbiance, lisEncre, () => false);

  return (
    <button
      type="button"
      onClick={basculeNoirEtBlanc}
      aria-pressed={nb}
      className="inline-flex items-center gap-2 transition-colors hover:text-fleur-100"
    >
      {/* Une pastille mi-encre mi-papier : l'état d'un coup d'œil. */}
      <span
        aria-hidden="true"
        className={`inline-block h-2.5 w-2.5 border border-current ${
          nb
            ? "[background:linear-gradient(90deg,currentColor_50%,transparent_50%)]"
            : "bg-cerise-400"
        }`}
      />
      {nb ? "Retrouver les couleurs" : "Lire en noir et blanc"}
    </button>
  );
}
