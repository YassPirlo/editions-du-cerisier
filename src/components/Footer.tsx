import Link from "next/link";
import { BasculeNuit } from "@/components/BasculeNuit";
import { Branche } from "@/components/Cerisier";
import { FormulaireInfolettre } from "@/components/FormulaireInfolettre";
import { collections } from "@/lib/content";
import { CONTACT } from "@/lib/nav";
import { CherryLogo } from "./CherryLogo";

/**
 * Le pied de page referme la frondaison ouverte par l'en-tête. La branche y
 * repasse, immobile cette fois : en bas de page on est arrivé, plus rien ne
 * dérive.
 */
export function Footer() {
  return (
    <footer className="deja-nuit relative mt-24 overflow-hidden border-t border-ecorce-800 bg-ecorce-950 text-fleur-200">
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-[20rem] w-[44rem] text-ecorce-900"
        aria-hidden="true"
      >
        <Branche className="h-full w-full -scale-x-100" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <CherryLogo className="h-8 w-8 text-fleur-300" />
            <span className="font-serif text-lg font-semibold text-fleur-50">
              Éditions du Cerisier
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-fleur-300">
            Société coopérative fondée en 1985. Des livres qui relatent, imaginent,
            témoignent des peuples, de leurs cultures, de leurs luttes, de leurs
            libertés.
          </p>

          {/* L'invitation en pop-up ne se montre qu'une fois par visiteur :
              c'est ici que l'inscription reste possible, sur chaque page et
              aussi longtemps qu'on veut. */}
          <div className="mt-8 max-w-sm">
            <h2 className="font-serif text-lg text-fleur-50">
              La lettre du Cerisier
            </h2>
            <FormulaireInfolettre
              idChamp="email-infolettre-pied"
              sombre
              intro={
                <p className="mt-2 text-sm leading-relaxed text-fleur-300">
                  Nos parutions et nos rencontres par courriel — quelques
                  lettres par an, rien d&rsquo;autre.
                </p>
              }
            />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg text-fleur-50">Collections</h2>
          <ul className="mt-4 space-y-2">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/catalogue/${c.slug}`}
                  className="text-sm text-fleur-300 underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-fleur-50 hover:decoration-cerise-400"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-lg text-fleur-50">Contact</h2>
          <address className="mt-4 space-y-1 text-sm leading-relaxed text-fleur-300 not-italic">
            <p>{CONTACT.street}</p>
            <p>{CONTACT.city}</p>
            <p>{CONTACT.country}</p>
            <p className="pt-2">
              <a
                href={CONTACT.phoneHref}
                className="transition-colors hover:text-fleur-50"
              >
                Tél./Fax {CONTACT.phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="break-all underline decoration-cerise-400 decoration-2 underline-offset-2 transition-colors hover:text-fleur-50"
              >
                {CONTACT.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="relative border-t border-ecorce-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-ecorce-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-1">
            <p>
              © {new Date().getFullYear()} Éditions du Cerisier — Société coopérative
            </p>
            {/* La signature de l'atelier : discrète, sans lien sortant — le
                site de la maison ne renvoie nulle part ailleurs. Une ligne à
                modifier, ici et nulle part ailleurs. */}
            <p className="text-ecorce-400">
              Conception et réalisation : Yassine Vitullo
            </p>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link href="/liens-pratiques" className="hover:text-fleur-100">
              Liens pratiques
            </Link>
            <Link href="/envoyer-un-manuscrit" className="hover:text-fleur-100">
              Envoyer un manuscrit
            </Link>
            <Link href="/confidentialite" className="hover:text-fleur-100">
              Confidentialité
            </Link>
            <BasculeNuit />
          </div>
        </div>
      </div>
    </footer>
  );
}
