/**
 * Le jeton de session d’administration, sans dépendance : « échéance.signature »
 * signé en HMAC-SHA-256 par Web Crypto — le même code tourne dans le proxy
 * (Edge) et dans les actions serveur (Node). Un seul compte, celui de la
 * maison : pas de table d’utilisateurs pour un éditeur coopératif de sept
 * personnes.
 *
 * Réglages attendus (voir .env.example) : ADMIN_PASSWORD obligatoire,
 * SESSION_SECRET facultatif (à défaut, le mot de passe sert de clé de
 * signature — le changer révoque alors toutes les sessions, ce qui est
 * plutôt une vertu).
 *
 * Ce fichier ne touche ni cookie ni requête : les aides qui lisent et posent
 * le cookie vivent dans admin.ts, qui importe next/headers — inutilisable
 * depuis le proxy.
 */

export const COOKIE_SESSION = "cerisier_session";
export const DUREE_SESSION_MS = 7 * 24 * 60 * 60 * 1000;

/* Le jeton tel qu'il voyage : dans l'en-tête Cookie des requêtes vers les
   routes de l'API (la porte de l'admin, les statistiques, le sésame du
   CMS). */
export function litJetonDesCookies(entetes: Headers): string | undefined {
  const brut = entetes.get("cookie") ?? "";
  const trouve = brut.match(new RegExp(`(?:^|;\\s*)${COOKIE_SESSION}=([^;]+)`));
  return trouve ? decodeURIComponent(trouve[1]) : undefined;
}

const encodeur = new TextEncoder();

const secret = () =>
  process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || null;

export const adminConfigure = () => Boolean(process.env.ADMIN_PASSWORD);

const cleHmac = (s: string) =>
  crypto.subtle.importKey(
    "raw",
    encodeur.encode(s),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

const enHex = (tampon: ArrayBuffer) =>
  Array.from(new Uint8Array(tampon))
    .map((o) => o.toString(16).padStart(2, "0"))
    .join("");

export async function creeJeton(): Promise<string | null> {
  const s = secret();
  if (!s) return null;
  const echeance = Date.now() + DUREE_SESSION_MS;
  const signature = await crypto.subtle.sign(
    "HMAC",
    await cleHmac(s),
    encodeur.encode(String(echeance)),
  );
  return `${echeance}.${enHex(signature)}`;
}

export async function jetonValide(jeton: string | undefined): Promise<boolean> {
  const s = secret();
  if (!s || !jeton) return false;
  const point = jeton.indexOf(".");
  if (point < 1) return false;
  const echeance = Number(jeton.slice(0, point));
  if (!Number.isFinite(echeance) || echeance < Date.now()) return false;
  const signature = jeton.slice(point + 1);
  if (!/^[0-9a-f]{64}$/.test(signature)) return false;
  const octets = new Uint8Array(
    signature.match(/../g)!.map((paire) => parseInt(paire, 16)),
  );
  return crypto.subtle.verify(
    "HMAC",
    await cleHmac(s),
    octets,
    encodeur.encode(String(echeance)),
  );
}

/* La comparaison passe par deux empreintes HMAC de même clé : le temps de
   comparaison ne dépend plus de la position du premier caractère faux. */
export async function motDePasseValide(essai: string): Promise<boolean> {
  const attendu = process.env.ADMIN_PASSWORD;
  if (!attendu || !essai) return false;
  const cle = await cleHmac(`comparaison:${attendu}`);
  const [a, b] = await Promise.all([
    crypto.subtle.sign("HMAC", cle, encodeur.encode(essai)),
    crypto.subtle.sign("HMAC", cle, encodeur.encode(attendu)),
  ]);
  return enHex(a) === enHex(b);
}
