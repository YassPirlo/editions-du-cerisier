/**
 * L'ambiance du site — deux axes qui se croisent sans se gêner :
 *
 * la SAISON (data-saison) tourne la frondaison : printemps en fleur, été
 * de la récolte (la base, sans attribut), automne cuivré, hiver sous
 * givre. Seuls les jetons de couleur vivante bougent (cerise, griotte,
 * feuille, fleur) — l'écorce, elle, ne change jamais : le bois demeure,
 * et avec lui l'encre du texte et la lisibilité (globals.css).
 *
 * la NUIT (data-nuit) éteint le jour : le papier rejoint l'encre de la
 * saison en cours, le texte devient crème, l'or des accents reste
 * allumé. Elle se combine avec chaque saison — nuit de prune au
 * printemps, encre chaude en été, braise sous la cendre en automne,
 * bleu de minuit en hiver.
 *
 * Tout passe par ici : le menu de l'en-tête, la bascule du pied de page
 * et le script d'avant-peinture du layout lisent et écrivent les mêmes
 * clés, et s'entendent par le même événement.
 */

export type Saison = "printemps" | "ete" | "automne" | "hiver";

/* Les pastilles du menu montrent chaque saison par sa cerise — en dur,
   forcément : les jetons ne connaissent que la saison en cours. */
export const SAISONS: {
  valeur: Saison;
  nom: string;
  sousTitre: string;
  pastille: string;
}[] = [
  { valeur: "printemps", nom: "Printemps", sousTitre: "la floraison", pastille: "#ef8db3" },
  { valeur: "ete", nom: "Été", sousTitre: "l’or de la récolte", pastille: "#ffc107" },
  { valeur: "automne", nom: "Automne", sousTitre: "le feuillage cuivré", pastille: "#e39730" },
  { valeur: "hiver", nom: "Hiver", sousTitre: "le verger sous givre", pastille: "#93bdd3" },
];

const CLE_SAISON = "cerisier-saison";
const CLE_NUIT = "cerisier-nuit";
const EVENEMENT = "cerisier-ambiance";

const estSaison = (v: unknown): v is Saison =>
  v === "printemps" || v === "ete" || v === "automne" || v === "hiver";

export function lisSaison(): Saison {
  const posee = document.documentElement.dataset.saison;
  return estSaison(posee) ? posee : "ete";
}

export function lisNuit(): boolean {
  return document.documentElement.dataset.nuit !== undefined;
}

function notifie() {
  window.dispatchEvent(new Event(EVENEMENT));
}

export function abonneAmbiance(rappel: () => void) {
  window.addEventListener(EVENEMENT, rappel);
  window.addEventListener("storage", rappel);
  return () => {
    window.removeEventListener(EVENEMENT, rappel);
    window.removeEventListener("storage", rappel);
  };
}

function retiens(cle: string, valeur: string | null) {
  try {
    if (valeur === null) localStorage.removeItem(cle);
    else localStorage.setItem(cle, valeur);
  } catch {
    /* Navigation privée : le choix vaut pour la page, sans mémoire. */
  }
}

/* Changer de saison ne touche pas à la nuit : on peut feuilleter les
   quatre nuits comme les quatre jours. */
export function choisisSaison(saison: Saison) {
  const racine = document.documentElement;
  if (saison === "ete") delete racine.dataset.saison;
  else racine.dataset.saison = saison;
  retiens(CLE_SAISON, saison === "ete" ? null : saison);
  notifie();
}

export function basculeNuit() {
  const racine = document.documentElement;
  const versLaNuit = !lisNuit();
  if (versLaNuit) racine.dataset.nuit = "";
  else delete racine.dataset.nuit;
  retiens(CLE_NUIT, versLaNuit ? "nuit" : null);
  notifie();
}
