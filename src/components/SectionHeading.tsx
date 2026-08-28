type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ eyebrow, title, subtitle }: Props) {
  return (
    <div className="text-center">
      {eyebrow && (
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-cerise-600 uppercase">
          {eyebrow}
        </p>
      )}
      <div className="mt-3 flex items-center gap-5 sm:gap-8">
        <span className="h-px flex-1 bg-ecorce-200/70" aria-hidden="true" />
        <h2 className="font-serif text-2xl font-semibold text-balance text-ecorce-900 sm:text-3xl">
          {title}
        </h2>
        <span className="h-px flex-1 bg-ecorce-200/70" aria-hidden="true" />
      </div>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ecorce-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}
