import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Les axes SOFT et WONK de Fraunces sont chargés pour les grands titres
   (.titre-verger) : le trait d'enseigne peinte à la main. Voir globals.css. */
const fraunces = Fraunces({
  subsets: ["latin"],
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
        <Header />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
