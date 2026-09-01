"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

/**
 * Le rack : un coverflow au défilement natif — la couverture face à soi au
 * centre, les voisines de biais, molette, glisser ou doigt pour faire
 * tourner le présentoir. Inspiré du Coverflow Carousel de ruixen.ui
 * (21st.dev).
 *
 * La rotation devrait être du CSS pur (animation-timeline: view(inline)),
 * mais ce Chromium laisse la timeline inerte sur un défilement horizontal
 * imbriqué, et l'attache Web Animations reste « play-pending » à jamais —
 * les deux vérifiées au débogueur. On fait donc comme l'original : la
 * rotation se calcule depuis la position de défilement, un écouteur passif
 * et un requestAnimationFrame, transformations pures. Ça marche partout,
 * Firefox et Safari compris. Avec prefers-reduced-motion, le rack reste une
 * étagère plate qui défile.
 *
 * À la souris, deux gestes de plus que le défilement natif : la molette
 * verticale fait tourner le présentoir (tant qu'il reste du rayonnage —
 * aux extrémités, la page reprend la main), et le cliquer-glisser le fait
 * tourner à la main — un vrai glisser n'ouvre pas de fiche, un clic sec si.
 */
export function RackCouvertures({
  items,
}: {
  items: { href: string; src: string; titre: string }[];
}) {
  const cadre = React.useRef<HTMLDivElement>(null);

  /* L'inclinaison des couvertures selon leur place dans le cadre. */
  React.useEffect(() => {
    const rack = cadre.current;
    if (!rack) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cartes = [...rack.querySelectorAll<HTMLElement>("[data-rack-item]")];

    const pose = () => {
      const cadreRect = rack.getBoundingClientRect();
      const centre = cadreRect.left + cadreRect.width / 2;
      for (const el of cartes) {
        const r = el.getBoundingClientRect();
        /* -1 au bord gauche, 0 au centre, 1 au bord droit. */
        const t = Math.max(
          -1,
          Math.min(1, (r.left + r.width / 2 - centre) / (cadreRect.width / 2)),
        );
        el.style.transform = `perspective(70rem) rotateY(${(-t * 42).toFixed(2)}deg) scale(${(1 - Math.abs(t) * 0.16).toFixed(3)})`;
        el.style.opacity = (1 - Math.abs(t) * 0.45).toFixed(3);
      }
    };

    pose();
    let image: number | null = null;
    const demande = () => {
      if (image !== null) return;
      image = requestAnimationFrame(() => {
        pose();
        image = null;
      });
    };
    rack.addEventListener("scroll", demande, { passive: true });
    window.addEventListener("resize", demande);
    return () => {
      rack.removeEventListener("scroll", demande);
      window.removeEventListener("resize", demande);
      if (image !== null) cancelAnimationFrame(image);
    };
  }, [items]);

  /* Les gestes de souris — actifs aussi avec prefers-reduced-motion :
     c'est de la conduite, pas de l'ornement. */
  React.useEffect(() => {
    const rack = cadre.current;
    if (!rack) return;

    /* La molette verticale tourne le présentoir. Aux extrémités on ne
       retient pas la page : rien n'est plus agaçant qu'un carrousel qui
       confisque le défilement. */
    const surMolette = (e: WheelEvent) => {
      let delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (e.deltaMode === 1) delta *= 24; // molettes « par lignes »
      if (delta === 0) return;
      const max = rack.scrollWidth - rack.clientWidth;
      const peutTourner =
        delta > 0 ? rack.scrollLeft < max - 1 : rack.scrollLeft > 1;
      if (!peutTourner) return;
      e.preventDefault();
      rack.scrollLeft += delta;
    };

    /* Le cliquer-glisser. Au-delà de quelques pixels, le geste devient un
       glisser : on avale alors le clic du relâchement pour ne pas ouvrir
       une fiche par accident. */
    let ancreX: number | null = null;
    let parcouru = 0;

    const surPresse = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      ancreX = e.clientX;
      parcouru = 0;
      rack.setPointerCapture(e.pointerId);
      rack.classList.add("rack-en-main");
    };
    const surGlisse = (e: PointerEvent) => {
      if (ancreX === null) return;
      const dx = e.clientX - ancreX;
      ancreX = e.clientX;
      parcouru += Math.abs(dx);
      rack.scrollLeft -= dx;
    };
    const surLache = () => {
      ancreX = null;
      rack.classList.remove("rack-en-main");
    };
    const surClic = (e: MouseEvent) => {
      if (parcouru > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
      parcouru = 0;
    };
    const sansTraine = (e: DragEvent) => e.preventDefault();

    rack.addEventListener("wheel", surMolette, { passive: false });
    rack.addEventListener("pointerdown", surPresse);
    rack.addEventListener("pointermove", surGlisse);
    rack.addEventListener("pointerup", surLache);
    rack.addEventListener("pointercancel", surLache);
    rack.addEventListener("click", surClic, true);
    rack.addEventListener("dragstart", sansTraine);
    return () => {
      rack.removeEventListener("wheel", surMolette);
      rack.removeEventListener("pointerdown", surPresse);
      rack.removeEventListener("pointermove", surGlisse);
      rack.removeEventListener("pointerup", surLache);
      rack.removeEventListener("pointercancel", surLache);
      rack.removeEventListener("click", surClic, true);
      rack.removeEventListener("dragstart", sansTraine);
    };
  }, []);

  return (
    <div
      ref={cadre}
      className="rack -mx-4 mt-10 flex cursor-grab gap-8 overflow-x-auto px-[max(1.5rem,calc(50%-5rem))] pb-6 select-none [mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)] sm:gap-10 [&.rack-en-main]:cursor-grabbing"
    >
      {items.map((x) => (
        <Link
          key={x.href}
          href={x.href}
          data-rack-item
          className="group w-36 shrink-0 sm:w-40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cerise-400"
        >
          <span className="relative block h-52 sm:h-56">
            <Image
              src={x.src}
              alt=""
              fill
              sizes="160px"
              className="object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.35)]"
            />
          </span>
          <span className="mt-4 block text-center font-serif text-sm leading-snug text-ecorce-800 transition-colors group-hover:text-griotte-500">
            {x.titre}
          </span>
        </Link>
      ))}
    </div>
  );
}
