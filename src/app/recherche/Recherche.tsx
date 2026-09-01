"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EntreeRecherche } from "@/components/EntreeRecherche";
import {
  chercheLivres,
  extrait,
  type FicheIndex,
  type Resultat,
} from "@/lib/recherche";

/**
 * La table de recherche : le champ aux suggestions tournantes, puis les
 * trouvailles au fil de la frappe — titre, collection, prix, et l'extrait
 * où le mot cherché a répondu, souligné d'un lavis cerise. Dix résultats
 * d'abord, « Voir plus » pour la suite.
 *
 * L'index (les 253 fiches, texte compris) ne se charge qu'ici, à la
 * demande — le reste du site n'en porte pas le poids.
 */

const SUGGESTIONS = [
  "Un titre, un thème, un mot…",
  "horreur, mémoire, exil…",
  "MARGHERITA une enfance sicilienne",
  "Théâtre-Action",
  "les fautes de frappe sont pardonnées",
];

const EXEMPLES = ["horreur", "mémoire", "usine", "Sicile", "théâtre"];

const PAR_PAGE = 10;

export function Recherche() {
  const [valeur, setValeur] = useState("");
  const [requete, setRequete] = useState("");
  const [index, setIndex] = useState<FicheIndex[] | null>(null);
  const [visibles, setVisibles] = useState(PAR_PAGE);
  const resultatsRef = useRef<HTMLDivElement>(null);

  /* La requête de l'adresse (?q=) et l'index arrivent au montage — la
     lecture à la main de location.search évite à toute la page de
     dépendre du mécanisme de paramètres du cadre, superflu ici. */
  useEffect(() => {
    let vivant = true;
    /* En micro-tâche : poser l'état d'entrée hors du corps synchrone de
       l'effet — la page statique ne connaît pas ?q=, seul le navigateur
       le sait. */
    queueMicrotask(() => {
      if (!vivant) return;
      const q = new URLSearchParams(window.location.search).get("q");
      if (q) {
        setValeur(q);
        setRequete(q);
      }
    });
    import("@/data/recherche-index.json").then((module_) => {
      if (vivant) setIndex(module_.default as FicheIndex[]);
    });
    return () => {
      vivant = false;
    };
  }, []);

  /* La frappe cherche en direct, à un souffle près ; l'adresse suit, pour
     pouvoir partager sa recherche. Un champ vidé — par la dissolution
     d'Entrée ou à la main — laisse la dernière récolte à l'écran : seule
     une nouvelle frappe relance. */
  useEffect(() => {
    if (valeur.trim() === "") return;
    const minuterie = setTimeout(() => {
      setRequete(valeur);
      setVisibles(PAR_PAGE);
      history.replaceState(
        null,
        "",
        `${location.pathname}?q=${encodeURIComponent(valeur.trim())}`,
      );
    }, 90);
    return () => clearTimeout(minuterie);
  }, [valeur]);

  const resultats: Resultat[] = useMemo(
    () => (index && requete.trim() ? chercheLivres(index, requete) : []),
    [index, requete],
  );

  function apresDissolution() {
    /* Le champ vient de se vider en particules ; les trouvailles restent —
       on les rejoint. */
    resultatsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <EntreeRecherche
        valeur={valeur}
        onValeur={setValeur}
        onVanish={apresDissolution}
        placeholders={SUGGESTIONS}
        ariaLabel="Chercher un livre dans le catalogue"
      />

      <div ref={resultatsRef} aria-live="polite" className="scroll-mt-24">
        {requete.trim() === "" && (
          <div className="pousse mt-10">
            <p className="text-sm text-ecorce-600">
              Par exemple :{" "}
              {EXEMPLES.map((mot, i) => (
                <span key={mot}>
                  {i > 0 && " · "}
                  <button
                    type="button"
                    onClick={() => setValeur(mot)}
                    className="font-serif text-ecorce-700 italic underline decoration-cerise-400 decoration-2 underline-offset-4 transition-colors hover:text-griotte-500"
                  >
                    {mot}
                  </button>
                </span>
              ))}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ecorce-500">
              La recherche fouille les titres, les collections et le texte des
              présentations — un mot lu dans un livre suffit à le retrouver.
            </p>
          </div>
        )}

        {requete.trim() !== "" && index === null && (
          <p className="mt-10 font-serif text-ecorce-500 italic">
            Le catalogue s’ouvre…
          </p>
        )}

        {requete.trim() !== "" && index !== null && resultats.length === 0 && (
          <div className="mt-10">
            <p className="font-serif text-lg text-ecorce-700 italic">
              Rien ne répond à « {requete.trim()} ».
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ecorce-500">
              Essayez un mot plus simple, un bout de titre, ou un thème — les
              fautes de frappe sont pardonnées, mais un mot très rare peut
              n’apparaître dans aucune présentation.
            </p>
          </div>
        )}

        {resultats.length > 0 && (
          <>
            <p className="mt-10 text-sm text-ecorce-500 tabular-nums">
              {resultats.length}{" "}
              {resultats.length > 1 ? "livres répondent" : "livre répond"} à «{" "}
              {requete.trim()} »
            </p>
            <ul className="mt-4 border-t border-ecorce-200">
              {resultats.slice(0, visibles).map(({ fiche, jetonTexte }) => {
                const passage = extrait(fiche.texte, jetonTexte);
                return (
                  <li key={`${fiche.collection}/${fiche.slug}`} className="border-b border-ecorce-200">
                    <Link
                      href={`/catalogue/${fiche.collection}/${fiche.slug}`}
                      className="group flex gap-4 py-4 transition-colors hover:bg-cerise-50 focus-visible:outline-2 focus-visible:outline-cerise-400 sm:gap-5"
                    >
                      <span className="relative block h-20 w-14 shrink-0 overflow-hidden bg-ecorce-100">
                        {fiche.cover ? (
                          <Image
                            src={fiche.cover}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-[0.5rem] tracking-widest text-ecorce-400 uppercase">
                            s.c.
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-serif text-[1.02rem] leading-snug font-semibold text-ecorce-900 transition-colors group-hover:text-griotte-500">
                          {fiche.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-ecorce-500 tabular-nums">
                          {fiche.collectionName}
                          {fiche.pages && <span> · {fiche.pages} p.</span>}
                          {fiche.price && <span> · {fiche.price}</span>}
                        </span>
                        {passage && (
                          <span className="mt-1.5 block text-[0.83rem] leading-relaxed text-ecorce-600">
                            {passage.avant}
                            <mark className="bg-cerise-200/70 px-0.5 text-ecorce-900">
                              {passage.trouve}
                            </mark>
                            {passage.apres}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {visibles < resultats.length && (
              <button
                type="button"
                onClick={() => setVisibles((v) => v + PAR_PAGE)}
                className="mt-8 block w-full border border-ecorce-300 bg-white px-6 py-3.5 text-center text-xs font-bold tracking-[0.16em] text-ecorce-800 uppercase transition-colors hover:border-cerise-400 hover:bg-cerise-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cerise-400"
              >
                Voir plus ({resultats.length - visibles} autres)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
