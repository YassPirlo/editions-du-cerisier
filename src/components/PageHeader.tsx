import Link from "next/link";

export function PageHeader({
  title,
  eyebrow,
  intro,
  breadcrumb,
}: {
  title: string;
  eyebrow?: string;
  intro?: string;
  breadcrumb?: { label: string; href: string }[];
}) {
  return (
    <div className="border-b border-ecorce-100 bg-gradient-to-b from-cerise-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {breadcrumb && (
          <nav aria-label="Fil d’Ariane" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ecorce-400">
              {breadcrumb.map((c) => (
                <li key={c.href} className="flex items-center gap-1.5">
                  <Link href={c.href} className="transition-colors hover:text-ecorce-700">
                    {c.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </li>
              ))}
              <li aria-current="page" className="text-ecorce-600">
                {title}
              </li>
            </ol>
          </nav>
        )}
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-cerise-600 uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance text-ecorce-900 sm:text-4xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ecorce-600">
            {intro}
          </p>
        )}
      </div>
    </div>
  );
}
