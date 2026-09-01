"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EntreeRecherche } from "./EntreeRecherche";

/**
 * La barre de recherche du premier écran : la même entrée qu'à la page
 * /recherche — suggestions tournantes, dissolution d'encre à la
 * validation — mais ici elle ne cherche pas sur place : elle emmène à la
 * table de recherche, requête en poche. L'accueil reste léger, l'index
 * ne se charge que là-bas.
 */

const SUGGESTIONS = [
  "Chercher un titre, un thème, un mot…",
  "horreur, mémoire, exil…",
  "MARGHERITA une enfance sicilienne",
  "Théâtre-Action",
  "les fautes de frappe sont pardonnées",
];

export function RechercheAccueil() {
  const [valeur, setValeur] = useState("");
  const routeur = useRouter();

  return (
    <EntreeRecherche
      valeur={valeur}
      onValeur={setValeur}
      onVanish={(requete) =>
        routeur.push(
          requete.trim()
            ? `/recherche?q=${encodeURIComponent(requete.trim())}`
            : "/recherche",
        )
      }
      placeholders={SUGGESTIONS}
      ariaLabel="Chercher un livre dans le catalogue"
    />
  );
}
