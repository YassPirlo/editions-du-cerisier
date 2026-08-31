/* Garde-fou de la contrainte cardinale : après migration + régénération,
   chaque texte affiché doit être identique à l'original du scrape.
   Compare src/data/*.json (régénérés) aux sauvegardes .migration-originaux/.

   Tolérances assumées (invisibles à l'écran) :
   - espaces typographiques exotiques du scrape (U+2000…U+202F) ≈ espace ;
   - entités HTML décodées (&#171; ≈ «, &amp; ≈ & dans les liens) ;
   - <i> devenu <em>, target/rel uniformisés sur les liens externes. */

import fs from "node:fs";
import path from "node:path";

const racine = path.join(import.meta.dirname, "..");
const lire = (dossier, f) =>
  JSON.parse(fs.readFileSync(path.join(racine, dossier, f), "utf8"));

const NOMMEES = {
  nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"',
  eacute: "é", egrave: "è", rsquo: "’", mdash: "—",
};
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, nom) => NOMMEES[nom.toLowerCase()] ?? m);

/* Texte visible : balises effacées (bloc → saut), entités décodées,
   toute la famille des espaces ramenée à l'espace simple. */
const visible = (html) =>
  decode(
    html
      .replace(/<\/?(p|br|h3|h4|li|ul|ol|blockquote)\b[^>]*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[\s  -   ]+/g, " ")
    .trim();

const texteNorm = (t) =>
  t.replace(/[\s  -   ]+/g, " ").trim();

let erreurs = 0;
const echec = (msg) => {
  erreurs++;
  if (erreurs <= 20) console.error("✗", msg);
};

/* Livres */
const avant = lire(".migration-originaux", "books.json");
const apres = lire("src/data", "books.json");
if (avant.length !== apres.length) echec(`livres : ${avant.length} → ${apres.length}`);
const parSlug = new Map(apres.map((b) => [b.slug, b]));
avant.forEach((a, i) => {
  const b = parSlug.get(a.slug);
  if (!b) return echec(`livre absent : ${a.slug}`);
  if (apres[i]?.slug !== a.slug) echec(`ordre du catalogue changé à l'index ${i}`);
  for (const champ of ["title", "collection", "collectionName", "cover", "isbn", "price", "pages"]) {
    if ((a[champ] ?? null) !== (b[champ] ?? null))
      echec(`${a.slug} : ${champ} « ${a[champ]} » → « ${b[champ]} »`);
  }
  if (visible(a.html) !== visible(b.html))
    echec(`${a.slug} : texte affiché modifié`);
  if (texteNorm(a.text) !== texteNorm(b.text))
    echec(`${a.slug} : champ text modifié`);
  if (JSON.stringify(a.links.map(decode)) !== JSON.stringify(b.links))
    echec(`${a.slug} : liens modifiés`);
});

/* Collections */
const cAvant = lire(".migration-originaux", "collections.json");
const cApres = lire("src/data", "collections.json");
cAvant.forEach((a, i) => {
  const c = cApres[i];
  if (!c || c.slug !== a.slug || c.id !== a.id || c.name !== a.name)
    return echec(`collection ${a.slug} : identité modifiée`);
  if (visible(a.descriptionHtml || "") !== visible(c.descriptionHtml || ""))
    echec(`collection ${a.slug} : description modifiée`);
});

/* Pages */
const pAvant = lire(".migration-originaux", "pages.json");
const pApres = lire("src/data", "pages.json");
for (const cle of Object.keys(pAvant)) {
  const ea = pAvant[cle];
  const eb = pApres[cle] || [];
  if (ea.length !== eb.length) {
    echec(`${cle} : ${ea.length} → ${eb.length} entrées`);
    continue;
  }
  ea.forEach((a, i) => {
    const b = eb[i];
    if (a.title !== b.title) echec(`${cle}#${i} : titre ou ordre modifié`);
    if (JSON.stringify(a.images) !== JSON.stringify(b.images))
      echec(`${cle}#${i} : images modifiées`);
    if (visible(a.html) !== visible(b.html))
      echec(`${cle}#${i} (${a.title.slice(0, 40)}) : texte affiché modifié`);
  });
}

if (erreurs) {
  console.error(`\n${erreurs} divergence(s) — migration à corriger.`);
  process.exit(1);
}
console.log("✓ Round-trip parfait : textes, ordres, liens et images intacts.");
