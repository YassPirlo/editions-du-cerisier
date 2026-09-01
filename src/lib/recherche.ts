/**
 * Le moteur de la recherche — sans dépendance, tout en mémoire : 253
 * fiches, ça se fouille au clavier sans faire attendre personne.
 *
 * Trois promesses tenues ici :
 *   – une faute d'orthographe ne cache pas un livre (« margerita » trouve
 *     MARGHERITA) : distance d'édition avec transpositions, tolérance
 *     proportionnée à la longueur du mot ;
 *   – un mot de la présentation suffit (« Favara », « horreur ») : le
 *     texte des fiches est indexé, pas seulement les titres ;
 *   – le titre pèse plus lourd que le texte, la collection entre les
 *     deux — pour que « griottes » ouvre d'abord la collection.
 *
 * L'index (src/data/recherche-index.json) est produit par
 * scripts/construire-donnees.mjs, comme le reste des données.
 */

export type FicheIndex = {
  slug: string;
  collection: string;
  collectionName: string;
  title: string;
  cover: string | null;
  price: string | null;
  pages: string | null;
  texte: string;
};

export type Resultat = {
  fiche: FicheIndex;
  score: number;
  /* Le jeton du texte qui a répondu — pour montrer l'extrait où il vit. */
  jetonTexte: string | null;
};

/* Minuscules et accents rendus : « Théâtre » et « theatre » sont le même
   mot. La transformation préserve la longueur des caractères français
   précomposés — l'extrait peut donc se découper dans le texte original. */
export const normalise = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const decoupe = (t: string) =>
  normalise(t)
    .split(/[^a-z0-9]+/)
    .filter((m) => m.length >= 2);

/* La distance d'édition (avec transposition de lettres voisines : le
   « margeh » tapé pour « margh »), plafonnée — au-delà du plafond, on
   abandonne tôt. */
export function distance(a: string, b: string, plafond: number): number {
  if (Math.abs(a.length - b.length) > plafond) return plafond + 1;
  let avantHier: number[] = [];
  let hier = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const ligne = [i];
    let minimum = i;
    for (let j = 1; j <= b.length; j++) {
      const cout = a[i - 1] === b[j - 1] ? 0 : 1;
      let d = Math.min(hier[j] + 1, ligne[j - 1] + 1, hier[j - 1] + cout);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d = Math.min(d, avantHier[j - 2] + 1);
      }
      ligne.push(d);
      if (d < minimum) minimum = d;
    }
    if (minimum > plafond) return plafond + 1;
    avantHier = hier;
    hier = ligne;
  }
  return hier[b.length];
}

/* Le meilleur écho d'un mot cherché parmi les jetons d'un champ. */
function meilleurEcho(
  mot: string,
  jetons: string[],
): { score: number; jeton: string; occurrences: number } | null {
  const tolerance = mot.length >= 7 ? 2 : mot.length >= 4 ? 1 : 0;
  let meilleur: { score: number; jeton: string } | null = null;
  let occurrences = 0;

  for (const jeton of jetons) {
    let score = 0;
    if (jeton === mot) score = 1;
    else if (mot.length >= 3 && jeton.startsWith(mot)) score = 0.85;
    else if (mot.length >= 5 && jeton.includes(mot)) score = 0.65;
    else if (jeton.length >= 4 && mot.startsWith(jeton)) score = 0.55;
    else if (tolerance > 0) {
      const d = distance(mot, jeton, tolerance);
      if (d <= tolerance) score = d === 1 ? 0.8 : 0.55;
    }
    if (score > 0) {
      occurrences++;
      if (!meilleur || score > meilleur.score) meilleur = { score, jeton };
      if (meilleur.score === 1 && occurrences > 6) break;
    }
  }
  return meilleur ? { ...meilleur, occurrences } : null;
}

type FichePreparee = {
  fiche: FicheIndex;
  titre: string[];
  collection: string[];
  texte: string[];
};

let preparees: FichePreparee[] | null = null;
let sourcePreparee: FicheIndex[] | null = null;

function prepare(index: FicheIndex[]): FichePreparee[] {
  if (preparees && sourcePreparee === index) return preparees;
  sourcePreparee = index;
  preparees = index.map((fiche) => ({
    fiche,
    titre: decoupe(fiche.title),
    collection: decoupe(fiche.collectionName),
    texte: decoupe(fiche.texte),
  }));
  return preparees;
}

export function chercheLivres(index: FicheIndex[], requete: string): Resultat[] {
  const mots = decoupe(requete);
  if (mots.length === 0) return [];

  const resultats: Resultat[] = [];
  for (const f of prepare(index)) {
    let total = 0;
    let repondus = 0;
    let jetonTexte: string | null = null;
    let poidsJetonTexte = 0;

    for (const mot of mots) {
      const dansTitre = meilleurEcho(mot, f.titre);
      const dansCollection = meilleurEcho(mot, f.collection);
      const dansTexte = meilleurEcho(mot, f.texte);

      const pesees = [
        dansTitre ? dansTitre.score * 5 : 0,
        dansCollection ? dansCollection.score * 3.5 : 0,
        dansTexte
          ? dansTexte.score + Math.min(0.6, (dansTexte.occurrences - 1) * 0.15)
          : 0,
      ];
      const meilleur = Math.max(...pesees);
      if (meilleur > 0) {
        total += meilleur;
        repondus++;
        if (dansTexte && dansTexte.score > poidsJetonTexte) {
          poidsJetonTexte = dansTexte.score;
          jetonTexte = dansTexte.jeton;
        }
      }
    }

    if (repondus === 0) continue;
    /* Un mot cherché resté sans écho pèse lourd : la moitié des mots
       trouvés ne fait pas une trouvaille. */
    const score = total * Math.pow(repondus / mots.length, 2);
    if (score < 0.55) continue;
    resultats.push({ fiche: f.fiche, score, jetonTexte });
  }

  return resultats.sort(
    (a, b) => b.score - a.score || a.fiche.title.localeCompare(b.fiche.title),
  );
}

/* L'extrait : la phrase autour du mot qui a répondu, découpée aux mots,
   pour montrer d'où vient la trouvaille. */
export function extrait(
  texte: string,
  jeton: string | null,
  large = 150,
): { avant: string; trouve: string; apres: string } | null {
  if (!jeton) return null;
  const position = normalise(texte).indexOf(jeton);
  if (position < 0) return null;

  let debut = Math.max(0, position - Math.floor(large / 2));
  let fin = Math.min(texte.length, position + jeton.length + Math.floor(large / 2));
  if (debut > 0) {
    const espace = texte.indexOf(" ", debut);
    if (espace > -1 && espace < position) debut = espace + 1;
  }
  if (fin < texte.length) {
    const espace = texte.lastIndexOf(" ", fin);
    if (espace > position + jeton.length) fin = espace;
  }

  return {
    avant: (debut > 0 ? "… " : "") + texte.slice(debut, position),
    trouve: texte.slice(position, position + jeton.length),
    apres: texte.slice(position + jeton.length, fin) + (fin < texte.length ? " …" : ""),
  };
}
