export function CherryLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M31 6c-6.5 2.4-10.2 6.8-11.8 12.4M31 6c3.4 3.2 5.2 6.4 5.6 9.8M31 6c-4.6-.6-8.6.4-12 2.8"
        stroke="var(--color-ecorce-500)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M19.2 18.4c-2.6 2.6-5 4.4-8 5.6M19.2 18.4c1.4 3 3.6 5.4 6.6 7"
        stroke="var(--color-ecorce-500)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="9.5" cy="31.5" r="7.5" fill="var(--color-cerise-400)" />
      <circle cx="30.5" cy="33.5" r="8.5" fill="var(--color-cerise-500)" />
      <circle cx="7" cy="29" r="2.2" fill="#fff" fillOpacity="0.5" />
      <circle cx="27.5" cy="30.5" r="2.6" fill="#fff" fillOpacity="0.45" />
    </svg>
  );
}
