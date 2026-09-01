/**
 * L'ambiance du site — deux axes qui ne se marchent pas dessus :
 *
 * la SAISON (data-saison) tourne la frondaison : printemps en fleur, été
 * de la récolte (la base, sans attribut), automne cuivré, hiver sous
 * givre. Seuls les jetons de couleur vivante bougent (cerise, griotte,
 * feuille, fleur) — l'écorce, elle, ne change jamais : le bois demeure,
 * et avec lui l'encre du texte et la lisibilité (globals.css).
 *
 * l'ENCRE (data-encre="nb") est l'édition noir et blanc, posée par-dessus
 * n'importe quelle saison. Choisir une saison depuis le menu rend les
 * couleurs ; le pied de page garde sa bascule rapide.
 *
 * Tout passe par ici : le menu de l'en-tête, la bascule du pied de page
 * et le script d'avant-peinture du layout lisent et écrivent les mêmes
 * clés, et s'entendent par le même événement.
 */

export type Saison = "printemps" | "ete" | "automne" | "hiver";
export type Ambiance = Saison | "nb";

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
const CLE_ENCRE = "cerisier-encre";
const EVENEMENT = "cerisier-ambiance";

const estSaison = (v: unknown): v is Saison =>
  v === "printemps" || v === "ete" || v === "automne" || v === "hiver";

export function lisSaison(): Saison {
  const posee = document.documentElement.dataset.saison;
  return estSaison(posee) ? posee : "ete";
}

export function lisEncre(): boolean {
  return document.documentElement.dataset.encre === "nb";
}

/* Ce que le menu affiche comme actif : le noir et blanc quand il couvre
   tout, la saison sinon. */
export function lisAmbiance(): Ambiance {
  return lisEncre() ? "nb" : lisSaison();
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

export function choisisSaison(saison: Saison) {
  const racine = document.documentElement;
  if (saison === "ete") delete racine.dataset.saison;
  else racine.dataset.saison = saison;
  /* Revenir à une saison, c'est demander ses couleurs : l'édition noir
     et blanc se retire d'elle-même. */
  delete racine.dataset.encre;
  retiens(CLE_SAISON, saison === "ete" ? null : saison);
  retiens(CLE_ENCRE, null);
  notifie();
}

export function passeEnNoirEtBlanc() {
  document.documentElement.dataset.encre = "nb";
  retiens(CLE_ENCRE, "nb");
  notifie();
}

export function basculeNoirEtBlanc() {
  const versNb = !lisEncre();
  if (versNb) document.documentElement.dataset.encre = "nb";
  else delete document.documentElement.dataset.encre;
  retiens(CLE_ENCRE, versNb ? "nb" : null);
  notifie();
}
