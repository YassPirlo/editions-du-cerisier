import {
  adminConfigure,
  COOKIE_SESSION,
  creeJeton,
  DUREE_SESSION_MS,
  jetonValide,
  litJetonDesCookies,
  motDePasseValide,
} from "@/lib/jeton";

/**
 * La session de l'administration — un seul mot de passe, celui de la
 * maison, posé dans les variables d'environnement (ADMIN_PASSWORD, voir
 * .env.example) ; pas de comptes, pas d'adresses. La session est un jeton
 * signé (HMAC, src/lib/jeton.ts) rangé dans un cookie httpOnly : sept
 * jours, puis on retape le mot de passe.
 *
 *   POST  { motDePasse }  → ouvre la session (compare en temps constant)
 *   GET                    → 204 si la session tient, 401 sinon
 *   DELETE                 → referme la session
 */

const enCookie = (valeur: string, dureeSecondes: number) =>
  `${COOKIE_SESSION}=${encodeURIComponent(valeur)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${dureeSecondes}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;

export async function POST(request: Request) {
  if (!adminConfigure()) {
    return Response.json(
      { erreur: "ADMIN_PASSWORD n’est pas posé (voir GUIDE-CONFIGURATION.md)." },
      { status: 503 },
    );
  }
  let corps: { motDePasse?: unknown };
  try {
    corps = await request.json();
  } catch {
    return Response.json({ erreur: "Requête illisible." }, { status: 400 });
  }
  const essai = typeof corps.motDePasse === "string" ? corps.motDePasse : "";
  if (!(await motDePasseValide(essai))) {
    /* Une demi-seconde de politesse contre l'essai en rafale. */
    await new Promise((r) => setTimeout(r, 500));
    return Response.json(
      { erreur: "Ce n’est pas le bon mot de passe." },
      { status: 401 },
    );
  }
  const jeton = await creeJeton();
  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": enCookie(jeton!, DUREE_SESSION_MS / 1000) },
  });
}

export async function GET(request: Request) {
  const valide = await jetonValide(litJetonDesCookies(request.headers));
  return new Response(null, { status: valide ? 204 : 401 });
}

export async function DELETE() {
  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": enCookie("", 0) },
  });
}
