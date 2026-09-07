/**
 * Route d'essai, temporaire — à retirer aussitôt le résultat lu.
 *
 * Elle ne sert qu'à prouver une chose que rien d'autre ne peut prouver de
 * l'extérieur : que SENTRY_DSN est bien lu à l'exécution chez l'hébergeur, et
 * que les erreurs levées côté serveur arrivent jusqu'à Sentry. Le DSN du
 * navigateur, lui, s'inscrit dans le paquet au build et se vérifie en le
 * lisant ; celui du serveur ne laisse aucune trace visible.
 *
 * L'erreur est levée sans être rattrapée : c'est la seule façon qu'elle
 * traverse le raccord onRequestError (voir src/instrumentation.ts).
 */
export const dynamic = "force-dynamic";

export function GET() {
  throw new Error(
    "Essai Sentry — erreur volontaire levée côté serveur, sans gravité.",
  );
}
