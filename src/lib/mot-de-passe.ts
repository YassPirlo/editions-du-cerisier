/**
 * Le mot de passe de la maison, vérifié sans dépendance : Web Crypto
 * suffit, et le même code tourne partout où Next place ses routes.
 *
 * Il n'ouvre plus qu'une porte, celle des chiffres de fréquentation. Le
 * CMS a la sienne, tenue par DecapBridge. Ce fichier portait auparavant
 * une session signée en cookie, pour un écran de connexion maison que
 * Decap remplace — d'où son ancien nom, jeton.ts, sous lequel le
 * dépôt en garde l'historique.
 *
 * Réglage attendu (voir GUIDE-CONFIGURATION.md) : ADMIN_PASSWORD.
 */

const encodeur = new TextEncoder();

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
