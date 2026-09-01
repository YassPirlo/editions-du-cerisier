import Script from "next/script";

/**
 * La mesure d'audience, sans Google et sans cookies : Umami. Le script ne
 * dépose rien chez le lecteur et ne collecte aucune donnée personnelle —
 * c'est ce qui dispense le site de bannière de consentement, et c'est
 * pourquoi il n'y en a plus. Visiteurs, pages lues et pays se consultent
 * sur cloud.umami.is (voir GUIDE-CONFIGURATION.md).
 *
 * Sans identifiant NEXT_PUBLIC_UMAMI_ID (aperçu GitHub Pages, poste
 * local), le composant s'efface. data-domains borne le comptage au vrai
 * domaine : les essais locaux et les aperçus ne polluent pas les chiffres.
 */

const ID_UMAMI = process.env.NEXT_PUBLIC_UMAMI_ID;
const SRC_UMAMI =
  process.env.NEXT_PUBLIC_UMAMI_SRC || "https://cloud.umami.is/script.js";

export function Statistiques() {
  if (!ID_UMAMI) return null;
  return (
    <Script
      src={SRC_UMAMI}
      data-website-id={ID_UMAMI}
      data-domains="editions-du-cerisier.be,www.editions-du-cerisier.be"
      strategy="afterInteractive"
    />
  );
}
