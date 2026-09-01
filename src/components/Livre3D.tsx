import Image from "next/image";
import { Cerise } from "./Cerisier";

/**
 * Une couverture montée en volume : le plat, la tranche et la tête.
 *
 * La géométrie est dans `globals.css` (`.livre3d`) plutôt qu'en classes
 * utilitaires : Tailwind ne sait pas exprimer `transform-style: preserve-3d`
 * ni des faces hors du flux, et l'écrire en `[transform-style:preserve-3d]`
 * rendrait le composant illisible pour rien.
 *
 * La couverture remplit le plat (`object-cover`) : les numérisations sont au
 * format du livre, le rognage est de l'ordre du filet — tandis qu'un
 * `object-contain` laissait dépasser des liserés de papier blanc dès que le
 * ratio différait d'un cheveu, et un volume à liserés fait maquette, pas
 * livre.
 *
 * Sans image, le volume ne disparaît pas : il devient une reliure muette —
 * papier nu, filet, titre composé en Fraunces et emblème au trait, comme une
 * édition courante sans jaquette. Cinquante-cinq livres du catalogue n'ont
 * pas de couverture numérisée ; ils méritent mieux qu'un rectangle gris.
 */
export function Livre3D({
  src,
  alt,
  titre,
  collection,
  sizes,
  epaisseur,
  className = "",
}: {
  src?: string | null;
  alt?: string;
  /** Titre du livre : alt de l'image, et texte de la reliure muette. */
  titre?: string;
  collection?: string;
  sizes?: string;
  /** Épaisseur du volume, en CSS. Varier d'un livre à l'autre évite la pile
      de volumes identiques, qui trahit tout de suite le gabarit. */
  epaisseur?: string;
  className?: string;
}) {
  return (
    <div
      className={`livre3d ${className}`}
      style={epaisseur ? ({ "--ep": epaisseur } as React.CSSProperties) : undefined}
    >
      <div className="livre3d__ombre" aria-hidden="true" />
      <div className="livre3d__corps">
        <div className="livre3d__plat">
          {src ? (
            <Image
              src={src}
              alt={alt ?? (titre ? `Couverture de « ${titre} »` : "")}
              fill
              sizes={sizes}
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-between p-4 pt-7 pb-5 text-center">
              <div
                className="pointer-events-none absolute inset-2 border border-ecorce-300/70"
                aria-hidden="true"
              />
              <Cerise className="h-5 w-5 shrink-0 text-griotte-500" />
              <p className="titre-verger px-1 text-[0.9rem] leading-snug break-words text-balance text-ecorce-900">
                {titre}
              </p>
              <p className="text-[0.55rem] tracking-[0.18em] text-ecorce-500 uppercase">
                {collection ?? "Éditions du Cerisier"}
              </p>
            </div>
          )}
        </div>
        <div className="livre3d__tranche" aria-hidden="true" />
        <div className="livre3d__tete" aria-hidden="true" />
      </div>
    </div>
  );
}

/* L'épaisseur du volume suit la pagination réelle : un essai de 432 pages
   n'occupe pas la table comme une pièce de 64. C'est une information, pas un
   ornement — et c'est elle qui rend le rayonnage vivant. L'éventail est
   large à dessein : une plaquette doit se lire mince au premier regard, une
   somme bien charpentée. */
export function epaisseurDe(pages?: string): string {
  const n = parseInt(pages ?? "", 10);
  if (!n || Number.isNaN(n)) return "1.6rem";
  const borne = Math.min(Math.max(n, 60), 450);
  return `${(0.95 + ((borne - 60) / 390) * 2.05).toFixed(2)}rem`;
}
