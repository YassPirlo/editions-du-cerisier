"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/nav";
import { CherryLogo } from "./CherryLogo";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-ecorce-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <CherryLogo className="h-9 w-9" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-semibold tracking-tight text-ecorce-900">
              Éditions du Cerisier
            </span>
            <span className="mt-0.5 text-[0.6875rem] tracking-[0.14em] text-ecorce-400 uppercase">
              Cuesmes · Belgique
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-ecorce-900"
                    : "text-ecorce-600 hover:text-ecorce-900"
                }`}
              >
                {item.label}
                {item.children && (
                  <svg
                    viewBox="0 0 12 12"
                    className="h-2.5 w-2.5 transition-transform group-hover:rotate-180"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 4.5 6 8.5 10 4.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </Link>
              <span
                className={`absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-cerise-400 transition-transform duration-200 ${
                  isActive(item.href) ? "scale-x-100" : "scale-x-0"
                }`}
              />
              {item.children && (
                <div className="invisible absolute top-full left-0 min-w-56 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="overflow-hidden rounded-xl border border-ecorce-100 bg-white py-1.5 shadow-lg shadow-ecorce-900/5">
                    {item.children.map((child) => (
                      <li key={child.href + child.label}>
                        <Link
                          href={child.href}
                          className="block px-4 py-2 text-sm text-ecorce-600 transition-colors hover:bg-cerise-50 hover:text-ecorce-900"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="-mr-1 rounded-md p-2 text-ecorce-700 transition-colors hover:bg-ecorce-50 lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-ecorce-100 bg-white lg:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-ecorce-50 last:border-0">
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={`flex-1 py-3.5 text-base font-medium ${
                      isActive(item.href) ? "text-ecorce-900" : "text-ecorce-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((v) => (v === item.href ? null : item.href))
                      }
                      aria-expanded={expanded === item.href}
                      aria-label={`Afficher les sous-rubriques de ${item.label}`}
                      className="p-3 text-ecorce-400"
                    >
                      <svg
                        viewBox="0 0 12 12"
                        className={`h-3 w-3 transition-transform ${
                          expanded === item.href ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <path
                          d="M2 4.5 6 8.5 10 4.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {item.children && expanded === item.href && (
                  <ul className="pb-2 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href + child.label}>
                        <Link
                          href={child.href}
                          className="block border-l-2 border-cerise-200 py-2.5 pl-4 text-[0.9375rem] text-ecorce-600"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
