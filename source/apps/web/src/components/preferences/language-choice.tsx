"use client";
/** Language preference: the languages the backend has wording for. Saved in a cookie; a `lang` in the address still wins. */
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "#/lib/copy/copy";
import { replaceQuery } from "#/lib/navigation/replace";
import { usePlaceCatalogue } from "#/lib/places/catalogue";
import { writeLang } from "#/lib/preferences/saved";

export function LanguageChoice() {
  const current = useLanguage();
  const { languages } = usePlaceCatalogue();
  const router = useRouter();
  const path = usePathname();
  const choose = (code: string) => {
    writeLang(code);
    // Drop an explicit `lang` from the address so the saved choice applies; the page is read again for the new language.
    const params = new URLSearchParams(location.search);
    params.delete("lang");
    replaceQuery(router, `${path}${params.size ? `?${params}` : ""}${location.hash}`);
    router.refresh();
  };
  return (
    <div role="radiogroup" className="mt-3 flex flex-wrap gap-2">
      {languages.map((l) => (
        <button
          key={l.code}
          role="radio"
          aria-checked={current === l.code}
          onClick={() => choose(l.code)}
          className={`max-w-full truncate rounded-md border px-4 py-2 text-sm ${current === l.code ? "border-accent bg-accent-soft" : "border-line"}`}
        >
          {l.nativeName ?? l.name}
        </button>
      ))}
    </div>
  );
}
