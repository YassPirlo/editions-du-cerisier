"use client";

import * as React from "react";

/**
 * La lampe de lecture : sur les bandes d'encre, une lueur chaude suit le
 * curseur, et respire — elle rétrécit quand la main bouge, s'élargit quand
 * elle s'arrête. On lit le manifeste à la lampe.
 *
 * L'idée de la respiration vient du « Spotlight Background » de ruixen.ui
 * (21st.dev) ; l'exécution est réécrite : là où l'original passe par l'état
 * React à chaque mouvement (un re-rendu par pixel), le pointeur écrit ici
 * deux variables CSS sous requestAnimationFrame et le navigateur fait tout.
 * Souris fine seulement, et jamais si le lecteur préfère l'immobilité.
 */
export function LampeDeLecture({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const cadre = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = cadre.current;
    if (!el) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let image: number | null = null;
    let repos: ReturnType<typeof setTimeout> | undefined;

    const bouge = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (image === null) {
        image = requestAnimationFrame(() => {
          el.style.setProperty("--lampe-x", `${x}px`);
          el.style.setProperty("--lampe-y", `${y}px`);
          el.style.setProperty("--lampe-d", "22rem");
          el.style.setProperty("--lampe-o", "1");
          image = null;
        });
      }
      clearTimeout(repos);
      repos = setTimeout(() => {
        el.style.setProperty("--lampe-d", "30rem");
      }, 160);
    };
    const sort = () => el.style.setProperty("--lampe-o", "0");

    el.addEventListener("pointermove", bouge);
    el.addEventListener("pointerleave", sort);
    return () => {
      el.removeEventListener("pointermove", bouge);
      el.removeEventListener("pointerleave", sort);
      if (image !== null) cancelAnimationFrame(image);
      clearTimeout(repos);
    };
  }, []);

  return (
    /* clip-path et non overflow-hidden : un overflow caché ferait de ce bloc
       un conteneur de défilement, et les timelines view() des enfants (le
       balayage de la citation, la pousse) s'y accrocheraient au lieu de
       suivre la page. Le clip découpe la lueur sans rien capturer. */
    <div ref={cadre} className={`relative [clip-path:inset(0)] ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-[2] rounded-full"
        style={{
          width: "var(--lampe-d, 26rem)",
          height: "var(--lampe-d, 26rem)",
          opacity: "var(--lampe-o, 0)",
          transform:
            "translate(calc(var(--lampe-x, -999px) - 50%), calc(var(--lampe-y, -999px) - 50%))",
          background:
            "radial-gradient(circle, rgba(255, 213, 110, 0.1), rgba(255, 213, 110, 0.04) 45%, transparent 70%)",
          transition: "width 0.5s ease, height 0.5s ease, opacity 0.5s ease",
        }}
      />
      {children}
    </div>
  );
}
