import { jetonValide, litJetonDesCookies } from "@/lib/jeton";

/**
 * Le sésame du CMS. Decap (backend « github ») ouvre cette page en petite
 * fenêtre quand on clique « Se connecter » : au lieu du ballet OAuth de
 * GitHub, elle remet le jeton d'accès de la maison — un fine-grained token
 * limité au dépôt, posé dans GITHUB_CMS_TOKEN côté serveur — à quiconque a
 * passé la porte à mot de passe (cookie de session signé). Pas de session ?
 * La fenêtre demande elle-même le mot de passe, puis reprend : ainsi tout
 * fonctionne quel que soit le domaine par lequel on est arrivé.
 *
 * Le dialogue avec Decap suit le protocole des fournisseurs OAuth
 * maison : la fenêtre annonce « authorizing:github », l'admin répond,
 * la fenêtre remet « authorization:github:success:{token} » et se ferme.
 */

const STYLE = `
  body { margin: 0; display: flex; min-height: 100vh; align-items: center;
    justify-content: center; background: #fdf8f5; color: #241d13;
    font-family: ui-sans-serif, system-ui, sans-serif; }
  .carte { width: min(22rem, 90vw); border-top: 4px solid #ffc107;
    background: #fff; box-shadow: 0 18px 40px rgba(36,29,19,.14);
    padding: 1.8rem 1.6rem; }
  h1 { margin: 0 0 .4rem; font: 600 1.25rem Georgia, serif; }
  p { margin: .4rem 0 0; font-size: .88rem; color: #6f5838; line-height: 1.55; }
  label { display: block; margin-top: 1rem; font-size: .68rem; font-weight: 700;
    letter-spacing: .13em; text-transform: uppercase; color: #6f5838; }
  input { width: 100%; box-sizing: border-box; margin-top: .4rem; padding: .6rem .8rem;
    border: 1px solid #bfa483; font: inherit; }
  button { width: 100%; margin-top: 1.1rem; border: 0; background: #ffc107;
    padding: .75rem; font-size: .7rem; font-weight: 800; letter-spacing: .15em;
    text-transform: uppercase; cursor: pointer; }
  button:hover { background: #ffd75c; }
  .erreur { color: #a5112b; }
`;

const page = (corps: string) =>
  new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Administration — Éditions du Cerisier</title><style>${STYLE}</style></head><body>${corps}</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );

export async function GET(request: Request) {
  const jetonGitHub = process.env.GITHUB_CMS_TOKEN;
  if (!jetonGitHub) {
    return page(
      `<div class="carte"><h1>Il manque une clé</h1>
       <p>GITHUB_CMS_TOKEN n’est pas posé dans les variables d’environnement —
       le pas-à-pas est dans GUIDE-CONFIGURATION.md (étape 2).</p></div>`,
    );
  }

  const connecte = await jetonValide(litJetonDesCookies(request.headers));

  if (!connecte) {
    /* La fenêtre se garde toute seule : mot de passe, puis elle reprend. */
    return page(
      `<div class="carte">
        <h1>L’arrière-boutique</h1>
        <p>Le mot de passe de la maison, et le CMS s’ouvre.</p>
        <form id="f">
          <label for="mdp">Mot de passe</label>
          <input id="mdp" type="password" autocomplete="current-password" autofocus required />
          <p id="err" class="erreur" role="alert" hidden>Ce n’est pas le bon mot de passe.</p>
          <button type="submit">Entrer</button>
        </form>
      </div>
      <script>
        document.getElementById("f").addEventListener("submit", async function (e) {
          e.preventDefault();
          var r = await fetch("/api/admin/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ motDePasse: document.getElementById("mdp").value }),
          }).catch(function () { return null; });
          if (r && r.ok) { location.reload(); }
          else { document.getElementById("err").hidden = false; }
        });
      </script>`,
    );
  }

  return page(
    `<div class="carte"><h1>Un instant…</h1>
      <p>On remet la clé au CMS, cette fenêtre se referme d’elle-même.</p></div>
    <script>
      (function () {
        if (!window.opener) { document.querySelector("p").textContent = "Ouvrez cette page depuis l’admin."; return; }
        window.addEventListener("message", function (e) {
          window.opener.postMessage(
            "authorization:github:success:" + JSON.stringify({ token: ${JSON.stringify(jetonGitHub)}, provider: "github" }),
            e.origin,
          );
          window.close();
        }, { once: true });
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>`,
  );
}
