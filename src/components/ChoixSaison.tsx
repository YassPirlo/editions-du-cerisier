"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  SAISONS,
  abonneAmbiance,
  choisisSaison,
  lisAmbiance,
  passeEnNoirEtBlanc,
} from "@/lib/ambiance";

/**
 * Le choix de la saison, en haut à droite : une cerise-témoin remplie de
 * la couleur du moment (elle suit les jetons — rose au printemps, or en
 * été, grise en noir et blanc), et un menu dans le style des sous-menus
 * de navigation. Une seule ambiance cochée à la fois : les quatre
 * saisons, ou l'édition noir et blanc posée par-dessus.
 */
export function ChoixSaison() {
  const ambiance = useSyncExternalStore(abonneAmbiance, lisAmbiance, () => "ete" as const);
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    if (!ouvert) return;
    const ferme = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    window.addEventListener("keydown", ferme);
    return () => window.removeEventListener("keydown", ferme);
  }, [ouvert]);

  const coche = (
    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 shrink-0 text-cerise-400" aria-hidden="true">
      <path
        d="m2.5 7.5 3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-expanded={ouvert}
        aria-haspopup="menu"
        aria-label="Choisir la saison du site"
        title="Les saisons du verger"
        className="rounded-md p-2 text-fleur-100 transition-colors hover:bg-ecorce-900 focus-visible:outline-2 focus-visible:outline-cerise-400"
      >
        <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" aria-hidden="true">
          <path
            d="M16.2 3.6c-4 2.5-5.9 5.8-6.6 9.6"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M16.2 3.6c1.7.5 3.3.3 4.4-.5-.3 1.7-1.6 2.9-3.6 3"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8.9" cy="16.7" r="4.3" className="fill-cerise-400" />
        </svg>
      </button>

      {ouvert && (
        <>
          {/* Le voile : un clic à côté referme le menu. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOuvert(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="menu"
            aria-label="Saisons du verger"
            className="absolute top-full right-0 z-50 mt-2 w-60 rounded-xl border border-ecorce-800 bg-ecorce-900 py-1.5 shadow-lg shadow-black/30"
          >
            {SAISONS.map((s) => (
              <button
                key={s.valeur}
                type="button"
                role="menuitemradio"
                aria-checked={ambiance === s.valeur}
                onClick={() => {
                  choisisSaison(s.valeur);
                  setOuvert(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-ecorce-800 focus-visible:bg-ecorce-800 focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 border border-black/25"
                  style={{ backgroundColor: s.pastille }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-fleur-100">{s.nom}</span>
                  <span className="block text-xs text-ecorce-300">{s.sousTitre}</span>
                </span>
                {ambiance === s.valeur && coche}
              </button>
            ))}
            <div className="my-1.5 border-t border-ecorce-800" />
            <button
              type="button"
              role="menuitemradio"
              aria-checked={ambiance === "nb"}
              onClick={() => {
                passeEnNoirEtBlanc();
                setOuvert(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-ecorce-800 focus-visible:bg-ecorce-800 focus-visible:outline-none"
            >
              <span
                aria-hidden="true"
                className="h-3 w-3 shrink-0 border border-black/25"
                style={{ background: "linear-gradient(90deg, #241d13 50%, #fdf8f5 50%)" }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-fleur-100">Noir et blanc</span>
                <span className="block text-xs text-ecorce-300">l’édition imprimée</span>
              </span>
              {ambiance === "nb" && coche}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
