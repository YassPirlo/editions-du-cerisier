import { promises as fs } from "node:fs";
import path from "node:path";
import { getStore, type Store } from "@netlify/blobs";
import { motDePasseValide } from "@/lib/mot-de-passe";

/**
 * La fréquentation, comptée par la maison elle-même — aucun service tiers.
 *
 * POST : la balise du site (src/components/Statistiques.tsx) dépose une vue
 * — chemin + provenance. On y ajoute ici le jour (heure de Bruxelles), le
 * pays (quand le serveur de devant le renseigne) et une empreinte de
 * visiteur anonyme : un condensé à sens unique de l'adresse IP et du
 * navigateur, salé et daté — elle change chaque jour, ne permet de suivre
 * personne, et l'adresse elle-même n'est jamais conservée. Pas de cookie,
 * pas de donnée personnelle : c'est ce qui dispense le site de bannière de
 * consentement.
 *
 * GET : les agrégats pour le tableau de bord de l'admin
 * (public/admin/stats.html), réservés à la maison — le mot de passe voyage
 * dans l'en-tête Authorization, jamais dans l'adresse.
 *
 * Les comptes tiennent dans deux dépôts, selon l'endroit où le site
 * tourne : en ligne le magasin de l'hébergeur, en développement des
 * fichiers qu'on peut ouvrir et relire à la main. Rien à ouvrir ailleurs,
 * rien à payer.
 */

type Compteurs = Record<string, number>;
type Mois = {
  jours: Record<string, { vues: number; visiteurs: number }>;
  pages: Compteurs;
  pays: Compteurs;
  provenances: Compteurs;
  /* Arrivé après coup : les mois déjà écrits n'en ont pas, d'où le ? et
     les gardes à la lecture comme à l'écriture. */
  appareils?: Compteurs;
};

const ROBOTS =
  /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|pingdom|facebookexternalhit|preview|scan/i;

const HOTES_MAISON =
  /(^|\.)editions-du-cerisier\.be$|(^|\.)github\.io$|^localhost$/;

/* Le magasin de l'hébergeur, quand il y en a un. Il se présente par une
   variable d'environnement ; là où elle manque — un `next dev` sur la
   machine de quelqu'un —, getStore lève, et c'est notre signal pour
   retomber sur les fichiers. Le disque de l'hébergeur, lui, est en
   lecture seule : les comptes s'y perdaient sans un mot. */
let magasin: Store | null | undefined;

function depot(): Store | null {
  if (magasin === undefined) {
    try {
      magasin = getStore("frequentation");
    } catch {
      magasin = null;
    }
  }
  return magasin;
}

/* Le dossier n'étant connu qu'à l'exécution, le compilateur ne sait pas
   deviner ce qu'on ira lire : par prudence il embarque le projet entier
   dans la fonction — les 250 couvertures comprises. Cette branche ne sert
   qu'en développement ; on le lui dit. */
const DOSSIER = path.resolve(
  /*turbopackIgnore: true*/ process.env.STATS_DIR ||
    path.join(process.cwd(), ".data", "frequentation"),
);

async function lisFichier<T>(fichier: string, defaut: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(DOSSIER, fichier), "utf8")) as T;
  } catch {
    return defaut;
  }
}

/* L'écriture passe par un fichier temporaire : une visite au mauvais
   moment ne doit pas laisser un JSON à moitié écrit. */
async function ecrisFichier(fichier: string, donnees: unknown) {
  const cible = path.join(DOSSIER, fichier);
  await fs.mkdir(path.dirname(cible), { recursive: true });
  const provisoire = `${cible}.${process.pid}.tmp`;
  await fs.writeFile(provisoire, JSON.stringify(donnees));
  await fs.rename(provisoire, cible);
}

async function lis<T>(clef: string, defaut: T): Promise<T> {
  const m = depot();
  if (!m) return lisFichier(clef, defaut);
  return ((await m.get(clef, { type: "json" })) as T) ?? defaut;
}

/* Lire, modifier, réécrire. Le magasin n'accepte l'écriture que si
   l'entrée n'a pas bougé depuis la lecture : deux visites au même instant
   ne s'effacent donc plus l'une l'autre, la seconde recommence sur des
   comptes à jour. Ce garde-fou vaut ici plus qu'au temps des fichiers —
   chaque aller-retour passe maintenant par le réseau, et la fenêtre où
   deux visites se croisent s'en trouve élargie d'autant.

   Entre deux tentatives, on attend un moment tiré au sort : sans cela une
   rafale repart à l'assaut en rangs serrés et se gêne autant qu'au tour
   précédent. L'attente s'allonge à mesure qu'on insiste.

   ⚠️ Ce garde-fou ne peut s'éprouver qu'en ligne. Le magasin d'essai que
   Netlify fait tourner en local relit l'empreinte, puis écrit sans
   verrou : deux visites y passent le contrôle avant que la première ait
   posé son fichier. En local, donc, des vues se perdent — ce n'est pas
   le signe d'un défaut ici.

   La transformation rend null quand il n'y a finalement rien à écrire. */
