"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const VARIANTS = [
  { href: "/apercu/livre", label: "Maquette de livre" },
  { href: "/apercu/affiche", label: "Affiche" },
  { href: "/apercu/verger", label: "Verger" },
];

export function VariantSwitcher() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5 sm:px-6">
        <span className="text-[0.68rem] tracking-[0.18em] text-neutral-400 uppercase">
          Aperçu · non publié
        </span>
        <nav className="flex flex-wrap gap-x-5 gap-y-1">
          {VARIANTS.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              aria-current={pathname === v.href ? "page" : undefined}
              className={`text-xs font-semibold tracking-[0.1em] uppercase transition-colors ${
                pathname === v.href
                  ? "text-cerise-400 underline decoration-2 underline-offset-4"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {v.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="ml-auto text-xs text-neutral-400 underline underline-offset-4 hover:text-white"
        >
          Version actuelle
        </Link>
      </div>
    </div>
  );
}
