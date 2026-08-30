import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { pages } from "@/lib/content";
import { CONTACT } from "@/lib/nav";

const [contacter, commander] = pages.contact;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Éditions du Cerisier — 20, rue du Cerisier, B-7033 Cuesmes (Mons), Belgique. Tél./Fax 00 32 65 31 34 44.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        intro="Pour toute question ou renseignement, notre équipe est à votre écoute."
        breadcrumb={[{ label: "Accueil", href: "/" }]}
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <div className="rounded-2xl border border-ecorce-100 bg-ecorce-50 p-6 sm:p-8">
            <Prose html={contacter.html} />
          </div>

          <div className="mt-6 rounded-2xl border border-ecorce-100 p-6 sm:p-8">
            <h2 className="font-serif text-lg font-semibold text-ecorce-900">
              {commander.title}
            </h2>
            <Prose html={commander.html} className="mt-3" />
            <Link
              href="/contact/commander"
              className="mt-4 inline-block text-sm font-semibold text-ecorce-600 underline decoration-cerise-400 decoration-2 underline-offset-4 hover:text-ecorce-900"
            >
              Passer commande →
            </Link>
          </div>

          <Link
            href="/envoyer-un-manuscrit"
            className="mt-6 block rounded-2xl border border-dashed border-ecorce-200 p-6 transition-colors hover:border-cerise-400 hover:bg-cerise-50"
          >
            <h2 className="font-serif text-lg font-semibold text-ecorce-900">
              Pour nous envoyer un manuscrit ?
            </h2>
            <p className="mt-1.5 text-sm text-ecorce-500">
              Lisez d’abord nos conditions de fonctionnement →
            </p>
          </Link>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-semibold text-ecorce-900">
            Nous écrire
          </h2>
          <p className="mt-2 text-ecorce-500">
            Vous pouvez aussi nous joindre directement au{" "}
            <a
              href={CONTACT.phoneHref}
              className="font-medium text-ecorce-700 underline decoration-cerise-400 decoration-2 underline-offset-2"
            >
              {CONTACT.phone}
            </a>
            .
          </p>
          <div className="mt-8">
            <ContactForm
              subjectPrefix="Contact site"
              subjects={[
                "Question générale",
                "Commande de livres",
                "Conditions libraires",
                "Presse",
                "Autre",
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