const ESSAIS = 12;

async function modifie<T>(
  clef: string,
  defaut: T,
  transforme: (valeur: T) => T | null,
): Promise<void> {
  const m = depot();
  if (!m) {
    const valeur = transforme(await lisFichier(clef, defaut));
    if (valeur !== null) await ecrisFichier(clef, valeur);
    return;
  }
  for (let essai = 0; essai < ESSAIS; essai++) {
    if (essai > 0) {
      const attente = Math.random() * 25 * essai;
      await new Promise((suite) => setTimeout(suite, attente));
    }
    const lu = await m.getWithMetadata(clef, {
      type: "json",
      consistency: "strong",
    });
    const valeur = transforme((lu?.data as T) ?? defaut);
    if (valeur === null) return;
    const { modified } = await m.setJSON(
      clef,
      valeur,
      lu ? { onlyIfMatch: lu.etag } : { onlyIfNew: true },
    );
    if (modified) return;
  }
}

/* Le jour, vu de Bruxelles — c'est le fuseau des lecteurs de la maison. */
const aujourdHui = () =>
  new Date().toLocaleDateString("fr-CA", { timeZone: "Europe/Brussels" });

const clefMois = (jour: string) => `mois-${jour.slice(0, 7)}.json`;

/* Le pays, quand le serveur de devant le joint à la requête (les en-têtes
   usuels des répartiteurs et des CDN). Sinon « ?? » — le tableau de bord
   l'affiche en « Inconnu », et personne n'est pisté pour si peu. */
const ENTETES_PAYS = [
  "cf-ipcountry",
  "x-vercel-ip-country",
  "x-country-code",
  "x-geo-country",
  "x-client-geo-country",
];

function litPays(entetes: Headers): string {
  for (const nom of ENTETES_PAYS) {
    const brut = (entetes.get(nom) || "").trim();
    if (/^[A-Za-z]{2}$/.test(brut)) return brut.toUpperCase();
  }
  return "??";
}

/* Le genre d'appareil, et rien de plus : trois cases. Savoir la marque du
   téléphone n'apprendrait rien à la maison et rapprocherait les comptes de
   la donnée personnelle ; savoir qu'un lecteur sur deux tient le site dans
   sa main change en revanche la façon de le composer.

   Les navigateurs récents le disent franchement (sec-ch-ua-mobile, « ?1 »
   pour un téléphone) : on le préfère, il est court et il ne ment pas. Mais
   il ignore les tablettes — Safari sur iPad n'envoie rien, et les Android
   se déclarent « ?0 », c'est-à-dire ordinateurs. D'où la tablette cherchée
   d'abord dans la signature du navigateur, et celle-ci gardée en dernier
   recours pour les navigateurs qui se taisent. */
const TABLETTE = /ipad|tablet|playbook|silk|(android(?!.*mobile))/i;
const MOBILE = /android|iphone|ipod|windows phone|iemobile|blackberry|opera mini|mobile/i;

function litAppareil(entetes: Headers): string {
  const navigateur = entetes.get("user-agent") || "";
  if (TABLETTE.test(navigateur)) return "tablette";
  const indice = entetes.get("sec-ch-ua-mobile");
  if (indice === "?1") return "mobile";
  if (indice === "?0") return "ordinateur";
  return MOBILE.test(navigateur) ? "mobile" : "ordinateur";
}

async function empreinteDe(entetes: Headers, jour: string): Promise<string> {
  const ip =
    entetes.get("x-nf-client-connection-ip") ||
    (entetes.get("x-forwarded-for") || "").split(",")[0].trim();
  const navigateur = entetes.get("user-agent") || "";
  const sel = process.env.STATS_SEL || "le-verger-compte";
  const donnees = new TextEncoder().encode(`${ip}|${navigateur}|${jour}|${sel}`);
  const condense = await crypto.subtle.digest("SHA-256", donnees);
  return Array.from(new Uint8Array(condense).slice(0, 16))
    .map((o) => o.toString(16).padStart(2, "0"))
    .join("");
}

const incremente = (table: Compteurs, clef: string) => {
  table[clef] = (table[clef] ?? 0) + 1;
};

