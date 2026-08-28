import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { pages } from "@/lib/content";

const entry = pages.commander[0];

export const metadata: Metadata = {
  title: "Nous commander",
  description:
    "Commandez les livres des Éditions du Cerisier par courriel, téléphone ou courrier. Envois franco de port.",
  alternates: { canonical: "/contact/commander" },
};

export default function CommanderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Nous commander"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="rounded-2xl border-l-4 border-cerise-400 bg-ecorce-50 p-6 sm:p-8">
          <h2 className="font-serif text-xl font-semibold text-ecorce-900">
            {entry.title}
          </h2>
          <Prose html={entry.html} className="mt-4" />
          <a
            href="/documents/cerisier_catalogue_2021.pdf"
            className="mt-5 inline-flex items-center gap-2.5 rounded-lg border border-ecorce-200 bg-white px-5 py-2.5 text-sm font-semibold text-ecorce-700 transition-colors hover:border-cerise-400"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M10 3v10m0 0 4-4m-4 4-4-4M3.5 15.5h13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Catalogue en PDF
          </a>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-semibold text-ecorce-900">
            Votre commande
          </h2>
          <p className="mt-2 text-ecorce-500">
            Indiquez les titres souhaités et votre adresse de livraison.
          </p>
          <div className="mt-8">
            <ContactForm
              subjectPrefix="Commande"
              subjects={["Commande de livres", "Conditions libraires"]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
