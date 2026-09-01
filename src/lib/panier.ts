/**
 * Le panier — sans compte, sans serveur, fidèle au principe de la maison :
 * pas d'e-commerce, les commandes partent par courriel. Ici, le panier ne
 * fait que préparer ce courriel : on y pose des livres au fil de la visite
 * (il vit dans le navigateur du lecteur, localStorage), on ajuste les
 * quantités, et le bouton final ouvre la messagerie avec la commande toute
 * rédigée — titres, quantités, total indicatif, formule de politesse —
 * adressée à la maison.
 *
 * L'état s'expose façon « external store » (subscribe/snapshot) pour
 * useSyncExternalStore : le cœur des vignettes, le compteur de l'en-tête et
 * la page panier respirent ensemble, y compris entre deux onglets.
 */

/* L'adresse des commandes — orthographe donnée telle quelle par la maison
   (« ceriser », sans le deuxième i). */
export const COURRIEL_COMMANDES = "editionsduceriser@gmail.com";

export type ArticlePanier = {
  collection: string;
  slug: string;
  titre: string;
  collectionName: string;
  prix?: string | null;
  quantite: number;
};

const CLE = "cerisier-panier";
const abonnes = new Set<() => void>();

const previent = () => abonnes.forEach((f) => f());

/* useSyncExternalStore relit le snapshot à chaque rendu : il doit rendre la
   MÊME référence tant que rien n'a changé — on met donc la lecture en cache
   sur la chaîne brute du stockage. */
let brutConnu: string | null = null;
let instantane: ArticlePanier[] = [];
const VIDE: ArticlePanier[] = [];

export function lisPanier(): ArticlePanier[] {
  let brut: string | null = null;
  try {
    brut = localStorage.getItem(CLE);
  } catch {
    return VIDE;
  }
  if (brut === brutConnu) return instantane;
  brutConnu = brut;
  try {
    const lu = brut ? (JSON.parse(brut) as ArticlePanier[]) : [];
    instantane = Array.isArray(lu) ? lu.filter((a) => a && a.slug) : [];
  } catch {
    instantane = [];
  }
  return instantane;
}

export const lisPanierServeur = (): ArticlePanier[] => VIDE;

export function abonnePanier(rappel: () => void) {
  abonnes.add(rappel);
  /* Le même panier ouvert dans un autre onglet compte aussi. */
  window.addEventListener("storage", rappel);
  return () => {
    abonnes.delete(rappel);
    window.removeEventListener("storage", rappel);
  };
}

function ecrit(articles: ArticlePanier[]) {
  try {
    localStorage.setItem(CLE, JSON.stringify(articles));
  } catch {}
  previent();
}

const meme = (a: ArticlePanier, collection: string, slug: string) =>
  a.collection === collection && a.slug === slug;

export function dansPanier(collection: string, slug: string): boolean {
  return lisPanier().some((a) => meme(a, collection, slug));
}

/* Depuis la fiche : chaque geste ajoute un exemplaire de plus. */
export function ajouteAuPanier(article: Omit<ArticlePanier, "quantite">) {
  const articles = [...lisPanier()];
  const present = articles.find((a) => meme(a, article.collection, article.slug));
  if (present) {
    present.quantite = Math.min(99, present.quantite + 1);
  } else {
    articles.push({ ...article, quantite: 1 });
  }
  ecrit(articles);
}

/* Depuis la cerise des vignettes : présent on retire, absent on pose. */
export function basculeAuPanier(article: Omit<ArticlePanier, "quantite">) {
  const articles = lisPanier();
  if (articles.some((a) => meme(a, article.collection, article.slug))) {
    ecrit(articles.filter((a) => !meme(a, article.collection, article.slug)));
  } else {
    ecrit([...articles, { ...article, quantite: 1 }]);
  }
}

export function poseQuantite(collection: string, slug: string, quantite: number) {
  const bornee = Math.max(1, Math.min(99, Math.round(quantite) || 1));
  ecrit(
    lisPanier().map((a) => (meme(a, collection, slug) ? { ...a, quantite: bornee } : a)),
  );
}

