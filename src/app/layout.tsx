import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InvitationNewsletter } from "@/components/InvitationNewsletter";
import { Statistiques } from "@/components/Statistiques";
import { DonneesStructurees } from "@/components/DonneesStructurees";
import { MAISON, SITE } from "@/lib/schema";
import "./globals.css";

const inter = Inter({
  /* latin-ext : le ı sans point du mot « Cerısıer », dont les cerises font
     les points (voir .i-cerise). */
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

/* Les axes SOFT et WONK de Fraunces sont chargés pour les grands titres
   (.titre-verger) : le trait d'enseigne peinte à la main. Voir globals.css. */
const fraunces = Fraunces({
  /* latin-ext : le ı sans point du mot « Cerısıer », dont les cerises font
     les points (voir .i-cerise). */
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://editions-du-cerisier.be"),
  title: {
    default: "Éditions du Cerisier — Maison d’édition coopérative, Cuesmes",
    template: "%s — Éditions du Cerisier",
  },
  description:
    "Petites, mais obstinées, les Éditions du Cerisier rendent publics les livres qui relatent, imaginent, témoignent des peuples, de leurs cultures, de leurs luttes, de leurs libertés.",
  openGraph: {
    type: "website",
    locale: "fr_BE",
    siteName: "Éditions du Cerisier",
    title: "Éditions du Cerisier — Maison d’édition coopérative",
    description:
      "Maison d’édition coopérative et indépendante fondée en 1985 à Cuesmes (Mons).",
    url: "/",
    /* L'image des partages (réseaux, messageries) quand la page n'en
       apporte pas de plus précise — les fiches livre envoient leur
       couverture à la place. */
    images: [{ url: "/partage.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffc107",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  /* suppressHydrationWarning : le serveur ne connaît pas la préférence
     noir et blanc — data-encre est posé avant l'hydratation par le script
     en tête de body, et React s'alarmerait de cet attribut qu'il n'a pas
     peint lui-même. L'écart est voulu, l'attribut reste en place. */
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col font-sans">
        {/* L'édition noir et blanc, rétablie avant le premier coup de
            pinceau : le choix dort dans le navigateur (localStorage), ce
            script le réveille avant que la page ne se peigne — sans lui,
            elle arriverait en couleurs puis se raviserait d'un éclair.
            Voir BasculeEncre.tsx et globals.css. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("cerisier-encre")==="nb")document.documentElement.dataset.encre="nb"}catch(e){}`,
          }}
        />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-60 focus:rounded-md focus:bg-ecorce-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Aller au contenu
        </a>
        {/* Le grain du papier, posé sur toute la page (voir globals.css). */}
        <div className="grain" aria-hidden="true" />
        <Header />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <Footer />
        <InvitationNewsletter />
        {/* La mesure d'audience maison, sans cookies — voir
            src/components/Statistiques.tsx ; elle sait s'effacer. */}
        <Statistiques />
        {/* La maison et le site, décrits aux moteurs (schema.org). */}
        <DonneesStructurees donnees={MAISON} />
        <DonneesStructurees donnees={SITE} />
      </body>
    </html>
  );
}
