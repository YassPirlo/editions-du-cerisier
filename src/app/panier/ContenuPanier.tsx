"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cerise } from "@/components/Cerisier";
import {
  abonnePanier,
  brouillonGmail,
  brouillonMailto,
  composeCommande,
  COURRIEL_COMMANDES,
  enEuros,
  lisPanier,
  lisPanierServeur,
  poseQuantite,
  prixEnNombre,
  retireDuPanier,
  videLePanier,
} from "@/lib/panier";

/**
 * La table de commande : chaque livre sur sa ligne — quantité réglable,
 * conduite pointillée, prix — puis le total indicatif et le grand geste :
 * « Commander par courriel », qui ouvre la messagerie avec la lettre toute
 * rédigée. « Copier la commande » fait la même lettre au presse-papiers,
 * pour ceux dont la messagerie vit dans un onglet.
 */
export function ContenuPanier() {
  const articles = useSyncExternalStore(abonnePanier, lisPanier, lisPanierServeur);
  const [copie, setCopie] = useState(false);
  /* La lettre suit le panier tant qu'on n'y a pas touché ; dès qu'on
     l'édite (son nom, un mot en plus), c'est la version du lecteur qui
     fait foi — un lien permet de la réécrire depuis le panier. */
  const [lettrePerso, setLettrePerso] = useState<string | null>(null);

  if (articles.length === 0) {
    return (
      <div className="pousse text-center">
        <Cerise className="mx-auto h-7 w-7 text-ecorce-300" />
        <p className="mt-5 font-serif text-lg text-ecorce-700 italic">
          Le panier est vide — la table n’attend que vos cueillettes.
        </p>
        <p className="mt-4 text-sm text-ecorce-500">
          La cerise posée sur chaque couverture met le livre de côté ; le
          panier se garde dans votre navigateur, sans compte.
        </p>
        <Link
          href="/catalogue"
          className="mt-8 inline-block bg-cerise-400 px-7 py-3.5 text-xs font-bold tracking-[0.16em] text-ecorce-900 uppercase transition-colors hover:bg-cerise-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ecorce-900"
        >
          Parcourir le catalogue
        </Link>
      </div>
    );
  }

  let total = 0;
  let chiffres = 0;
  for (const a of articles) {
    const p = prixEnNombre(a.prix);
    if (p !== null) {
      total += p * a.quantite;
      chiffres++;
    }
  }
  const nombre = articles.reduce((s, a) => s + a.quantite, 0);

  const { sujet, corps: corpsParDefaut } = composeCommande(articles);
  const lettre = lettrePerso ?? corpsParDefaut;

  async function copieCommande() {
    try {
      await navigator.clipboard.writeText(lettre);
      setCopie(true);
      setTimeout(() => setCopie(false), 2500);
    } catch {}
  }

  return (
    <div>
      <ul className="border-t border-ecorce-200">
        {articles.map((a) => (
          <li
            key={`${a.collection}/${a.slug}`}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-ecorce-200 py-4"
          >
            <div className="min-w-0 flex-1 basis-52">
              <Link
                href={`/catalogue/${a.collection}/${a.slug}`}
                className="font-serif text-[1.02rem] leading-snug font-semibold text-ecorce-900 transition-colors hover:text-griotte-500"
              >
                {a.titre}
              </Link>
              <p className="mt-0.5 text-xs text-ecorce-500">{a.collectionName}</p>
            </div>

            <div className="flex items-center gap-1" aria-label={`Quantité pour ${a.titre}`}>
              <button
                type="button"
                onClick={() => poseQuantite(a.collection, a.slug, a.quantite - 1)}
                disabled={a.quantite <= 1}
                aria-label="Un exemplaire de moins"
                className="flex h-8 w-8 items-center justify-center border border-ecorce-300 text-ecorce-700 transition-colors hover:border-cerise-400 hover:bg-cerise-50 focus-visible:outline-2 focus-visible:outline-cerise-400 disabled:opacity-40"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={99}
                value={a.quantite}
                onChange={(e) =>
                  poseQuantite(a.collection, a.slug, Number(e.target.value))
                }
                aria-label={`Nombre d’exemplaires de ${a.titre}`}
                className="h-8 w-12 border border-ecorce-300 bg-white text-center text-sm text-ecorce-900 tabular-nums focus-visible:outline-2 focus-visible:outline-cerise-400"
              />
              <button
                type="button"
                onClick={() => poseQuantite(a.collection, a.slug, a.quantite + 1)}
                aria-label="Un exemplaire de plus"
                className="flex h-8 w-8 items-center justify-center border border-ecorce-300 text-ecorce-700 transition-colors hover:border-cerise-400 hover:bg-cerise-50 focus-visible:outline-2 focus-visible:outline-cerise-400"
              >
                +
              </button>
            </div>

            <span className="leader hidden sm:inline-block" aria-hidden="true" />
            <span className="shrink-0 text-sm font-medium text-ecorce-800 tabular-nums">
              {a.prix ?? "—"}
            </span>
            <button
              type="button"
              onClick={() => retireDuPanier(a.collection, a.slug)}
              aria-label={`Retirer « ${a.titre} » du panier`}
              className="shrink-0 text-xs text-ecorce-500 underline decoration-transparent decoration-2 underline-offset-2 transition-colors hover:text-griotte-500 hover:decoration-griotte-500"
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <p className="text-sm text-ecorce-600">
          {nombre} {nombre > 1 ? "livres" : "livre"}
        </p>
        {chiffres > 0 && (
          <p className="font-serif text-lg text-ecorce-900">
            Total indicatif{chiffres < articles.length ? "*" : ""} :{" "}
            <strong className="tabular-nums">{enEuros(total)}</strong>
          </p>
        )}
      </div>
      {chiffres > 0 && chiffres < articles.length && (
        <p className="mt-1 text-right text-xs text-ecorce-500">
          * hors titres sans prix affiché — la maison confirmera.
        </p>
      )}

      {/* La lettre elle-même, posée sur la page — et modifiable : on
          complète son nom et son adresse ici même, on ajoute un mot si on
          veut, et c'est cette version-là qui part, par Gmail, par la
          messagerie ou au presse-papiers. */}
      <div className="mt-10 border border-ecorce-200 bg-white p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4 border-b border-ecorce-200 pb-3">
          <p className="text-xs font-bold tracking-[0.14em] text-ecorce-600 uppercase">
            La lettre de commande
          </p>
          <button
            type="button"
            onClick={copieCommande}
            className="shrink-0 text-xs text-ecorce-600 underline decoration-cerise-400 decoration-2 underline-offset-4 transition-colors hover:text-griotte-500"
          >
            {copie ? "Copiée ✓" : "Copier"}
          </button>
        </div>
        <p className="mt-1 text-xs text-ecorce-500">
          À : {COURRIEL_COMMANDES} — complétez vos coordonnées directement dans
          la lettre.
        </p>
        <textarea
          value={lettre}
          onChange={(e) => setLettrePerso(e.target.value)}
          rows={17}
          aria-label="La lettre de commande, modifiable"
          spellCheck={false}
          className="mt-4 w-full resize-y border border-ecorce-200 bg-fleur-50/40 p-4 font-sans text-sm leading-relaxed text-ecorce-800 focus-visible:border-cerise-400 focus-visible:outline-2 focus-visible:outline-cerise-400"
        />
        {lettrePerso !== null && (
          <p className="mt-2 text-right text-xs">
            <button
              type="button"
              onClick={() => setLettrePerso(null)}
              className="text-ecorce-500 underline decoration-transparent decoration-2 underline-offset-2 transition-colors hover:text-griotte-500 hover:decoration-griotte-500"
            >
              Réécrire la lettre depuis le panier
            </button>
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={brouillonGmail(sujet, lettre)}
          target="_blank"
          rel="noreferrer"
          className="block bg-cerise-400 px-6 py-4 text-center text-xs font-bold tracking-[0.16em] text-ecorce-900 uppercase transition-colors hover:bg-cerise-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ecorce-900"
        >
          Envoyer via Gmail
        </a>
        <a
          href={brouillonMailto(sujet, lettre)}
          className="block border border-ecorce-300 bg-white px-6 py-4 text-center text-xs font-bold tracking-[0.16em] text-ecorce-800 uppercase transition-colors hover:border-cerise-400 hover:bg-cerise-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cerise-400"
        >
          Via votre messagerie
        </a>
      </div>
      <p className="mt-3 text-center text-xs leading-relaxed text-ecorce-500">
        « Gmail » ouvre le brouillon dans le navigateur ; « votre messagerie »
        ouvre l’application de courriel de l’appareil. Envois franco de port.
      </p>

      <div className="mt-6 text-center text-sm">
        <button
          type="button"
          onClick={() => {
            if (confirm("Vider le panier ?")) videLePanier();
          }}
          className="text-ecorce-500 underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-griotte-500 hover:decoration-griotte-500"
        >
          Vider le panier
        </button>
      </div>
    </div>
  );
}
