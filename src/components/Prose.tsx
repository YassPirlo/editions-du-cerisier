export function Prose({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`prose-cerisier ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
