"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

/**
 * Le rack : un coverflow au défilement natif — la couverture face à soi au
 * centre, les voisines de biais, molette ou doigt pour faire tourner le
 * présentoir. Inspiré du Coverflow Carousel de ruixen.ui (21st.dev).
 *
 * La rotation devrait être du CSS pur (animation-timeline: view(inline)),
 * mais ce Chromium laisse la timeline inerte sur un défilement horizontal
 * imbriqué, et l'attache Web Animations reste « play-pending » à jamais —
 * les deux vérifiées au débogueur. On fait donc comme l'original : la
 * rotation se calcule depuis la position de défilement, un écouteur passif
 * et un requestAnimationFrame, transformations pures. Ça marche partout,
 * Firefox et Safari compris. Avec prefers-reduced-motion, le rack reste une
 * étagère plate qui défile.
 */
export function RackCouvertures({
  items,
}: {
  items: { href: string; src: string; titre: string }[];
}) {
  const cadre = React.useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={cadre}
      className="rack -mx-4 mt-10 flex gap-8 overflow-x-auto px-[max(1.5rem,calc(50%-5rem))] pb-6 [mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)] sm:gap-10"
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
