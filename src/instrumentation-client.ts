import * as Sentry from "@sentry/nextjs";

/**
 * Sentry côté navigateur — le veilleur qui prévient la maison quand une
 * page casse chez un lecteur.
 *
 * Next appelle ce fichier une fois, avant l'hydratation : c'est le seul
 * endroit d'où l'on attrape aussi les erreurs des tout premiers instants.
 * (Les anciens sentry.client.config.ts ne sont plus lus sous Turbopack ;
 * cette convention-ci l'est.)
 */

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  /* Pour trier dans Sentry ce qui vient de la machine du développeur et ce
     qui vient du site en ligne : sans ça, les deux se mélangent et une
     erreur de développement ressemble à une panne chez un lecteur. */
  environment: process.env.NODE_ENV,

  /* Le site ne pose pas de cookie et ne suit personne — c'est ce qui le
     dispense de bannière de consentement (voir api/frequentation). Un
     mouchard glissé par la porte de service ruinerait la promesse :

     - sendDefaultPii reste faux : ni adresse IP, ni en-têtes de requête
       joints aux erreurs ;
     - pas de Session Replay : filmer l'écran des lecteurs serait la
       chose la plus intrusive du site ;
     - tracesSampleRate à zéro : la mesure de performance ouvre une trace
       à chaque page vue. La maison compte déjà ses passages elle-même, et
       elle n'a pas de problème de lenteur à instruire — ce serait du
       quota dépensé à ne rien apprendre.

     Ce qu'on garde : les erreurs. Rien qu'elles. */
  sendDefaultPii: false,
  tracesSampleRate: 0,
});

/* Les changements de page du routeur, signalés à Sentry : une erreur porte
   alors la page d'où l'on venait, et cesse d'être un message hors sol. */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
