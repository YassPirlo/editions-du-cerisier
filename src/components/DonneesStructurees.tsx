/**
 * Pose un bloc de données structurées (JSON-LD) dans la page, comme le
 * recommande Next : une balise <script> native — c'est de la donnée, pas du
 * code à exécuter. Le « < » est échappé : le contenu vient de l'extraction
 * SPIP et, demain, du CMS — rien de ce qui s'y écrit ne doit pouvoir
 * refermer la balise.
 */
export function DonneesStructurees({ donnees }: { donnees: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(donnees).replace(/</g, "\\u003c"),
      }}
    />
  );
}
