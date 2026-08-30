import Link from "next/link";
import type { Book } from "@/lib/content";
import { epaisseurDe, Livre3D } from "./Livre3D";

/**
 * Un livre posé sur la table, pas une carte de logiciel : le volume en 3D,
 * puis le titre — et c'est tout. Le résumé se lit sur la fiche ; sur une
 * table de libraire, on ne lit pas les quatrièmes de couverture à distance.
 * Toute la vignette tend le livre vers le lecteur au survol (.groupe-livre).
 */
export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/catalogue/${book.collection}/${book.slug}`}
      className="groupe-livre group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-cerise-400"
    >
      <Livre3D
        src={book.cover}
        titre={book.title}
        collection={book.collectionName}
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
        epaisseur={epaisseurDe(book.pages)}
      />
      <h3 className="mt-6 font-serif text-[0.95rem] leading-snug font-semibold text-ecorce-900 transition-colors group-hover:text-griotte-500">
        {book.title}
      </h3>
      {/* Le folio sous le titre, jamais d'étiquette au-dessus : collection,
          pagination, prix — sur une seule ligne discrète. */}
      <p className="mt-1.5 text-xs text-ecorce-500 tabular-nums">
        {book.collectionName}
        {book.pages && <span> · {book.pages} p.</span>}
        {book.price && <span> · {book.price}</span>}
      </p>
    </Link>
  );
}
