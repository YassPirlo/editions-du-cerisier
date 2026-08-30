"use client";

import * as React from "react";

/**
 * Le couloir de couvertures : deux rails de livres sortent du point de fuite
 * au centre de l'écran et balaient vers les bords en grandissant, en boucle
 * perpétuelle — la vitrine d'une librairie qui n'en finit pas.
 *
 * Adapté du composant « Image Stream Hero » de ruixen.ui (21st.dev), dont la
 * géométrie est remarquablement pensée ; réglé ici au format livre (18×24,
 * le ratio de nos couvertures) et traduit dans le vocabulaire de la maison.
 *
 * Trois idées portent l'illusion, héritées de l'original :
 * 1. la profondeur est écrite en TAILLE APPARENTE, géométriquement — chaque
 *    carte est plus grande que la précédente d'un même rapport, sinon les
 *    cartes proches se déchirent quand la projection explose ;
 * 2. les rails s'ouvrent fort au départ puis tiennent (fan > 1) : le ruban
 *    quitte le centre à plat, plie une fois, et file en diagonale ;
 * 3. aucune extrémité de la boucle n'est jamais à l'écran : une carte naît
 *    DE L'AUTRE CÔTÉ de l'axe (railBirth négatif) et meurt hors cadre — le
 *    centre reste couvert à chaque instant, sans fondu d'apparition.
 *
 * Tout est en cqw (pourcentage de la largeur du conteneur) : le couloir garde
 * ses proportions à toutes les tailles. Le mouvement est une simple keyframe
 * CSS — le JavaScript ne fait que l'écrire une fois. `prefers-reduced-motion`
 * fige le couloir en nature morte complète (les délais négatifs ont déjà
 * posé chaque carte en plein vol).
 */

const GEOMETRIE = {
  perspective: 30,
  largeur: 18,
  hauteur: 24, // le 3/4 du livre, pas le 25 de l'original pensé pour la photo
  rayon: 0.3,
  hauteurNaissance: 2.6,
  hauteurSortie: 46,
  railNaissance: -11,
  railSortie: 44,
  fan: 3.3,
  tourNaissance: 6,
  tourSortie: 28,
  pas: 24,
};

function traceKeyframes(sens: 1 | -1, nom: string) {
  const g = GEOMETRIE;
  const etapes: string[] = [];
  for (let s = 0; s <= g.pas; s++) {
    const u = s / g.pas;
    const echelle =
      (g.hauteurNaissance / g.hauteur) *
      Math.pow(g.hauteurSortie / g.hauteurNaissance, u);
    const z = g.perspective * (1 - 1 / echelle);
    const rail =
      g.railSortie - (g.railSortie - g.railNaissance) * Math.pow(1 - u, g.fan);
    const tour = g.tourNaissance + (g.tourSortie - g.tourNaissance) * u;
    etapes.push(
      `${(u * 100).toFixed(2)}%{transform:translate3d(${(sens * rail).toFixed(2)}cqw,0,${z.toFixed(2)}cqw) rotateY(${(-sens * tour).toFixed(2)}deg)}`,
    );
  }
  return `@keyframes ${nom}{${etapes.join("")}}`;
}

export function FluxCouvertures({
  couvertures,
  cartes = 9,
  duree = 22,
  axe = 56,
  className = "",
  children,
}: {
  /** Chemins des couvertures ; les deux rails déroulent la même séquence. */
  couvertures: string[];
  /** Cartes par rail : la densité du couloir, pas sa vitesse. */
  cartes?: number;
  /** Secondes pour traverser tout le couloir. */
  duree?: number;
  /** Hauteur de l'axe du couloir, en pourcentage. */
  axe?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const droite = `flux-d-${id}`;
  const gauche = `flux-g-${id}`;
  const carte = `flux-c-${id}`;

  const css = React.useMemo(
    () =>
      traceKeyframes(1, droite) +
      traceKeyframes(-1, gauche) +
      `@media(prefers-reduced-motion:reduce){.${carte}{animation-play-state:paused}}`,
    [droite, gauche, carte],
  );

  const g = GEOMETRIE;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ containerType: "inline-size" }}
    >
      <style>{css}</style>

      {/* Le couloir est un décor : caché aux lecteurs d'écran, et absent des
          navigateurs qui ignorent les unités de conteneur (.flux-corridor,
          voir globals.css) — le texte du héros se suffit. */}
      <div
        aria-hidden="true"
        className="flux-corridor pointer-events-none absolute inset-0"
        style={{
          perspective: `${g.perspective}cqw`,
          perspectiveOrigin: `50% ${axe}%`,
        }}
      >
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {[droite, gauche].map((nom) =>
            Array.from({ length: cartes }, (_, i) => {
              const src = couvertures[i % Math.max(couvertures.length, 1)];
              return (
                <div
                  key={`${nom}-${i}`}
                  className={`${carte} absolute overflow-hidden`}
                  style={{
                    left: "50%",
                    top: `${axe}%`,
                    width: `${g.largeur}cqw`,
                    height: `${g.hauteur}cqw`,
                    marginLeft: `${-g.largeur / 2}cqw`,
                    marginTop: `${-g.hauteur / 2}cqw`,
                    borderRadius: `${g.rayon}cqw`,
                    backgroundColor: "#f6f1e8",
                    boxShadow: "0 1.2cqw 2.4cqw rgb(0 0 0 / 0.45)",
                    animation: `${nom} ${duree}s linear infinite`,
                    animationDelay: `${-(i * duree) / cartes}s`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  {src ? (
                    // Une simple balise img : les couvertures sont des
                    // fichiers statiques locaux, et dix-huit cartes animées
                    // n'ont pas besoin du pipeline next/image.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
              );
            }),
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
