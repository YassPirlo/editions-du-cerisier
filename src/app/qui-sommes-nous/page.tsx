import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { excerpt, pages } from "@/lib/content";

const entry = pages.quiSommesNous[0];

export const metadata: Metadata = {
  title: "Qui sommes-nous ?",
  description: excerpt(entry.text, 155),
  alternates: { canonical: "/qui-sommes-nous" },
};

export default function QuiSommesNousPage() {
  return (
    <>
      <PageHeader
        eyebrow="La maison"
        title="Qui sommes-nous ?"
        breadcrumb={[{ label: "Accueil", href: "/" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Prose html={entry.html} />

        <div className="mt-14 flex flex-wrap gap-3 border-t border-ecorce-100 pt-8">
          <Link
            href="/ligne-editoriale"
            className="rounded-lg border border-ecorce-200 px-5 py-2.5 text-sm font-semibold text-ecorce-700 transition-colors hover:border-cerise-400 hover:bg-cerise-50"
          >
            Ligne éditoriale
          </Link>
          <Link
            href="/ce-qu-en-dit-la-presse"
            className="rounded-lg border border-ecorce-200 px-5 py-2.5 text-sm font-semibold text-ecorce-700 transition-colors hover:border-cerise-400 hover:bg-cerise-50"
          >
            Ce qu’en dit la presse
          </Link>
        </div>
      </div>
    </>
  );
}
