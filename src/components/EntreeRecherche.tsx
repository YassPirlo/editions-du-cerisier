"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Le champ de recherche, d'après le « placeholders and vanish input » de
 * manuarora700 (21st.dev), refait maison — sans dépendance, aux couleurs
 * du Cerisier : les suggestions se relaient dans le champ vide, et à la
 * validation le texte se dissout en particules d'encre vers la gauche,
 * comme soufflé de la page. Avec prefers-reduced-motion, rien ne tourne
 * ni ne se dissout : le champ fait champ.
 */
export function EntreeRecherche({
  valeur,
  onValeur,
  onVanish,
  placeholders,
  ariaLabel,
}: {
  valeur: string;
  onValeur: (v: string) => void;
  /* Appelé quand la validation a fini sa dissolution (ou aussitôt, sans
     animation) — le champ vient d'être vidé. */
  onVanish: (requete: string) => void;
  placeholders: string[];
  ariaLabel: string;
}) {
  const [indice, setIndice] = useState(0);
  const [immobile, setImmobile] = useState(true);
  const [dissolution, setDissolution] = useState(false);
  const champ = useRef<HTMLInputElement>(null);
  const toile = useRef<HTMLCanvasElement>(null);
  const animation = useRef<number | null>(null);

  useEffect(() => {
    const prefere = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applique = () => setImmobile(prefere.matches);
    applique();
    prefere.addEventListener("change", applique);

    const minuterie = setInterval(
      () => setIndice((i) => (i + 1) % Math.max(1, placeholders.length)),
      3200,
    );
    return () => {
      prefere.removeEventListener("change", applique);
      clearInterval(minuterie);
      if (animation.current !== null) cancelAnimationFrame(animation.current);
    };
  }, [placeholders.length]);

  function dissout(requete: string) {
    const input = champ.current;
    const canvas = toile.current;
    if (!input || !canvas || immobile || !requete.trim()) {
      onValeur("");
      onVanish(requete);
      return;
    }

    /* Le texte du champ, échantillonné pixel par pixel : chaque point
       d'encre devient une particule qui file vers la gauche en
       s'amenuisant. */
    const cadre = input.getBoundingClientRect();
    canvas.width = cadre.width;
    canvas.height = cadre.height;
    const encre = canvas.getContext("2d");
    if (!encre) {
      onValeur("");
      onVanish(requete);
      return;
    }
    const style = getComputedStyle(input);
    encre.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    encre.textBaseline = "middle";
    encre.fillStyle = "#241d13";
    encre.fillText(requete, parseFloat(style.paddingLeft) || 16, cadre.height / 2);

    const pixels = encre.getImageData(0, 0, canvas.width, canvas.height).data;
    const particules: { x: number; y: number; r: number; vx: number; vie: number }[] = [];
    for (let y = 0; y < cadre.height; y += 2) {
      for (let x = 0; x < cadre.width; x += 2) {
        if (pixels[(y * canvas.width + x) * 4 + 3] > 96) {
          particules.push({
            x,
            y,
            r: 0.6 + Math.random() * 1.1,
            vx: 1.5 + Math.random() * 4,
            vie: 1,
          });
        }
      }
    }

    setDissolution(true);
    onValeur("");

    /* Le filet : si l'onglet gèle les images (arrière-plan, panneau
       masqué), la dissolution ne doit pas rester coincée — on la solde
       au bout d'une seconde et demie. */
    const filet = setTimeout(() => {
      if (animation.current !== null) cancelAnimationFrame(animation.current);
      animation.current = null;
      encre.clearRect(0, 0, canvas.width, canvas.height);
      setDissolution(false);
      onVanish(requete);
    }, 1500);

    const souffle = () => {
      encre.clearRect(0, 0, canvas.width, canvas.height);
      let vivantes = 0;
      for (const p of particules) {
        p.x -= p.vx;
        p.vx *= 1.06;
        p.vie -= 0.028;
        if (p.vie <= 0 || p.x < -4) continue;
        vivantes++;
        encre.globalAlpha = Math.max(0, p.vie);
        encre.fillStyle = "#241d13";
        encre.beginPath();
        encre.arc(p.x, p.y, p.r * p.vie, 0, Math.PI * 2);
        encre.fill();
      }
      if (vivantes > 0) {
        animation.current = requestAnimationFrame(souffle);
      } else {
        clearTimeout(filet);
        animation.current = null;
        encre.clearRect(0, 0, canvas.width, canvas.height);
        setDissolution(false);
        onVanish(requete);
      }
    };
    animation.current = requestAnimationFrame(souffle);
  }

  /* Une seule validation, deux chemins pour y arriver : le submit du
     formulaire (bouton, Entrée) et la touche Entrée saisie au vol — la
     ceinture pour les claviers que le submit implicite n'entend pas. */
  function valide() {
    if (!dissolution) dissout(valeur);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        valide();
      }}
      className="relative"
    >
      <input
        ref={champ}
        type="search"
        value={valeur}
        onChange={(e) => onValeur(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            valide();
          }
        }}
        aria-label={ariaLabel}
        autoComplete="off"
        spellCheck={false}
        className={`w-full border border-ecorce-300 bg-white py-3.5 pr-14 pl-4 text-[1.05rem] text-ecorce-900 outline-none transition-colors [&::-webkit-search-cancel-button]:hidden focus:border-cerise-500 ${
          dissolution ? "text-transparent caret-transparent" : ""
        }`}
      />
      <canvas
        ref={toile}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {/* Les suggestions se relaient dans le champ vide — remontées d'un
          souffle à chaque relève. */}
      {valeur === "" && !dissolution && (
        <span
          key={indice}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-4 flex items-center pr-14 text-[1.02rem] text-ecorce-400 ${
            immobile ? "" : "releve-suggestion"
          }`}
        >
          <span className="truncate">
            {placeholders[indice % placeholders.length]}
          </span>
        </span>
      )}
      <button
        type="submit"
        aria-label="Lancer la recherche"
        className="absolute inset-y-1.5 right-1.5 flex w-11 items-center justify-center bg-cerise-400 text-ecorce-900 transition-colors hover:bg-cerise-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ecorce-900"
      >
        <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="m13.5 13.5 3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </form>
  );
}