export function retireDuPanier(collection: string, slug: string) {
  ecrit(lisPanier().filter((a) => !meme(a, collection, slug)));
}

export function videLePanier() {
  ecrit([]);
}

/* ------------------------------------------------------------------ */

export function prixEnNombre(prix?: string | null): number | null {
  const trouve = (prix ?? "").match(/\d+(?:[.,]\d{1,2})?/);
  return trouve ? Number(trouve[0].replace(",", ".")) : null;
}

export const enEuros = (n: number) =>
  `${n.toLocaleString("fr-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

/* Le courriel type — la lettre qu'on aurait écrite à la main. */
export function composeCommande(articles: ArticlePanier[]) {
  const lignes = articles.map((a) => {
    const prix = a.prix ? ` – ${a.prix}` : "";
    return `— ${a.quantite} × « ${a.titre} » (${a.collectionName})${prix}`;
  });

  let total = 0;
  let chiffres = 0;
  for (const a of articles) {
    const p = prixEnNombre(a.prix);
    if (p !== null) {
      total += p * a.quantite;
      chiffres++;
    }
  }
  const ligneTotal =
    chiffres === 0
      ? []
      : chiffres === articles.length
        ? [``, `Total indicatif : ${enEuros(total)}`]
        : [``, `Total indicatif (hors titres sans prix affiché) : ${enEuros(total)}`];

  const nombre = articles.reduce((s, a) => s + a.quantite, 0);
  const sujet = `Commande — ${nombre} ${nombre > 1 ? "livres" : "livre"}`;
  const corps = [
    "Bonjour,",
    "",
    "Je souhaite commander les livres suivants :",
    "",
    ...lignes,
    ...ligneTotal,
    "",
    "Mes coordonnées pour l’envoi :",
    "Nom et prénom :",
    "Adresse :",
    "Code postal et localité :",
    "Téléphone :",
    "",
    "Merci d’avance, bien à vous.",
  ].join("\r\n");

  return { sujet, corps };
}

export function lienCommande(articles: ArticlePanier[]) {
  const { sujet, corps } = composeCommande(articles);
  return `mailto:${COURRIEL_COMMANDES}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
}

/* La même commande, mais dans Gmail au navigateur — pour tous ceux dont la
   messagerie est un onglet, pas une application installée. */
export const brouillonGmail = (sujet: string, corps: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(COURRIEL_COMMANDES)}&su=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;

/* Le mailto équivalent, pour un corps déjà en main (la lettre retouchée
   sur la page du panier part telle que le lecteur l'a laissée). */
export const brouillonMailto = (sujet: string, corps: string) =>
  `mailto:${COURRIEL_COMMANDES}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;

export function lienCommandeGmail(articles: ArticlePanier[]) {
  const { sujet, corps } = composeCommande(articles);
  return brouillonGmail(sujet, corps);
}

export function lienCommandeGmailUnitaire(livre: {
  titre: string;
  collectionName: string;
  prix?: string | null;
}) {
  const { corps } = composeCommande([
    {
      collection: "",
      slug: "",
      titre: livre.titre,
      collectionName: livre.collectionName,
      prix: livre.prix,
      quantite: 1,
    },
  ]);
  return brouillonGmail(`Commande : ${livre.titre}`, corps);
}

/* La même lettre pour un seul livre — le bouton « Commander ce livre »
   des fiches, côté serveur ; le sujet porte le titre. */
export function lienCommandeUnitaire(livre: {
  titre: string;
  collectionName: string;
  prix?: string | null;
}) {
  const { corps } = composeCommande([
    {
      collection: "",
      slug: "",
      titre: livre.titre,
      collectionName: livre.collectionName,
      prix: livre.prix,
      quantite: 1,
    },
  ]);
  return `mailto:${COURRIEL_COMMANDES}?subject=${encodeURIComponent(`Commande : ${livre.titre}`)}&body=${encodeURIComponent(corps)}`;
}
