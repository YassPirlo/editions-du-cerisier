"use client";

import { useState } from "react";

/* La clé est partagée avec le pop-up (InvitationNewsletter) : qui s'inscrit
   depuis le pied de page ne doit plus voir l'invitation s'ouvrir d'elle-même.
   Une seule clé, deux portes d'entrée. */
export const CLE_INFOLETTRE = "cerisier-newsletter";

type Etat = "repos" | "envoi" | "merci" | "erreur";

/**
 * Le formulaire d'inscription à la lettre, seul endroit du site qui parle à
 * /api/infolettre. Il vit à deux places — le pop-up et le pied de page — et
 * ne change que d'habit : « sombre » pour le pied de page, qui est en fond
 * écorce, clair partout ailleurs.
 *
 * Le pop-up ne se montrant qu'une fois par visiteur, le pied de page est la
 * seule entrée qui reste ouverte en permanence.
 */
export function FormulaireInfolettre({
  idChamp,
  intro,
  sombre = false,
}: {
  /* Deux formulaires peuvent coexister sur la même page : leurs champs ne
     peuvent pas porter le même identifiant, sinon les libellés se trompent
     de cible. */
  idChamp: string;
  intro?: React.ReactNode;
  sombre?: boolean;
}) {
  const [etat, setEtat] = useState<Etat>("repos");

  async function envoie(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEtat("envoi");
    try {
      /* L'adresse part vers la liste Brevo de la maison, via notre route
         serveur (la clé d'API n'a rien à faire dans le navigateur) ; le
         champ-piège « bot-field » voyage avec, sous le nom que la route
         attend. */
      const donnees = new FormData(e.currentTarget);
      const reponse = await fetch("/api/infolettre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courriel: donnees.get("email"),
          verger: donnees.get("bot-field") ?? "",
        }),
      });
      if (!reponse.ok) throw new Error(String(reponse.status));
      try {
        localStorage.setItem(CLE_INFOLETTRE, "inscrit");
      } catch {
        /* navigation privée : tant pis pour la mémoire, l'inscription est
           passée, c'est le principal */
      }
      setEtat("merci");
    } catch {
      setEtat("erreur");
    }
  }

  if (etat === "merci") {
    return (
      <p
        className={`mt-4 font-serif ${sombre ? "text-fleur-200" : "text-ecorce-700"}`}
      >
        Merci ! Vous recevrez nos prochaines parutions.
      </p>
    );
  }

  return (
    <>
      {intro}

      <form onSubmit={envoie} className="mt-6">
        <p className="hidden">
          <label>
            Ne pas remplir : <input name="bot-field" />
          </label>
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor={idChamp} className="sr-only">
            Adresse de courriel
          </label>
          <input
            id={idChamp}
            type="email"
            name="email"
            required
            placeholder="votre@adresse.be"
            className={`min-w-0 flex-1 border px-4 py-3 font-serif focus-visible:outline-2 focus-visible:outline-cerise-400 ${
              sombre
                ? "border-ecorce-700 bg-ecorce-900 text-fleur-100 placeholder:text-ecorce-400"
                : "border-ecorce-300 bg-white text-ecorce-900 placeholder:text-ecorce-400"
            }`}
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
          /* Sur fond sombre, griotte-500 s'éteint : on monte d'un cran. */
          <p
            className={`mt-3 text-sm ${sombre ? "text-griotte-300" : "text-griotte-500"}`}
            role="alert"
          >
            L&rsquo;inscription n&rsquo;a pas abouti — réessayez, ou
            écrivez-nous via la page Contact.
          </p>
        )}
        <p
          className={`mt-4 text-xs leading-relaxed ${sombre ? "text-ecorce-300" : "text-ecorce-500"}`}
        >
          Votre adresse ne sert qu&rsquo;à ces envois ; vous pourrez vous
          désinscrire à tout moment.
        </p>
      </form>
    </>
  );
}
