import * as Sentry from "@sentry/nextjs";

/**
 * Sentry côté serveur — l'autre moitié du veilleur.
 *
 * Next appelle `register` une fois au démarrage de chaque instance, avant
 * la première requête ; c'est là que Sentry doit s'initialiser, et nulle
 * part ailleurs (un sentry.server.config.ts n'est plus lu du tout).
 *
 * Les deux environnements d'exécution passent ici. On initialise pareil
 * dans l'un et l'autre : le paquet @sentry/nextjs sert déjà la version qui
 * convient à chacun, il n'y a pas de réglage à distinguer.
 */
export function register() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,

    /* Mêmes principes qu'au navigateur (voir instrumentation-client.ts) :
       les erreurs, et rien d'autre. Côté serveur sendDefaultPii joindrait
       en plus l'adresse IP du lecteur aux rapports — précisément ce que la
       mesure de fréquentation s'applique à ne jamais conserver. */
    sendDefaultPii: false,
    tracesSampleRate: 0,
  });
}

/* Les erreurs levées en rendant une page ou en répondant à une route.
   Sans ce raccord, Next les avale : elles s'affichent dans les journaux de
   l'hébergeur, que personne ne va lire, et n'arrivent jamais à Sentry. */
export const onRequestError = Sentry.captureRequestError;
