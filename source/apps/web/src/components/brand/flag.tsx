/** Country flag avatar: the registered flag file when the backend has one, otherwise a neutral marker. */
import { Flag as FlagIcon } from "lucide-react";
import { usePlaceCatalogue } from "#/lib/places/catalogue";

export function Flag({ code, size = 20, className = "" }: { code: string; size?: number; className?: string }) {
  const { countries } = usePlaceCatalogue();
  const url = countries.find((c) => c.code === code)?.flagUrl;
  const height = Math.round(size * 0.75);
  if (url)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        aria-hidden
        width={size}
        height={height}
        className={`shrink-0 rounded-[3px] object-cover ring-1 ring-black/20 ${className}`}
        style={{ width: size, height }}
      />
    );
  return (
    <span
      aria-hidden
      className={`inline-grid shrink-0 place-items-center rounded-[3px] bg-accent-soft text-muted ring-1 ring-black/20 ${className}`}
      style={{ width: size, height }}
    >
      <FlagIcon size={Math.round(size * 0.55)} />
    </span>
  );
}
