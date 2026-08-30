import Image from "next/image";
import type { Entry } from "@/lib/content";
import { Prose } from "./Prose";

/**
 * Les entrées d'actualité comme un sommaire de revue : des filets, du
 * papier, pas de cartes. Chaque entrée pousse à son arrivée dans le champ.
 */
export function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ul className="divide-y divide-ecorce-200 border-y border-ecorce-200">
      {entries.map((e, i) => (
        <li
          key={`${e.title}-${i}`}
          className="pousse grid gap-8 py-12 md:grid-cols-[auto_1fr]"
        >
          {e.images[0] ? (
            <div className="relative mx-auto h-56 w-40 shrink-0 md:mx-0 md:h-64 md:w-44">
              <Image
                src={e.images[0]}
                alt=""
                fill
                sizes="176px"
                className="object-contain drop-shadow-lg"
              />
            </div>
          ) : null}
          <div className="min-w-0">
            <h2 className="titre-verger text-xl leading-snug text-balance text-ecorce-900 sm:text-2xl">
              {e.title}
            </h2>
            <Prose html={e.html} className="mt-5" />
          </div>
        </li>
      ))}
    </ul>
  );
}
