import Link from "next/link";
import { collections } from "@/lib/content";
import { CONTACT } from "@/lib/nav";
import { CherryLogo } from "./CherryLogo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ecorce-100 bg-ecorce-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <CherryLogo className="h-8 w-8" />
            <span className="font-serif text-lg font-semibold text-ecorce-900">
              Éditions du Cerisier
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ecorce-600">
            Société coopérative fondée en 1985. Des livres qui relatent, imaginent,
            témoignent des peuples, de leurs cultures, de leurs luttes, de leurs
            libertés.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.12em] text-ecorce-400 uppercase">
            Collections
          </h2>
          <ul className="mt-4 space-y-2">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/catalogue/${c.slug}`}
                  className="text-sm text-ecorce-600 transition-colors hover:text-ecorce-900"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.12em] text-ecorce-400 uppercase">
            Contact
          </h2>
          <address className="mt-4 space-y-1 text-sm leading-relaxed text-ecorce-600 not-italic">
            <p>{CONTACT.street}</p>
            <p>{CONTACT.city}</p>
            <p>{CONTACT.country}</p>
            <p className="pt-2">
              <a
                href={CONTACT.phoneHref}
                className="transition-colors hover:text-ecorce-900"
              >
                Tél./Fax {CONTACT.phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="break-all underline decoration-cerise-400 decoration-2 underline-offset-2 transition-colors hover:text-ecorce-900"
              >
                {CONTACT.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-ecorce-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-ecorce-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} Éditions du Cerisier — Société coopérative
          </p>
          <div className="flex gap-5">
            <Link href="/liens-pratiques" className="hover:text-ecorce-700">
              Liens pratiques
            </Link>
            <Link href="/envoyer-un-manuscrit" className="hover:text-ecorce-700">
              Envoyer un manuscrit
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
