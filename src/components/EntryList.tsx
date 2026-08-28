import Image from "next/image";
import type { Entry } from "@/lib/content";
import { Prose } from "./Prose";

export function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ul className="space-y-10">
      {entries.map((e, i) => (
        <li
          key={`${e.title}-${i}`}
          className="grid gap-6 rounded-2xl border border-ecorce-100 bg-white p-6 sm:p-8 md:grid-cols-[auto_1fr]"
        >
          {e.images[0] ? (
            <div className="relative mx-auto h-56 w-40 shrink-0 md:mx-0 md:h-64 md:w-44">
              <Image
                src={e.images[0]}
                alt=""
                fill
                sizes="176px"
                className="rounded-lg object-contain"
              />
            </div>
          ) : null}
          <div className="min-w-0">
            <h2 className="font-serif text-xl leading-snug font-semibold text-balance text-ecorce-900 sm:text-2xl">
              {e.title}
            </h2>
            <Prose html={e.html} className="mt-4" />
          </div>
        </li>
      ))}
    </ul>
  );
}
