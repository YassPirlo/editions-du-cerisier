import type { MetadataRoute } from "next";

/* Exigé par l'export statique de l'aperçu GitHub Pages ; le build normal
   produit déjà ce fichier statiquement. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://editions-du-cerisier.be/sitemap.xml",
  };
}
