import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/content";
import { excerpt } from "@/lib/content";

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/catalogue/${book.collection}/${book.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-ecorce-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-ecorce-200 hover:shadow-lg hover:shadow-ecorce-900/5 focus-visible:ring-2 focus-visible:ring-cerise-400 focus-visible:outline-none"
    >
      <div className="relative aspect-3/4 overflow-hidden bg-ecorce-50">
        {book.cover ? (
          <Image
            src={book.cover}
            alt={`Couverture de « ${book.title} »`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <span className="text-center font-serif text-sm leading-snug text-ecorce-300">
              {book.title}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.6875rem] font-semibold tracking-[0.1em] text-cerise-600 uppercase">
          {book.collectionName}
        </p>
        <h3 className="mt-1.5 font-serif text-base leading-snug font-semibold text-ecorce-900 group-hover:text-ecorce-700">
          {book.title}
        </h3>
        <p className="mt-2 line-clamp-4-safe text-sm leading-relaxed text-ecorce-500">
          {excerpt(book.text, 130)}
        </p>
        {(book.price || book.pages) && (
          <p className="mt-3 flex items-center gap-2 pt-1 text-xs text-ecorce-400">
            {book.pages && <span>{book.pages} p.</span>}
            {book.pages && book.price && <span aria-hidden="true">·</span>}
            {book.price && (
              <span className="font-medium text-ecorce-600">{book.price}</span>
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
