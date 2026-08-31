"use client";

import { useMemo, useState } from "react";
import { BookCard, type LivreVignette } from "./BookCard";

/* L'année vient des colophons (lib/parution.ts) ; quelques livres n'en ont
   pas — ils se rangent en fin de rayon quel que soit le sens du tri. */

const TRIS = [
  { id: "recents", label: "Plus récents d’abord" },
  { id: "anciens", label: "Plus anciens d’abord" },
  { id: "titre", label: "Titre (A → Z)" },
  { id: "catalogue", label: "Ordre du catalogue" },
] as const;
type Tri = (typeof TRIS)[number]["id"];

const plie = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function TriDesLivres({
  livres,
  collections,
}: {
  livres: LivreVignette[];
  collections: { slug: string; name: string }[];
}) {
  const [recherche, setRecherche] = useState("");
  const [collection, setCollection] = useState<string | null>(null);
  const [tri, setTri] = useState<Tri>("recents");

  const visibles = useMemo(() => {
    const aiguille = plie(recherche.trim());
    const liste = livres.filter(
      (b) =>
        (!collection || b.collection === collection) &&
        (!aiguille || plie(b.title).includes(aiguille)),
    );
    if (tri === "titre") {
      liste.sort((a, b) =>
        a.title.localeCompare(b.title, "fr", { sensitivity: "base" }),
      );
    } else if (tri !== "catalogue") {
      const sens = tri === "recents" ? -1 : 1;
      liste.sort((a, b) => {
        if (a.annee == null) return b.annee == null ? 0 : 1;
        if (b.annee == null) return -1;
        return sens * (a.annee - b.annee);
      });
    }
    return liste;
  }, [livres, recherche, collection, tri]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1 basis-64">
          <span className="sr-only">Rechercher un titre</span>
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ecorce-400"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="m13.5 13.5 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un titre…"
            className="w-full rounded-full border border-ecorce-300 bg-white py-2.5 pr-5 pl-11 text-sm text-ecorce-900 placeholder:text-ecorce-400 focus:border-griotte-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cerise-400"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-ecorce-600">
          <span>Trier&nbsp;:</span>
          <select
            value={tri}
            onChange={(e) => setTri(e.target.value as Tri)}
            className="rounded-full border border-ecorce-300 bg-white px-4 py-2.5 text-sm text-ecorce-900 focus:border-griotte-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cerise-400"
          >
            {TRIS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCollection(null)}
          aria-pressed={collection === null}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-cerise-400 ${
            collection === null
              ? "border-griotte-400 bg-griotte-400 text-white"
              : "border-ecorce-300 text-ecorce-600 hover:border-griotte-400 hover:bg-cerise-50 hover:text-griotte-500"
          }`}
        >
          Toutes les collections
        </button>
        {collections.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCollection((v) => (v === c.slug ? null : c.slug))}
            aria-pressed={collection === c.slug}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-cerise-400 ${
              collection === c.slug
                ? "border-griotte-400 bg-griotte-400 text-white"
                : "border-ecorce-300 text-ecorce-600 hover:border-griotte-400 hover:bg-cerise-50 hover:text-griotte-500"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-ecorce-500 tabular-nums" aria-live="polite">
        {visibles.length} {visibles.length > 1 ? "titres" : "titre"}
      </p>

      {visibles.length === 0 ? (
        <div className="mt-10 border-l-4 border-cerise-400 pl-6">
          <p className="text-ecorce-700">
            Aucun titre ne correspond à cette recherche.
          </p>
          <button
            type="button"
            onClick={() => {
              setRecherche("");
              setCollection(null);
            }}
            className="mt-3 font-serif text-ecorce-700 underline decoration-cerise-400 decoration-2 underline-offset-[6px] transition-colors hover:text-griotte-500"
          >
            Tout réafficher
          </button>
        </div>
      ) : (
        <ul className="etagere mt-8 grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4">
          {visibles.map((b) => (
            <li key={`${b.collection}-${b.slug}`}>
              <BookCard book={b} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
