import { getStore } from "@netlify/blobs";
import { jetonValide, litJetonDesCookies } from "@/lib/jeton";

/**
 * La fréquentation, comptée par la maison elle-même — aucun service tiers.
 *
 * POST : la balise du site (src/components/Statistiques.tsx) dépose une vue
 * — chemin + provenance. On y ajoute ici le jour (heure de Bruxelles), le
 * pays (l'en-tête géographique que Netlify joint à la requête) et une
 * empreinte de visiteur anonyme : un condensé à sens unique de
 * l'adresse IP et du navigateur, salé et daté — elle change chaque jour,
 * ne permet de suivre personne, et l'adresse elle-même n'est jamais
 * conservée. Pas de cookie, pas de donnée personnelle : c'est ce qui
 * dispense le site de bannière de consentement.
 *
 * GET : les agrégats pour le tableau de bord de l'admin
 * (public/admin/stats.html). Réservé aux éditeurs : le jeton de session
 * Netlify Identity est exigé et revérifié auprès du service.
 *
 * Le tout est rangé dans les Blobs de Netlify — le stockage attaché au
 * site, sans compte ni clé supplémentaires. En local ou sur l'aperçu
 * GitHub Pages, pas de Blobs : la route répond poliment qu'elle est de
 * repos.
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
  /(^|\.)editions-du-cerisier\.be$|\.netlify\.app$|(^|\.)github\.io$|^localhost$/;

const magasin = () => {
  try {
    return getStore({ name: "frequentation", consistency: "strong" });
  } catch {
    /* Pas de Blobs ici (poste local, aperçu statique) : on compte pour rien. */
    return null;
  }
};

/* Le jour, vu de Bruxelles — c'est le fuseau des lecteurs de la maison. */
const aujourdHui = () =>
  new Date().toLocaleDateString("fr-CA", { timeZone: "Europe/Brussels" });

const clefMois = (jour: string) => `mois/${jour.slice(0, 7)}.json`;

/* L'en-tête géographique de Netlify : du JSON, parfois encodé en base64
   selon le chemin — on tente les deux, et « ?? » sinon (le tableau de bord
   l'affiche en « Inconnu »). */
function litPays(entetes: Headers): string {
  const brut = entetes.get("x-nf-geo");
  if (!brut) return "??";
  for (const texte of [
    brut,
    (() => {
      try {
        return Buffer.from(brut, "base64").toString("utf8");
      } catch {
        return "";
      }
    })(),
  ]) {
    try {
      const geo = JSON.parse(texte);
      const code = geo?.country?.code;
      if (typeof code === "string" && /^[A-Z]{2}$/i.test(code)) {
        return code.toUpperCase();
      }
    } catch {}
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

  const blobs = magasin();
  if (!blobs) return new Response(null, { status: 202 });

  const jour = aujourdHui();

  try {
    /* Le carnet du jour : les empreintes déjà vues, pour compter les
       visiteurs sans compter deux fois la même personne. Réécrit à chaque
       aube, plafonné par prudence. */
    const empreinte = await empreinteDe(request.headers, jour);
    const carnet = ((await blobs.get("jour-courant.json", { type: "json" })) ?? {
      date: jour,
      empreintes: [],
    }) as { date: string; empreintes: string[] };
    if (carnet.date !== jour) {
      carnet.date = jour;
      carnet.empreintes = [];
    }
    const nouveauVisiteur =
      !carnet.empreintes.includes(empreinte) && carnet.empreintes.length < 5000;
    if (nouveauVisiteur) {
      carnet.empreintes.push(empreinte);
      await blobs.setJSON("jour-courant.json", carnet);
    }

    const clef = clefMois(jour);
    const mois = ((await blobs.get(clef, { type: "json" })) ?? {
      jours: {},
      pages: {},
      pays: {},
      provenances: {},
    }) as Mois;

    const duJour = (mois.jours[jour] ??= { vues: 0, visiteurs: 0 });
    duJour.vues += 1;
    if (nouveauVisiteur) duJour.visiteurs += 1;
    incremente(mois.pages, chemin);
    incremente(mois.pays, litPays(request.headers));
    if (provenance) incremente(mois.provenances, provenance);

    await blobs.setJSON(clef, mois);
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

export async function GET(request: Request) {
  /* Réservé à la maison : le cookie de session signé de la porte
     (/api/admin/session) fait foi — pas de session, pas de chiffres. */
  const connecte = await jetonValide(litJetonDesCookies(request.headers));
  if (!connecte) {
    return Response.json(
      { erreur: "Session requise ou expirée — repassez par la porte de l’admin." },
      { status: 401 },
    );
  }

  const blobs = magasin();
  if (!blobs) {
    return Response.json(
      { erreur: "Les statistiques ne vivent que sur le site en ligne." },
      { status: 503 },
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

  const vide: Mois = { jours: {}, pages: {}, pays: {}, provenances: {} };
  const clefs = [...new Set([clefMois(dates[0]), clefMois(jour)])];
  const lus = await Promise.all(
    clefs.map(async (c) => ((await blobs.get(c, { type: "json" })) ?? vide) as Mois),
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
