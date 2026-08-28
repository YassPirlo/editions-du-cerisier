import booksData from "@/data/books.json";
import collectionsData from "@/data/collections.json";
import pagesData from "@/data/pages.json";

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

export const books = booksData as Book[];
export const collections = collectionsData as Collection[];
export const pages = pagesData as Record<string, Entry[]>;

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
