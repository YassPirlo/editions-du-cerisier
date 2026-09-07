import { withSentryConfig } from "@sentry/nextjs/config";
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
  : {
      /* L'administration Decap est un fichier de public/ : Next ne sert pas
         les index.html de dossiers (les hébergeurs statiques, si — d'où
         l'absence de cette règle dans la branche export). Sans elle, /admin
         rend la page 404 du site, en local comme derrière un serveur
         Next. */
      async rewrites() {
        return [{ source: "/admin", destination: "/admin/index.html" }];
      },
    };

/* Sentry n'intervient au build que pour une chose : téléverser les plans
   du code compilé, sans lesquels une erreur arrive illisible — « a.b is not
   a function », ligne 1, colonne 40000. Ce téléversement demande un jeton ;
   tant qu'il n'est pas posé chez l'hébergeur, l'étape se saute d'elle-même
   et la surveillance fonctionne quand même, en moins lisible.

   sentryUrl : le compte est hébergé dans la région européenne (le « .de. »
   du DSN) ; l'outil viserait les États-Unis par défaut et ne trouverait pas
   le projet. Les rapports restent donc en Europe — ce qui vaut mieux pour
   une maison belge.

   org et project sont les noms courts du compte, pas ceux du site : à
   vérifier dans l'adresse de Sentry si un jour le téléversement refuse. */
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "yassine-vitullo",
  project: process.env.SENTRY_PROJECT || "editions-du-cerisier",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  sentryUrl: "https://de.sentry.io/",
  silent: true,
  /* Pas de statistiques d'usage renvoyées à Sentry par le build. */
  telemetry: false,
});
