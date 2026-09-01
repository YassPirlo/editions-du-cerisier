"use client";

import { useSyncExternalStore } from "react";
import { abonneAmbiance, basculeNuit, lisNuit } from "@/lib/ambiance";

/**
 * La nuit, version pied de page : la bascule rapide — un geste pour
 * éteindre le jour, le même pour le rallumer, sans quitter la saison en
 * cours. Le grand choix vit dans le menu de l'en-tête ; les deux parlent
 * au même magasin (lib/ambiance.ts) et restent d'accord.
 */
export function BasculeNuit() {
  const nuit = useSyncExternalStore(abonneAmbiance, lisNuit, () => false);

  return (
    <button
      type="button"
      onClick={basculeNuit}
      aria-pressed={nuit}
      className="inline-flex items-center gap-2 transition-colors hover:text-fleur-100"
    >
      {/* La pastille : l'or du jour, ou la lampe allumée dans l'encre. */}
      <span
        aria-hidden="true"
        className={`inline-block h-2.5 w-2.5 border border-current ${
          nuit
            ? "[background:radial-gradient(circle_at_32%_32%,#ffc107_0_26%,transparent_30%)]"
            : "bg-cerise-400"
        }`}
      />
      {nuit ? "Rallumer le jour" : "Passer à la nuit"}
    </button>
  );
}
