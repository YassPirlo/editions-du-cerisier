import { collections } from "./content";

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const nav: NavItem[] = [
  {
    label: "Présentation",
    href: "/",
    children: [
      { label: "Ligne éditoriale", href: "/ligne-editoriale" },
      { label: "Ce qu’en dit la presse", href: "/ce-qu-en-dit-la-presse" },
      { label: "Envoyer un manuscrit", href: "/envoyer-un-manuscrit" },
      { label: "Qui sommes-nous ?", href: "/qui-sommes-nous" },
    ],
  },
  {
    label: "À la une",
    href: "/a-la-une",
    children: [
      { label: "Actualités", href: "/a-la-une/actualites" },
      { label: "Nouveautés", href: "/a-la-une/nouveautes" },
      { label: "Lu dans la presse et sur le net", href: "/a-la-une/revue-de-presse" },
    ],
  },
  {
    label: "Catalogue",
    href: "/catalogue",
    children: collections.map((c) => ({
      label: c.name,
      href: `/catalogue/${c.slug}`,
    })),
  },
  {
    label: "Contact",
    href: "/contact",
    children: [
      { label: "Nous contacter", href: "/contact" },
      { label: "Nous commander", href: "/contact/commander" },
    ],
  },
  { label: "Liens pratiques", href: "/liens-pratiques" },
];

export const CONTACT = {
  name: "Éditions du Cerisier",
  street: "20, rue du Cerisier",
  city: "B-7033 Cuesmes (Mons)",
  country: "Belgique",
  phone: "00 32 (0)65 31 34 44",
  phoneHref: "tel:+3265313444",
  email: "editionsducerisier@skynet.be",
  people: "Jean Delval — Françoise Vercruysse",
  maps:
    "http://maps.google.be/maps?f=q&source=s_q&gl=be&hl=fr&g=Cuesmes%2C+Mons&q=editions+du+Cerisier&btnG=Recherche+Google+Maps",
};
