import booksData from "@/data/books.json";
import collectionsData from "@/data/collections.json";
import pagesData from "@/data/pages.json";
import { nettoieIsbn, repareAncresVides } from "./reparation";

export type Book = {
  slug: string;
  title: string;
  collection: string;
  collectionName: string;
  cover: string | null;
  html: string;
  text: string;
  links: string[];
  isbn?: string;
  price?: string;
  pages?: string;
};

export type Collection = {
  id: number;
  slug: string;
  name: string;
  descriptionHtml: string;
  descriptionText: string;
};

export type Entry = {
  title: string;
  html: string;
  text: string;
  images: string[];
  links: string[];
};

/* Les artefacts d'extraction se réparent ici, au chargement — jamais dans
   les JSON, qui restent la copie fidèle du site d'origine. */
export const books: Book[] = (booksData as Book[]).map((b) => ({
  ...b,
  html: repareAncresVides(b.html),
  isbn: b.isbn ? nettoieIsbn(b.isbn) : b.isbn,
}));
export const collections = collectionsData as Collection[];
export const pages: Record<string, Entry[]> = Object.fromEntries(
  Object.entries(pagesData as Record<string, Entry[]>).map(
    ([rubrique, entries]): [string, Entry[]] => [
      rubrique,
      entries.map((e) => ({ ...e, html: repareAncresVides(e.html) })),
    ],
  ),
);

export const getCollection = (slug: string) =>
  collections.find((c) => c.slug === slug);

export const booksOf = (slug: string) =>
  books.filter((b) => b.collection === slug);

export const getBook = (collection: string, slug: string) =>
  books.find((b) => b.collection === collection && b.slug === slug);

export const excerpt = (text: string, max = 160) => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", max)) + "…";
};
