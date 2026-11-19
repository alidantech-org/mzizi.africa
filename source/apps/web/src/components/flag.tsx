/**
 * Country flag as an avatar. Images are the MIT-licensed flag-icons set, copied into public/flags so nothing is
 * fetched from another site and they work offline. Later these can come from the system's own assets.
 */
import { Globe } from "lucide-react";
import { country } from "#/lib/route";

export function Flag({ code, size = 20, className = "" }: { code: string; size?: number; className?: string }) {
  const c = country(code);
  if (!c) return <Globe size={size} className={`shrink-0 text-muted ${className}`} aria-hidden />;
  return <img src={`/flags/${c.code}.svg`} alt={`Flag of ${c.name}`} width={size} height={Math.round(size * 0.75)} className={`shrink-0 rounded-[3px] object-cover ring-1 ring-black/20 ${className}`} style={{ width: size, height: Math.round(size * 0.75) }} />;
}
