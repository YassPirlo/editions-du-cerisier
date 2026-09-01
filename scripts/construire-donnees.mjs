/* Reconstruit src/data/*.json depuis content/ (la source éditée dans
   Decap). Tourne en prebuild : le code du site continue de lire les
   mêmes JSON qu'avant le CMS, rien ne change côté composants.

   Sécurité : le Markdown passe par marked puis par une liste blanche
   de balises — Prose fait du dangerouslySetInnerHTML, rien d'autre ne
   doit pouvoir entrer. */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { RUBRIQUES } from "./rubriques.mjs";

const racine = path.join(import.meta.dirname, "..");

const BALISES = new Set([
  "p", "h3", "h4", "em", "strong", "br", "a", "ul", "ol", "li", "blockquote",
]);

function sanitize(html) {
  return html.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)\/?>/g,
    (m, balise, attrs) => {
      balise = balise.toLowerCase();
      if (!BALISES.has(balise)) return "";
      if (m.startsWith("</")) return `</${balise}>`;
      if (balise === "br") return "<br/>";
      if (balise === "a") {
        const href = (attrs.match(/href="([^"]*)"/) || [])[1] || "";
        if (!/^(https?:|mailto:|\/|#)/i.test(href)) return "<a>";
        const externe = /^https?:/i.test(href);
        return `<a href="${href}"${externe ? ' target="_blank" rel="noopener noreferrer"' : ""}>`;
      }
      return `<${balise}>`;
    },
  );
}

const NOMMEES = {
  nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"',
  eacute: "é", egrave: "è", rsquo: "’", mdash: "—",
};
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, nom) => NOMMEES[nom.toLowerCase()] ?? m);

/* Même règle que le scrape d'origine : les balises bloc deviennent des
   sauts de ligne, les balises inline s'effacent sans espace, les
   insécables deviennent des espaces simples. */
function texteDe(html) {
  return decode(
    html
      .replace(/<\/(p|h3|h4|li|blockquote)>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/ /g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const liensDe = (html) =>
  [...html.matchAll(/href="([^"]*)"/g)].map((m) => decode(m[1]));

function rendre(markdown) {
  /* gfm désactivé : pas d'autolien sur les URL/emails nus — le scrape
     d'origine ne liait que ce qui était explicitement lié. */
  return sanitize(marked.parse(markdown, { gfm: false, async: false })).trim();
}

const lireDossier = (dossier) => {
  const complet = path.join(racine, dossier);
  if (!fs.existsSync(complet)) return [];
  return fs
    .readdirSync(complet)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ nom: f.replace(/\.md$/, ""), ...matter(fs.readFileSync(path.join(complet, f), "utf8")) }))
    .sort((a, b) => (a.data.ordre ?? 0) - (b.data.ordre ?? 0) || a.nom.localeCompare(b.nom));
};

const ecrireJson = (fichier, donnees) =>
  fs.writeFileSync(
    path.join(racine, "src/data", fichier),
    JSON.stringify(donnees, null, 2) + "\n",
  );

/* Collections d'abord : les livres en dérivent collectionName. */
const collections = lireDossier("content/collections")
  .map((f) => {
    const html = rendre(f.content);
    return {
      id: f.data.id,
      slug: f.nom,
      name: f.data.name,
      descriptionHtml: html,
      descriptionText: texteDe(html),
    };
  });

const nomsCollections = Object.fromEntries(collections.map((c) => [c.slug, c.name]));

const books = lireDossier("content/livres").map((f) => {
  if (!nomsCollections[f.data.collection]) {
    throw new Error(`${f.nom} : collection inconnue « ${f.data.collection} »`);
  }
  const html = rendre(f.content);
  return {
    slug: f.nom,
    title: f.data.title,
    collection: f.data.collection,
    collectionName: nomsCollections[f.data.collection],
    cover: f.data.cover ?? null,
    html,
    text: texteDe(html),
    links: liensDe(html),
    ...(f.data.isbn ? { isbn: f.data.isbn } : {}),
    ...(f.data.price ? { price: f.data.price } : {}),
    ...(f.data.pages ? { pages: String(f.data.pages) } : {}),
  };
});

const pages = Object.fromEntries(
  Object.entries(RUBRIQUES).map(([cle, dossier]) => [
    cle,
    lireDossier(`content/pages/${dossier}`).map((f) => {
      const html = rendre(f.content);
      return {
        title: f.data.title,
        html,
        text: texteDe(html),
        images: f.data.images ?? [],
        links: liensDe(html),
      };
    }),
  ]),
);

ecrireJson("collections.json", collections);
ecrireJson("books.json", books);
ecrireJson("pages.json", pages);

/* L'index de la recherche embarquée (src/lib/recherche.ts) : la fiche
   allégée de chaque livre, texte compris — c'est lui qui permet de
   retrouver un titre malgré une faute, ou un livre par un mot de sa
   présentation. Chargé à la demande par la page /recherche, jamais par
   le reste du site. */
ecrireJson(
  "recherche-index.json",
  books.map((b) => ({
    slug: b.slug,
    collection: b.collection,
    collectionName: b.collectionName,
    title: b.title,
    cover: b.cover,
    price: b.price ?? null,
    pages: b.pages ?? null,
    texte: b.text.slice(0, 5000),
  })),
);
console.log(
  `Données reconstruites : ${books.length} livres, ${collections.length} collections, ${Object.values(pages).flat().length} entrées.`,
);
