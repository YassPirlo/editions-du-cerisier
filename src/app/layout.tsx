import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InvitationNewsletter } from "@/components/InvitationNewsletter";
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
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffc107",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans">
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
        {/* Formulaire statique jumeau du pop-up : Netlify ne détecte les
            formulaires qu'en scannant le HTML publié, et le pop-up n'y est
            pas (rendu client). */}
        <form name="newsletter" data-netlify="true" netlify-honeypot="bot-field" hidden>
          <input type="email" name="email" />
          <input name="bot-field" />
        </form>
      </body>
    </html>
  );
}
