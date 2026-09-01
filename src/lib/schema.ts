import { CONTACT } from "./nav";
import { excerpt, type Book } from "./content";

/**
 * Les données structurées (schema.org) servies aux moteurs : la maison,
 * le site, chaque livre et les fils d'Ariane. C'est ce qui permet à une
 * fiche de sortir en résultat enrichi — couverture, prix, ISBN — et à la
 * maison d'exister comme entité, pas seulement comme suite de pages.
 * Le composant qui les pose dans la page est DonneesStructurees.tsx.
 */

export const SITE_URL = "https://editions-du-cerisier.be";

/* Un @id stable par entité : les autres blocs y font référence sans se
   répéter (le livre pointe vers la maison, le site aussi). */
const ID_MAISON = `${SITE_URL}/#maison`;

export const MAISON = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ID_MAISON,
  name: "Éditions du Cerisier",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  foundingDate: "1985",
  description:
    "Maison d'édition coopérative et indépendante fondée en 1985 à Cuesmes (Mons) : des livres qui relatent, imaginent, témoignent des peuples, de leurs cultures, de leurs luttes, de leurs libertés.",
  email: CONTACT.email,
  telephone: "+32 65 31 34 44",
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.street,
    postalCode: "7033",
    addressLocality: "Cuesmes (Mons)",
    addressCountry: "BE",
  },
};

export const SITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#site`,
  url: SITE_URL,
  name: "Éditions du Cerisier",
  inLanguage: "fr-BE",
  publisher: { "@id": ID_MAISON },
};

/* Le prix affiché (« 20 € », « 14,50 € ») redevient un nombre ; s'il ne se
   laisse pas lire, la fiche part sans offre plutôt qu'avec une fausse. */
const litPrix = (price?: string): string | null => {
  const nombre = (price ?? "").match(/\d+(?:[.,]\d{1,2})?/);
  return nombre ? nombre[0].replace(",", ".") : null;
};

export function schemaLivre(b: Book) {
  const url = `${SITE_URL}/catalogue/${b.collection}/${b.slug}`;
  const prix = litPrix(b.price);
  const pages = parseInt(b.pages ?? "", 10);

  return {
    "@context": "https://schema.org",
    "@type": "Book",
    url,
    name: b.title,
    inLanguage: "fr",
    bookFormat: "https://schema.org/Paperback",
    publisher: { "@id": ID_MAISON },
    ...(b.text && { description: excerpt(b.text, 300) }),
    ...(b.cover && { image: `${SITE_URL}${b.cover}` }),
    ...(b.isbn && { isbn: b.isbn }),
    ...(Number.isFinite(pages) && pages > 0 && { numberOfPages: pages }),
    ...(prix && {
      offers: {
        "@type": "Offer",
        price: prix,
        priceCurrency: "EUR",
        url,
        seller: { "@id": ID_MAISON },
      },
    }),
  };
}

export function schemaFilAriane(
  etapes: { label: string; chemin: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: etapes.map((etape, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: etape.label,
      item: `${SITE_URL}${etape.chemin}`,
    })),
  };
}
