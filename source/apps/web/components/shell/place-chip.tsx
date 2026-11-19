"use client";

import { useState } from "react";

import { PlaceSwitcher } from "#/components/shell/place-switcher.tsx";
import { Flag } from "#/components/site/ui/flag.tsx";
import { useLanguage } from "#/lib/site/i18n.tsx";

/** One slim line at the top of the sidebar: the country and place the visitor is in; pressing it opens the place search. */
export function PlaceChip({ countryName, countryIso, placeName, placePath }: { countryName: string; countryIso: string | null; placeName: string | null; placePath: string | null }) {
  const { tr } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-lg border border-[var(--border-default)] bg-surface-background px-3 py-2 text-left text-sm hover:bg-surface-sunken"
      >
        <Flag iso={countryIso} name={countryName} size={16} />
        <span className="min-w-0 flex-1 truncate font-semibold">{placeName ?? countryName}</span>
        <span className="text-xs text-content-muted">{open ? tr("Close") : tr("Change")}</span>
      </button>
      {open ? <div className="mt-2"><PlaceSwitcher currentPath={placePath} /></div> : null}
    </div>
  );
}
