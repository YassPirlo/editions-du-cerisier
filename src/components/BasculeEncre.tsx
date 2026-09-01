"use client";

import { useSyncExternalStore } from "react";

/**
 * L'édition noir et blanc : un geste au pied de page et tout le site
 * passe en nuances d'encre — jetons de couleur remappés vers leurs gris
 * de luminance, images et canvas au grain argentique (globals.css,
 * `html[data-encre="nb"]`). Le choix est retenu dans le navigateur et
 * rétabli avant le premier rendu par le petit script du layout, pour que
 * la page n'arrive jamais en couleurs avant de se raviser.
 */

const CLE = "cerisier-encre";
const EVENEMENT = "cerisier-encre";

function lisMode(): boolean {
  return document.documentElement.dataset.encre === "nb";
}

function abonne(rappel: () => void) {
  window.addEventListener(EVENEMENT, rappel);
  window.addEventListener("storage", rappel);
  return () => {
    window.removeEventListener(EVENEMENT, rappel);
    window.removeEventListener("storage", rappel);
  };
}

function bascule() {
  const racine = document.documentElement;
  const versNb = racine.dataset.encre !== "nb";
  if (versNb) racine.dataset.encre = "nb";
  else delete racine.dataset.encre;
  try {
    if (versNb) localStorage.setItem(CLE, "nb");
    else localStorage.removeItem(CLE);
  } catch {
    /* Navigation privée : le mode vaut pour la page, sans mémoire. */
  }
  window.dispatchEvent(new Event(EVENEMENT));
}

export function BasculeEncre() {
  const nb = useSyncExternalStore(abonne, lisMode, () => false);

  return (
    <button
      type="button"
      onClick={bascule}
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
