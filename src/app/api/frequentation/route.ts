import { promises as fs } from "node:fs";
import path from "node:path";
import { motDePasseValide } from "@/lib/jeton";

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
 * Les comptes sont rangés en fichiers, à côté du site (dossier .data, ou
 * celui que désigne STATS_DIR) : rien à ouvrir, rien à payer. Sur un
 * hébergement sans disque persistant, ils repartiraient de zéro à chaque
 * déploiement — c'est le seul endroit du site qui demande un disque.
 */

type Compteurs = Record<string, number>;
type Mois = {
  jours: Record<string, { vues: number; visiteurs: number }>;
  pages: Compteurs;
  pays: Compteurs;
  provenances: Compteurs;
};

const ROBOTS =
  /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|pingdom|facebookexternalhit|preview|scan/i;

const HOTES_MAISON =
  /(^|\.)editions-du-cerisier\.be$|(^|\.)github\.io$|^localhost$/;

const DOSSIER = path.resolve(
  process.env.STATS_DIR || path.join(process.cwd(), ".data", "frequentation"),
);

async function lis<T>(fichier: string, defaut: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(DOSSIER, fichier), "utf8")) as T;
  } catch {
    return defaut;
  }
}

/* L'écriture passe par un fichier temporaire : une visite au mauvais
   moment ne doit pas laisser un JSON à moitié écrit. */
async function ecris(fichier: string, donnees: unknown) {
  const cible = path.join(DOSSIER, fichier);
  await fs.mkdir(path.dirname(cible), { recursive: true });
  const provisoire = `${cible}.${process.pid}.tmp`;
  await fs.writeFile(provisoire, JSON.stringify(donnees));
  await fs.rename(provisoire, cible);
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
       aube, plafonné par prudence. */
    const empreinte = await empreinteDe(request.headers, jour);
    const carnet = await lis<{ date: string; empreintes: string[] }>(
      "jour-courant.json",
      { date: jour, empreintes: [] },
    );
    if (carnet.date !== jour) {
      carnet.date = jour;
      carnet.empreintes = [];
    }
    const nouveauVisiteur =
      !carnet.empreintes.includes(empreinte) && carnet.empreintes.length < 5000;
    if (nouveauVisiteur) {
      carnet.empreintes.push(empreinte);
      await ecris("jour-courant.json", carnet);
    }

    const clef = clefMois(jour);
    const mois = await lis<Mois>(clef, {
      jours: {},
      pages: {},
      pays: {},
      provenances: {},
    });

    const duJour = (mois.jours[jour] ??= { vues: 0, visiteurs: 0 });
    duJour.vues += 1;
    if (nouveauVisiteur) duJour.visiteurs += 1;
    incremente(mois.pages, chemin);
    incremente(mois.pays, litPays(request.headers));
    if (provenance) incremente(mois.provenances, provenance);

    await ecris(clef, mois);
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
  const parJour: Record<string, { vues: number; visiteurs: number }> = {};
  for (const m of lus) {
    Object.assign(parJour, m.jours);
    for (const [c, n] of Object.entries(m.pages)) pages[c] = (pages[c] ?? 0) + n;
    for (const [c, n] of Object.entries(m.pays)) pays[c] = (pays[c] ?? 0) + n;
    for (const [c, n] of Object.entries(m.provenances))
      provenances[c] = (provenances[c] ?? 0) + n;
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
    provenances: tri(provenances, 10),
  });
}
