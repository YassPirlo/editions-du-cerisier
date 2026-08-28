import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { pages } from "@/lib/content";
import { CONTACT } from "@/lib/nav";

const entry = pages.manuscrit[0];

export const metadata: Metadata = {
  title: "Envoyer un manuscrit",
  description:
    "Les Éditions du Cerisier publient uniquement à compte d’éditeur. Conditions d’envoi et fonctionnement du comité de lecture.",
  alternates: { canonical: "/envoyer-un-manuscrit" },
};

export default function ManuscritPage() {
  return (
    <>
      <PageHeader
        eyebrow="Présentation"
        title="Envoyer un manuscrit"
        breadcrumb={[{ label: "Accueil", href: "/" }]}
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <Prose html={entry.html} />

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ligne-editoriale"
              className="rounded-lg border border-ecorce-200 px-5 py-2.5 text-sm font-semibold text-ecorce-700 transition-colors hover:border-cerise-400 hover:bg-cerise-50"
            >
              Notre ligne éditoriale
            </Link>
            <Link
              href="/catalogue"
              className="rounded-lg border border-ecorce-200 px-5 py-2.5 text-sm font-semibold text-ecorce-700 transition-colors hover:border-cerise-400 hover:bg-cerise-50"
            >
              Parcourir le catalogue
            </Link>
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-ecorce-100 bg-ecorce-50 p-6 sm:p-8">
            <h2 className="font-serif text-xl font-semibold text-ecorce-900">
              Nous écrire au sujet d’un manuscrit
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ecorce-600">
              Le manuscrit lui-même doit nous parvenir{" "}
              <strong className="font-semibold text-ecorce-900">
                en version papier, par courrier normal
              </strong>{" "}
              à l’adresse ci-dessous. Ce formulaire sert à nous annoncer votre envoi
              ou à poser une question préalable.
            </p>
            <address className="mt-4 rounded-lg border border-ecorce-200 bg-white px-4 py-3 text-sm leading-relaxed text-ecorce-700 not-italic">
              {CONTACT.name}
              <br />
              {CONTACT.street}
              <br />
              {CONTACT.city}
              <br />
              {CONTACT.country}
            </address>

            <div className="mt-7">
              <ContactForm
                subjectPrefix="Manuscrit"
                subjects={[
                  "Annonce d’envoi de manuscrit",
                  "Question sur la ligne éditoriale",
                  "Suivi d’un manuscrit envoyé",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
