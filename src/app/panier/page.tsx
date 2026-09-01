import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContenuPanier } from "./ContenuPanier";

export const metadata: Metadata = {
  title: "Le panier",
  description:
    "Les livres mis de côté au fil de la visite — la commande part ensuite par courriel, comme toujours au Cerisier.",
  /* Le panier de chacun ne regarde pas les moteurs. */
  robots: { index: false, follow: false },
};

export default function PanierPage() {
  return (
    <>
      <PageHeader
        title="Le panier"
        intro="Les livres mis de côté au fil de la visite. La commande part par courriel — rien à payer en ligne, comme toujours."
        breadcrumb={[{ label: "Accueil", href: "/" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ContenuPanier />
      </div>
    </>
  );
}
