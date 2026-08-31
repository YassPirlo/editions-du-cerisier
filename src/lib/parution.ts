/* La date de parution vit déjà dans les textes d'origine (colophons,
   entrées « Nouveautés ») : on la lit, on ne l'invente jamais. */

const MOIS =
  "janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre";
const RE_PARUTION = new RegExp(`\\b(${MOIS})\\s+(19[89]\\d|20[0-5]\\d)\\b`, "gi");
const RE_ANNEE = /\b(19[89]\d|20[0-5]\d)\b/g;

/* « Mois Année » en toutes lettres — la forme des colophons récents.
   La dernière occurrence l'emporte : les textes citent parfois des dates
   historiques avant le colophon. */
export function dateDeParution(texte: string): string | null {
  const prises = [...texte.matchAll(RE_PARUTION)];
  if (prises.length === 0) return null;
  const [, mois, annee] = prises[prises.length - 1];
  return `${mois.charAt(0).toUpperCase()}${mois.slice(1)} ${annee}`;
}

/* Année seule, cherchée dans la fin du texte — les colophons anciens disent
   « Roman, 2003 - 12,5/20 - 312 p. » sans mois. On ne fouille que la queue
   pour éviter les années citées dans le résumé. */
export function anneeDeParution(texte: string): number | null {
  const complet = dateDeParution(texte);
  if (complet) return Number(complet.slice(-4));
  const queue = texte.slice(-250);
  const prises = [...queue.matchAll(RE_ANNEE)];
  if (prises.length === 0) return null;
  return Number(prises[prises.length - 1][1]);
}
