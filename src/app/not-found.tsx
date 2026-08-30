import Link from "next/link";
import { Cerise } from "@/components/Cerisier";

/* La cerise est tombée de la branche : la page demandée n'est plus là. */
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center bg-ecorce-950 text-fleur-100">
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <Cerise
          filled
          className="entree h-12 w-12 rotate-[130deg] text-griotte-300"
        />
        <h1 className="titre-verger entree tempo-1 mt-8 text-3xl text-fleur-50 sm:text-4xl">
          Page introuvable
        </h1>
        <p className="entree tempo-2 mt-4 leading-relaxed text-fleur-200">
          Cette page n’existe pas ou a été déplacée lors de la refonte du site.
        </p>
        <div className="entree tempo-3 mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="bg-cerise-400 px-6 py-3 text-xs font-bold tracking-[0.16em] text-ecorce-900 uppercase transition-colors hover:bg-fleur-100"
          >
            Retour à l’accueil
          </Link>
          <Link
            href="/catalogue"
            className="border border-ecorce-600 px-6 py-3 text-xs font-bold tracking-[0.16em] text-fleur-200 uppercase transition-colors hover:border-cerise-400 hover:text-fleur-50"
          >
            Voir le catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
