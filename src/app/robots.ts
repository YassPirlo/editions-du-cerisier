import type { MetadataRoute } from "next";

/* Exigé par l'export statique de l'aperçu GitHub Pages ; le build normal
   produit déjà ce fichier statiquement. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    /* /guide s'adresse à la maison, pas aux lecteurs : la page reste en
       clair, mais n'a rien à faire dans les résultats de recherche. */
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/apercu/", "/api/", "/guide"],
    },
    sitemap: "https://editions-du-cerisier.be/sitemap.xml",
  };
}
