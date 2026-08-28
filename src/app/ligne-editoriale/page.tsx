import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/Prose";
import { collections, excerpt, pages } from "@/lib/content";

const entries = pages.ligneEditoriale;

export const metadata: Metadata = {
  title: "Ligne éditoriale",
  description: excerpt(entries[0].text, 155),
  alternates: { canonical: "/ligne-editoriale" },
};

export default function LigneEditorialePage() {
  return (
    <>
      <PageHeader
        eyebrow="Présentation"
        title="Ligne éditoriale"
        breadcrumb={[{ label: "Accueil", href: "/" }]}
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        {entries.map((e, i) => (
          <section key={e.title} className={i > 0 ? "mt-14" : ""}>
            {i > 0 && (
              <h2 className="mb-5 font-serif text-2xl font-semibold text-ecorce-900">
                {e.title}
              </h2>
            )}
            <Prose html={e.html} />
          </section>
        ))}

        <div className="mt-14 border-t border-ecorce-100 pt-8">
          <h2 className="text-xs font-semibold tracking-[0.12em] text-ecorce-400 uppercase">
            Parcourir les collections
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/catalogue/${c.slug}`}
                  className="inline-block rounded-full border border-ecorce-200 px-4 py-1.5 text-sm text-ecorce-600 transition-colors hover:border-cerise-400 hover:bg-cerise-50 hover:text-ecorce-900"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
