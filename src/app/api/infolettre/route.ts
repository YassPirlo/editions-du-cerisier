/**
 * L’inscription à l’infolettre. Le formulaire poste ici ; nous transmettons
 * à Brevo (liste BREVO_LIST_ID), qui garde le carnet d’adresses et d’où la
 * maison envoie ses campagnes — nouveautés, rencontres, salons. La clé
 * d’API reste côté serveur, c’est la seule raison d’être de cette route.
 *
 * Cette route ne participe pas à l’aperçu statique GitHub Pages : le
 * workflow l’écarte avant l’export (voir .github/workflows/pages.yml) et le
 * formulaire y affiche alors son message de repli.
 */

const COURRIEL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let corps: { courriel?: unknown; verger?: unknown };
  try {
    corps = await request.json();
  } catch {
    return Response.json({ erreur: "Requête illisible." }, { status: 400 });
  }

  /* Le champ « verger » est un pot de miel : invisible pour un lecteur,
     rempli par les robots à formulaires. On répond comme si tout allait
     bien — inutile de leur apprendre quoi que ce soit. */
  if (typeof corps.verger === "string" && corps.verger !== "") {
    return Response.json({ ok: true });
  }

  const courriel = typeof corps.courriel === "string" ? corps.courriel.trim() : "";
  if (!COURRIEL_VALIDE.test(courriel) || courriel.length > 200) {
    return Response.json(
      { erreur: "Cette adresse ne semble pas valide." },
      { status: 400 },
    );
  }

  const cle = process.env.BREVO_API_KEY;
  const liste = Number(process.env.BREVO_LIST_ID);
  if (!cle || !liste) {
    return Response.json(
      { erreur: "L’inscription n’est pas encore ouverte — écrivez-nous." },
      { status: 503 },
    );
  }

  const reponse = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": cle, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: courriel,
      listIds: [liste],
      /* Une adresse déjà connue rejoint simplement la liste, sans erreur. */
      updateEnabled: true,
    }),
  });

  /* 201 : créée ; 204 : déjà connue, mise à jour. Le reste est une panne. */
  if (reponse.status === 201 || reponse.status === 204) {
    return Response.json({ ok: true });
  }
  const detail = await reponse.text().catch(() => "");
  console.error(`Brevo répond ${reponse.status} : ${detail.slice(0, 300)}`);
  return Response.json(
    { erreur: "L’inscription n’a pas abouti — réessayez dans un instant." },
    { status: 502 },
  );
}
