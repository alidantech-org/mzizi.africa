/** A country's flag from its two-letter code (regional-indicator letters), with the name as the accessible label. Nothing is stored. */
export function Flag({ iso, name, size = 20 }: { iso: string | null | undefined; name: string; size?: number }) {
  if (!iso || iso.length !== 2) return null;
  const glyph = [...iso.toUpperCase()].map((letter) => String.fromCodePoint(0x1f1e6 + letter.charCodeAt(0) - 65)).join("");
  return (
    <span role="img" aria-label={name} style={{ fontSize: size, lineHeight: 1 }} className="inline-block shrink-0">
      {glyph}
    </span>
  );
}
