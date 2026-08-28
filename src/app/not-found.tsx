import Link from "next/link";
import { CherryLogo } from "@/components/CherryLogo";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center sm:px-6">
      <CherryLogo className="h-14 w-14" />
      <h1 className="mt-6 font-serif text-3xl font-semibold text-ecorce-900">
        Page introuvable
      </h1>
      <p className="mt-3 text-ecorce-600">
        Cette page n’existe pas ou a été déplacée lors de la refonte du site.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-ecorce-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ecorce-700"
        >
          Retour à l’accueil
        </Link>
        <Link
          href="/catalogue"
          className="rounded-lg border border-ecorce-200 px-6 py-3 text-sm font-semibold text-ecorce-700 transition-colors hover:border-cerise-400 hover:bg-cerise-50"
        >
          Voir le catalogue
        </Link>
      </div>
    </div>
  );
}
