/**
 * Country flag avatar. Neutral placeholder until flags are registered media served by the backend (`flagUrl`);
 * nothing is read from the demo assets.
 */
import { Flag as FlagIcon } from "lucide-react";

export function Flag({ code, size = 20, className = "" }: { code: string; size?: number; className?: string }) {
  return (
    <span
      data-flag={code}
      aria-hidden
      className={`inline-grid shrink-0 place-items-center rounded-[3px] bg-accent-soft text-muted ring-1 ring-black/20 ${className}`}
      style={{ width: size, height: Math.round(size * 0.75) }}
    >
      <FlagIcon size={Math.round(size * 0.55)} />
    </span>
  );
}
