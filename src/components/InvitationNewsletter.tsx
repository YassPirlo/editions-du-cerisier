"use client";

import { useEffect, useRef, useState } from "react";
import { CherryLogo } from "@/components/CherryLogo";

/* Ne se montre qu'une fois par visiteur : la clé passe à « vue » dès
   l'ouverture, puis à « inscrit » après envoi — dans les deux cas, le
   pop-up ne reviendra pas. */
const CLE = "cerisier-newsletter";
const DELAI_MS = 10_000;

export function InvitationNewsletter() {
  const ref = useRef<HTMLDialogElement>(null);
  const [etat, setEtat] = useState<"repos" | "envoi" | "merci" | "erreur">("repos");

  useEffect(() => {
    if (localStorage.getItem(CLE)) return;
    const timer = setTimeout(() => {
      localStorage.setItem(CLE, "vue");
      ref.current?.showModal();
    }, DELAI_MS);
    return () => clearTimeout(timer);
  }, []);

  const ferme = () => ref.current?.close();

  async function envoie(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEtat("envoi");
    try {
      const reponse = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(
          new FormData(e.currentTarget) as unknown as Record<string, string>,
        ).toString(),
      });
      if (!reponse.ok) throw new Error(String(reponse.status));
      localStorage.setItem(CLE, "inscrit");
      setEtat("merci");
    } catch {
      setEtat("erreur");
    }
  }

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

        {etat === "merci" ? (
          <p className="mt-4 font-serif text-ecorce-700">
            Merci ! Vous recevrez nos prochaines parutions.
          </p>
        ) : (
          <>
            <p className="mt-4 font-serif leading-relaxed text-ecorce-700">
              Recevez nos nouvelles parutions par courriel — quelques lettres
              par an, rien d&rsquo;autre.
            </p>

            <form onSubmit={envoie} className="mt-6">
              <input type="hidden" name="form-name" value="newsletter" />
              <p className="hidden">
                <label>
                  Ne pas remplir : <input name="bot-field" />
                </label>
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="email-newsletter" className="sr-only">
                  Adresse de courriel
                </label>
                <input
                  id="email-newsletter"
                  type="email"
                  name="email"
                  required
                  placeholder="votre@adresse.be"
                  className="min-w-0 flex-1 border border-ecorce-300 bg-white px-4 py-3 font-serif text-ecorce-900 placeholder:text-ecorce-400 focus-visible:outline-2 focus-visible:outline-cerise-400"
                />
                <button
                  type="submit"
                  disabled={etat === "envoi"}
                  className="bg-cerise-400 px-6 py-3 text-xs font-bold tracking-[0.16em] text-ecorce-900 uppercase transition-colors hover:bg-cerise-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cerise-400 disabled:opacity-60"
                >
                  {etat === "envoi" ? "Envoi…" : "Je m’inscris"}
                </button>
              </div>
              {etat === "erreur" && (
                <p className="mt-3 text-sm text-griotte-500" role="alert">
                  L&rsquo;inscription n&rsquo;a pas abouti — réessayez, ou
                  écrivez-nous via la page Contact.
                </p>
              )}
              <p className="mt-4 text-xs leading-relaxed text-ecorce-500">
                Votre adresse ne sert qu&rsquo;à ces envois ; vous pourrez vous
                désinscrire à tout moment.
              </p>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
