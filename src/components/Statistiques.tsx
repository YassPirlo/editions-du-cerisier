"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * La balise de fréquentation — maison, sans service tiers, sans cookie :
 * à chaque page lue, un signal minuscule (le chemin, et d'où l'on vient)
 * part vers /api/frequentation, qui compte (voir la route pour le détail
 * de ce qui est conservé — rien de personnel). Les chiffres se consultent
 * dans l'admin : /admin/stats.html.
 *
 * La balise se tait d'elle-même sur l'admin et en local ; sur l'aperçu
 * GitHub Pages, la route n'existe pas et le signal se perd sans bruit.
 */
export function Statistiques() {
  const chemin = usePathname();

  useEffect(() => {
    if (chemin.startsWith("/admin")) return;
    if (/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) return;

    let provenance = "";
    try {
      if (document.referrer) {
        const hote = new URL(document.referrer).hostname;
        if (hote !== window.location.hostname) provenance = hote;
      }
    } catch {}

    const corps = JSON.stringify({ chemin, provenance });
    try {
      const envoye = navigator.sendBeacon?.(
        "/api/frequentation",
        new Blob([corps], { type: "application/json" }),
      );
      if (!envoye) {
        fetch("/api/frequentation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: corps,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}
  }, [chemin]);

  return null;
}
