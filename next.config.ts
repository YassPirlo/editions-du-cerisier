import type { NextConfig } from "next";

/* Aperçu public sur GitHub Pages : un hébergeur purement statique, qui sert
   le site sous un sous-chemin (« /editions-du-cerisier »). Quand PAGES_BASE
   est posé — le workflow de déploiement s'en charge — on exporte le site en
   fichiers plats ; l'optimisation d'images est coupée car elle suppose un
   serveur, et le slash final garantit un index.html par page, que n'importe
   quel hébergeur statique sait servir.

   Un build normal (sans PAGES_BASE) n'est pas affecté : le déploiement
   définitif se fera sur un hébergeur qui sert Next tel quel. */
const base = process.env.PAGES_BASE;

const nextConfig: NextConfig = base
  ? {
      output: "export",
      basePath: base,
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
