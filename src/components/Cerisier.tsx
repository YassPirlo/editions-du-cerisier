/**
 * Vocabulaire graphique du cerisier.
 *
 * Tout est tracé au filet (monoline), comme l'emblème de l'éditeur imprimé au
 * dos des couvertures : des cercles ouverts et des pédoncules, jamais des
 * aplats. On ne dessine pas « un arbre », on emprunte sa géométrie.
 */

/** Une cerise : un cercle ouvert au bout d'un pédoncule. */
export function Cerise({
  className = "",
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M13.4 3.2c-2.1 2.6-3.4 5.2-3.9 7.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle
        cx="9"
        cy="16.4"
        r="5.2"
        stroke="currentColor"
        strokeWidth="1.6"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

/**
 * Une branche qui traverse toute la largeur, les fruits suspendus dessous.
 * Volontairement coupée par les deux bords : on n'en voit qu'un fragment,
 * comme une branche qui passerait devant une fenêtre.
 */
export function Branche({ className = "" }: { className?: string }) {
  /**
   * Chaque nœud porte une PAIRE de fruits sur un pédoncule court. C'est ce qui
   * distingue une cerise d'un ballon : elle pend près de la branche, et à deux.
   */
  const noeuds: { x: number; y: number; drop: number; r: number; sens: number }[] = [
    { x: 96, y: 214, drop: 26, r: 19, sens: -1 },
    { x: 352, y: 194, drop: 34, r: 16, sens: 1 },
    { x: 588, y: 175, drop: 24, r: 20, sens: -1 },
    { x: 846, y: 147, drop: 32, r: 17, sens: 1 },
    { x: 1094, y: 114, drop: 25, r: 18, sens: -1 },
  ];

  return (
    <svg
      viewBox="0 0 1200 300"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* la branche maîtresse, coupée par les deux bords */}
      <path
        d="M-20 244C220 190 430 214 660 172c200-37 380-30 580-92"
        stroke="currentColor"
        strokeWidth="7.2"
        strokeLinecap="round"
      />
      {/* une ramification secondaire, plus fine */}
      <path
        d="M470 190c74-30 140-32 214-14"
        stroke="currentColor"
        strokeWidth="3.8"
        strokeLinecap="round"
        opacity="0.5"
      />
      {noeuds.map((n, i) => {
        // La fourche reste près de la branche ; ce sont les queues qui
        // descendent. Les deux fruits pendent à des hauteurs différentes et se
        // chevauchent un peu : c'est ce décalage qui fait la cerise, pas deux
        // cercles alignés côte à côte.
        const fx = n.x + n.sens * 5;
        const fy = n.y + n.drop;
        const rd = n.r * 0.85;
        const g = { x: fx - n.r * 0.72, y: fy + n.r * 2.3 };
        const d = { x: fx + n.r * 0.82, y: fy + n.r * 3.05 };
        return (
          <g key={i}>
            {/* pédoncule commun jusqu'à la fourche */}
            <path
              d={`M${n.x} ${n.y}q${n.sens * 3} ${n.drop * 0.7} ${n.sens * 5} ${n.drop}`}
              stroke="currentColor"
              strokeWidth="3.6"
              strokeLinecap="round"
            />
            {/* les deux queues, incurvées vers le bas */}
            <path
              d={`M${fx} ${fy}Q${fx - n.r * 0.62} ${fy + n.r * 1.1} ${g.x} ${g.y - n.r}`}
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d={`M${fx} ${fy}Q${fx + n.r * 0.7} ${fy + n.r * 1.4} ${d.x} ${d.y - rd}`}
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <circle cx={g.x} cy={g.y} r={n.r} stroke="currentColor" strokeWidth="4.4" />
            <circle cx={d.x} cy={d.y} r={rd} stroke="currentColor" strokeWidth="4.4" />
          </g>
        );
      })}
    </svg>
  );
}
