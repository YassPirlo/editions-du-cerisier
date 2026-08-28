import Image from "next/image";

/**
 * Une couverture montée en volume : le plat, la tranche et la tête.
 *
 * La géométrie est dans `globals.css` (`.livre3d`) plutôt qu'en classes
 * utilitaires : Tailwind ne sait pas exprimer `transform-style: preserve-3d`
 * ni des faces hors du flux, et l'écrire en `[transform-style:preserve-3d]`
 * rendrait le composant illisible pour rien.
 *
 * La couverture est posée en `object-contain` sur un fond papier : les titres
 * et l'emblème de l'éditeur y sont imprimés, un `object-cover` les couperait.
 */
export function Livre3D({
  src,
  alt,
  sizes,
  epaisseur,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
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
          <Image src={src} alt={alt} fill sizes={sizes} className="object-contain" />
        </div>
        <div className="livre3d__tranche" aria-hidden="true" />
        <div className="livre3d__tete" aria-hidden="true" />
      </div>
    </div>
  );
}
