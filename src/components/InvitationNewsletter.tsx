"use client";

import { useEffect, useRef } from "react";
import { CherryLogo } from "@/components/CherryLogo";
import {
  CLE_INFOLETTRE,
  FormulaireInfolettre,
} from "@/components/FormulaireInfolettre";

/* Ne se montre qu'une fois par visiteur : la clé passe à « vue » dès
   l'ouverture, puis à « inscrit » après envoi — dans les deux cas, le
   pop-up ne reviendra pas. Celui qui l'a fermé retrouve le même formulaire
   dans le pied de page, sur toutes les pages. */
const DELAI_MS = 10_000;

export function InvitationNewsletter() {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (localStorage.getItem(CLE_INFOLETTRE)) return;
    const timer = setTimeout(() => {
      localStorage.setItem(CLE_INFOLETTRE, "vue");
      ref.current?.showModal();
    }, DELAI_MS);
    return () => clearTimeout(timer);
  }, []);

  const ferme = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-labelledby="titre-newsletter"
      onClick={(e) => {
        if (e.target === ref.current) ferme();
      }}
      className="m-auto w-[calc(100%-3rem)] max-w-md border border-ecorce-300 bg-fleur-50 p-0 text-ecorce-900 shadow-2xl backdrop:bg-ecorce-900/60 motion-safe:[&[open]]:animate-[apparition_0.35s_ease-out]"
    >
      <div className="relative px-8 pt-10 pb-8 text-center">
        <button
          type="button"
          onClick={ferme}
          aria-label="Fermer"
          className="absolute top-3 right-3 flex size-9 items-center justify-center text-2xl leading-none text-ecorce-500 transition-colors hover:text-griotte-500 focus-visible:outline-2 focus-visible:outline-cerise-400"
        >
          ×
        </button>

        <CherryLogo className="mx-auto size-16" />

        <h2
          id="titre-newsletter"
          className="titre-verger mt-4 text-2xl text-ecorce-900 sm:text-3xl"
        >
          La lettre du Cerisier
        </h2>

        <FormulaireInfolettre
          idChamp="email-newsletter"
          intro={
            <p className="mt-4 font-serif leading-relaxed text-ecorce-700">
              Recevez nos nouvelles parutions par courriel — quelques lettres
              par an, rien d&rsquo;autre.
            </p>
          }
        />
      </div>
    </dialog>
  );
}
