/* Migration one-shot : éclate les JSON scrapés en fichiers Markdown
   éditables dans Decap (content/). À ne lancer qu'une fois — ensuite,
   content/ devient la source de vérité et construire-donnees.mjs
   régénère les src/data/*.json au build. */

import fs from "node:fs";
import path from "node:path";
import TurndownService from "turndown";
import { RUBRIQUES } from "./rubriques.mjs";

const racine = path.join(import.meta.dirname, "..");
const lireJson = (f) =>
  JSON.parse(fs.readFileSync(path.join(racine, "src/data", f), "utf8"));

const books = lireJson("books.json");
const collections = lireJson("collections.json");
const pages = lireJson("pages.json");

/* L'emphase Markdown ne traverse pas un saut de ligne dur : on ferme les
   <i>/<em>/<strong> ouverts avant chaque <br/> et on les rouvre après,
   en respectant l'imbrication. */
function scindeAuBr(html) {
  const pile = [];
  let out = "";
  for (const t of html.split(/(<[^>]+>)/)) {
    const m = t.match(/^<(\/?)(i|em|strong)>$/i);
    if (m) {
      if (m[1]) pile.pop();
      else pile.push(m[2].toLowerCase());
      out += t;
    } else if (/^<br\s*\/?>$/i.test(t) && pile.length) {
      out +=
        [...pile].reverse().map((x) => `</${x}>`).join("") +
        "<br/>" +
        pile.map((x) => `<${x}>`).join("");
    } else {
      out += t;
    }
  }
  return out;
}

const td = new TurndownService({
  headingStyle: "atx",
  emDelimiter: "*",
  strongDelimiter: "**",
  bulletListMarker: "-",
});

/* Une valeur JSON est du YAML valide : l'échappement est garanti. */
const y = (v) => JSON.stringify(v);

const slugifie = (t) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "entree";

const ecrit = (fichier, contenu) => {
  fs.mkdirSync(path.dirname(fichier), { recursive: true });
  fs.writeFileSync(fichier, contenu);
};

if (process.argv[1] === import.meta.filename) {
  /* Livres */
  books.forEach((b, i) => {
    let fm = `---\ntitle: ${y(b.title)}\ncollection: ${y(b.collection)}\n`;
    if (b.cover) fm += `cover: ${y(b.cover)}\n`;
    if (b.isbn) fm += `isbn: ${y(b.isbn)}\n`;
    if (b.price) fm += `price: ${y(b.price)}\n`;
    if (b.pages) fm += `pages: ${y(b.pages)}\n`;
    fm += `ordre: ${(i + 1) * 10}\n---\n\n`;
    ecrit(
      path.join(racine, "content/livres", `${b.slug}.md`),
      fm + td.turndown(scindeAuBr(b.html)) + "\n",
    );
  });
  console.log(`${books.length} livres → content/livres/`);

  /* Collections */
  collections.forEach((c, i) => {
    const fm = `---\nid: ${c.id}\nname: ${y(c.name)}\nordre: ${(i + 1) * 10}\n---\n\n`;
    ecrit(
      path.join(racine, "content/collections", `${c.slug}.md`),
      fm + (c.descriptionHtml ? td.turndown(scindeAuBr(c.descriptionHtml)) + "\n" : ""),
    );
  });
  console.log(`${collections.length} collections → content/collections/`);

  /* Rubriques de pages */
  let total = 0;
  for (const [cle, dossier] of Object.entries(RUBRIQUES)) {
    (pages[cle] || []).forEach((e, i) => {
      let fm = `---\ntitle: ${y(e.title)}\nordre: ${(i + 1) * 10}\n`;
      if (e.images.length) {
        fm += "images:\n" + e.images.map((img) => `  - ${y(img)}`).join("\n") + "\n";
      }
      fm += "---\n\n";
      const nom = `${String(i + 1).padStart(3, "0")}-${slugifie(e.title)}.md`;
      ecrit(
        path.join(racine, "content/pages", dossier, nom),
        fm + td.turndown(scindeAuBr(e.html)) + "\n",
      );
      total++;
    });
  }
  console.log(`${total} entrées → content/pages/`);
}
