"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cerise } from "@/components/Cerisier";
import {
  abonnePanier,
  composeCommande,
  COURRIEL_COMMANDES,
  enEuros,
  lienCommande,
  lienCommandeGmail,
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

  async function copieCommande() {
    try {
      await navigator.clipboard.writeText(composeCommande(articles).corps);
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

      {/* La lettre elle-même, posée sur la page : chacun voit ce qui va
          partir, et peut aussi la copier telle quelle vers n'importe quelle
          messagerie. */}
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
          À : {COURRIEL_COMMANDES} — complétez vos coordonnées avant l’envoi.
        </p>
        <pre className="mt-4 font-sans text-sm leading-relaxed whitespace-pre-wrap text-ecorce-800">
          {composeCommande(articles).corps}
        </pre>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={lienCommandeGmail(articles)}
          target="_blank"
          rel="noreferrer"
          className="block bg-cerise-400 px-6 py-4 text-center text-xs font-bold tracking-[0.16em] text-ecorce-900 uppercase transition-colors hover:bg-cerise-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ecorce-900"
        >
          Envoyer via Gmail
        </a>
        <a
          href={lienCommande(articles)}
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