export async function POST(request: Request) {
  const navigateur = request.headers.get("user-agent") || "";
  if (!navigateur || ROBOTS.test(navigateur)) {
    return new Response(null, { status: 202 });
  }

  let corps: { chemin?: unknown; provenance?: unknown };
  try {
    corps = await request.json();
  } catch {
    return new Response(null, { status: 202 });
  }

  let chemin = typeof corps.chemin === "string" ? corps.chemin : "";
  chemin = chemin.split("?")[0].slice(0, 200);
  if (!chemin.startsWith("/") || chemin.startsWith("/admin") || chemin.startsWith("/api")) {
    return new Response(null, { status: 202 });
  }

  let provenance = typeof corps.provenance === "string" ? corps.provenance : "";
  provenance = provenance.replace(/^www\./, "").slice(0, 100).toLowerCase();
  if (HOTES_MAISON.test(provenance)) provenance = "";

  const jour = aujourdHui();

  try {
    /* Le carnet du jour : les empreintes déjà vues, pour compter les
       visiteurs sans compter deux fois la même personne. Réécrit à chaque
       aube, plafonné par prudence. La réponse à « est-ce quelqu'un de
       nouveau ? » sort d'ici : en cas de reprise, c'est le dernier
       passage — celui qui a été retenu — qui a le dernier mot. */
    const empreinte = await empreinteDe(request.headers, jour);
    let nouveauVisiteur = false;
    await modifie<{ date: string; empreintes: string[] }>(
      "jour-courant.json",
      { date: jour, empreintes: [] },
      (carnet) => {
        if (carnet.date !== jour) {
          carnet.date = jour;
          carnet.empreintes = [];
        }
        nouveauVisiteur =
          !carnet.empreintes.includes(empreinte) &&
          carnet.empreintes.length < 5000;
        if (!nouveauVisiteur) return null;
        carnet.empreintes.push(empreinte);
        return carnet;
      },
    );

    await modifie<Mois>(
      clefMois(jour),
      { jours: {}, pages: {}, pays: {}, provenances: {} },
      (mois) => {
        const duJour = (mois.jours[jour] ??= { vues: 0, visiteurs: 0 });
        duJour.vues += 1;
        if (nouveauVisiteur) duJour.visiteurs += 1;
        incremente(mois.pages, chemin);
        incremente(mois.pays, litPays(request.headers));
        incremente((mois.appareils ??= {}), litAppareil(request.headers));
        if (provenance) incremente(mois.provenances, provenance);
        return mois;
      },
    );
  } catch {
    /* Une vue perdue ne vaut pas une erreur montrée au lecteur. */
  }
  return new Response(null, { status: 202 });
}

/* ------------------------------------------------------------------ */

const tri = (table: Compteurs, garde: number) =>
  Object.entries(table)
    .sort((a, b) => b[1] - a[1])
    .slice(0, garde);

/* Le mot de passe des chiffres, tel que public/admin/stats.html le
   transmet — le même geste que serveur/frequentation.php, pour que le
   tableau de bord se comporte pareil en développement et en ligne. */
function motDePasseDeLEntete(entetes: Headers): string | null {
  const trouve = (entetes.get("authorization") ?? "")
    .trim()
    .match(/^Bearer\s+(.+)$/i);
  return trouve ? trouve[1] : null;
}

export async function GET(request: Request) {
  const essai = motDePasseDeLEntete(request.headers);
  if (!essai || !(await motDePasseValide(essai))) {
    return Response.json(
      { erreur: "Mot de passe requis pour consulter les chiffres." },
      { status: 401 },
    );
  }

  /* Trente jours glissants : le mois courant et le précédent suffisent. */
  const jour = aujourdHui();
  const dates: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toLocaleDateString("fr-CA", { timeZone: "Europe/Brussels" }));
  }

  const clefs = [...new Set([clefMois(dates[0]), clefMois(jour)])];
  const lus = await Promise.all(
    clefs.map((c) =>
      lis<Mois>(c, { jours: {}, pages: {}, pays: {}, provenances: {} }),
    ),
  );

  const pages: Compteurs = {};
  const pays: Compteurs = {};
  const provenances: Compteurs = {};
  const appareils: Compteurs = {};
  const parJour: Record<string, { vues: number; visiteurs: number }> = {};
  for (const m of lus) {
    Object.assign(parJour, m.jours);
    for (const [c, n] of Object.entries(m.pages)) pages[c] = (pages[c] ?? 0) + n;
    for (const [c, n] of Object.entries(m.pays)) pays[c] = (pays[c] ?? 0) + n;
    for (const [c, n] of Object.entries(m.provenances))
      provenances[c] = (provenances[c] ?? 0) + n;
    /* Les mois d'avant la mesure des appareils n'ont pas la case. */
    for (const [c, n] of Object.entries(m.appareils ?? {}))
      appareils[c] = (appareils[c] ?? 0) + n;
  }

  const serie = dates.map((d) => ({
    date: d,
    vues: parJour[d]?.vues ?? 0,
    visiteurs: parJour[d]?.visiteurs ?? 0,
  }));

  return Response.json({
    serie,
    totaux: {
      vues: serie.reduce((s, j) => s + j.vues, 0),
      visiteurs: serie.reduce((s, j) => s + j.visiteurs, 0),
      vuesAujourdHui: parJour[jour]?.vues ?? 0,
    },
    pages: tri(pages, 15),
    pays: tri(pays, 15),
    appareils: tri(appareils, 3),
    provenances: tri(provenances, 10),
  });
}
