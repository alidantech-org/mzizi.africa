"use client";
/** First-visit setup. Choose a country and a place (by search, by list or by your device's location), then your language and look. */
import { replaceQuery } from "#/lib/navigation/replace";
import { Check, ChevronDown, Crosshair, Loader2, MapPin, Palette, Search } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { copy } from "@mzizi/copy";
import { Flag } from "#/components/brand/flag";
import { ThemeSwitcher } from "#/components/preferences/theme-switcher";
import { buttonClass, DialogShell } from "#/components/ui/shells";
import { useCopy, useLanguage } from "#/lib/copy/copy";
import { demoSegments } from "#/lib/navigation/base";
import { usePlaceCatalogue, usePlaceNames } from "#/lib/places/catalogue";
import { locate } from "#/lib/places/locate";
import { writeHome, writeLang } from "#/lib/preferences/saved";

type Status = "none" | "asking" | "finding" | "found" | "outside" | "several" | "denied";
type Picked = { href: string; name: string; from: "device" | "search" };

/** Shows its content with a short slide and fade, so each new choice appears instead of jumping in. */
function Reveal({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div
      className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
      style={{ gridTemplateRows: show ? "1fr" : "0fr", opacity: show ? 1 : 0 }}
      aria-hidden={!show}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

/** A labelled part of the dialog. The label sits on top. */
const Part = ({ label, children }: { label: ReactNode; children: ReactNode }) => (
  <div className="py-2.5">
    <div className="mb-1.5 truncate text-xs font-medium text-muted">{label}</div>
    {children}
  </div>
);

/** Country picker with search: every country the backend lists, the one in the address already chosen. */
function CountrySelect({ value, onPick }: { value: string; onPick: (code: string) => void }) {
  const t = useCopy();
  const { countries } = usePlaceCatalogue();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && (e.stopPropagation(), setOpen(false));
    addEventListener("pointerdown", away);
    addEventListener("keydown", esc, true);
    return () => {
      removeEventListener("pointerdown", away);
      removeEventListener("keydown", esc, true);
    };
  }, [open]);
  const current = countries.find((c) => c.code === value);
  const list = countries.filter((c) => c.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setQ("");
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-9 w-full items-center gap-2.5 rounded-md border border-line px-3 text-sm hover:border-muted"
      >
        {current && <Flag code={current.code} size={16} />}
        <span className="min-w-0 truncate font-medium">{current?.name ?? t(copy.setup.country)}</span>
        <ChevronDown size={14} className={`ml-auto text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="floating absolute left-0 top-full z-30 mt-1.5 w-full rounded-lg border border-line bg-surface p-1.5">
          <div className="flex items-center gap-2 border-b border-line px-2 pb-1.5">
            <Search size={13} className="text-muted" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t(copy.setup.countrySearch)}
              aria-label={t(copy.setup.countrySearch)}
              className="h-7 w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>
          <ul role="listbox" aria-label={t(copy.setup.countryList)} className="mt-1 max-h-60 overflow-y-auto">
            {list.map((c) => (
              <li key={c.code} role="option" aria-selected={c.code === value}>
                <button
                  type="button"
                  onClick={() => {
                    onPick(c.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-accent-soft ${c.code === value ? "bg-accent-soft font-medium" : ""}`}
                >
                  <Flag code={c.code} size={16} />
                  <span className="min-w-0 flex-1 truncate">{c.name}</span>
                  {c.code === value && <Check size={13} className="shrink-0 text-accent" />}
                </button>
              </li>
            ))}
            {!list.length && <li className="truncate px-2.5 py-2 text-sm text-muted">{t(copy.setup.nothingMatches)}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SetupDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useCopy();
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams();
  const language = useLanguage();
  const { countries, entries, found, languages } = usePlaceCatalogue();
  const names = usePlaceNames();
  const urlCountry = demoSegments(path)[0] ?? "";
  const country = countries.some((c) => c.code === urlCountry) ? urlCountry : "";
  const served = countries.find((c) => c.code === country)?.served ?? false;

  const [step, setStep] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status>("none");
  const [picked, setPicked] = useState<Picked | null>(null);
  const [lang, setLang] = useState(language);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** The dialog and its search live in the address (`setup`, `find`), so the server renders every list. */
  const goTo = (target: string, patch: Record<string, string | null>) => {
    const params = new URLSearchParams(target.includes("?") ? target.split("?")[1] : "");
    if (!target.includes("?")) for (const [k, v] of sp.entries()) params.set(k, v);
    for (const [k, v] of Object.entries(patch)) v === null ? params.delete(k) : params.set(k, v);
    const base = target.split("?")[0];
    replaceQuery(router, `${base}${params.size ? `?${params}` : ""}`);
  };
  const pickCountry = (code: string) => {
    setPicked(null);
    setQ("");
    setStatus("none");
    goTo(`/${code}`, { find: null, setup: "1" });
  };
  const typed = (value: string) => {
    setQ(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => goTo(path, { find: value.trim().length >= 2 ? value.trim() : null, setup: "1" }), 250);
  };

  const places = q.trim().length >= 2 && found ? found.entries : entries.filter((e) => demoSegments(e.href).length === 2 && demoSegments(e.href)[0] === country);

  const useDevice = async () => {
    setStatus("asking");
    const found = await locate({ countryCode: country || undefined, languageCode: language });
    if (found.status !== "found") return setStatus(found.status);
    setPicked({ href: found.href, name: found.name, from: "device" });
    setStatus("found");
    if (found.countryCode !== country) goTo(`/${found.countryCode}`, { find: null, setup: "1" });
  };

  const choose = (href: string, name: string) => {
    setPicked({ href, name, from: "search" });
    setStatus("found");
  };

  const save = () => {
    const [c, ...trail] = demoSegments(picked?.href ?? `/${country}`);
    if (c) writeHome({ country: c, trail });
    writeLang(lang);
    const target = picked?.href ?? (country ? `/${country}` : "/");
    router.push(`${target}?lang=${lang}`);
    onClose();
  };

  const statusLine = (
    {
      none: <>{t(copy.setup.status.none)}</>,
      asking: (
        <>
          <Loader2 size={13} className="animate-spin" />
          {t(copy.setup.status.asking)}
        </>
      ),
      finding: (
        <>
          <Loader2 size={13} className="animate-spin" />
          {t(copy.setup.status.finding)}
        </>
      ),
      found: (
        <>
          <MapPin size={13} className="shrink-0 text-accent" />
          <span className="truncate">
            {t(picked?.from === "device" ? copy.setup.status.foundDevice : copy.setup.status.foundSearch, {
              place: picked?.name ?? "",
            })}
          </span>
        </>
      ),
      outside: <>{t(copy.setup.status.outside)}</>,
      several: <>{t(copy.setup.status.several)}</>,
      denied: <>{t(copy.setup.status.denied)}</>,
    } satisfies Record<Status, ReactNode>
  )[status];

  const stepName = step === 0 ? t(copy.setup.stepPlace) : t(copy.setup.stepLook);
  return (
    <DialogShell
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title={t(copy.setup.title)}
      description={t(copy.setup.step, { step: step + 1, total: 2, name: stepName })}
      icon={<MapPin size={16} />}
      maxWidth="max-w-xl"
      panelClassName="h-[min(660px,92vh)]"
      progress={(step + 1) / 2}
      footerLeft={
        <button onClick={onClose} className="text-sm text-muted hover:text-ink">
          {t(copy.setup.skip)}
        </button>
      }
      footerRight={
        <>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className={buttonClass.outline}>
              {t(copy.setup.back)}
            </button>
          )}
          {step < 1 ? (
            <button onClick={() => setStep(1)} className={buttonClass.primary}>
              {picked ? t(copy.setup.next) : t(copy.setup.skipPlace)}
            </button>
          ) : (
            <button onClick={save} className={buttonClass.primary}>
              {t(copy.setup.done)}
            </button>
          )}
        </>
      }
    >
      <div className="divide-y divide-line px-5 text-sm">
        {step === 0 && (
          <>
            <Part label={t(copy.setup.country)}>
              <CountrySelect value={country} onPick={pickCountry} />
            </Part>
            <Reveal show={!!country}>
              <Part label={t(copy.setup.findLocation)}>
                <div className="flex gap-2">
                  <button
                    onClick={useDevice}
                    disabled={status === "asking" || status === "finding"}
                    className="flex h-9 max-w-[45%] shrink-0 items-center gap-2 truncate rounded-md border border-line px-3 text-sm hover:bg-accent-soft disabled:opacity-60"
                  >
                    <Crosshair size={14} />
                    {status === "asking" ? t(copy.setup.waiting) : t(copy.setup.myLocation)}
                  </button>
                  <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border border-line px-3 focus-within:border-accent">
                    <Search size={14} className="shrink-0 text-muted" />
                    <input
                      value={q}
                      onChange={(e) => typed(e.target.value)}
                      placeholder={t(copy.setup.searchPlaces)}
                      aria-label={t(copy.setup.searchPlaces)}
                      className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
                    />
                  </label>
                </div>
                <p className="mt-2 flex min-w-0 items-center gap-1.5 truncate text-xs text-muted">{statusLine}</p>
              </Part>
              <Part label={t(copy.setup.places)}>
                {!served ? (
                  <p className="text-xs text-muted">{t(copy.setup.status.noData, { country: names.countryName(country) })}</p>
                ) : places.length ? (
                  <ul role="listbox" aria-label={t(copy.setup.places)} className="max-h-56 overflow-y-auto">
                    {places.map((p) => (
                      <li key={p.href} role="option" aria-selected={picked?.href === p.href}>
                        <button
                          type="button"
                          onClick={() => choose(p.href, p.name)}
                          className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-accent-soft ${picked?.href === p.href ? "bg-accent-soft font-medium" : ""}`}
                        >
                          <span className="min-w-0 flex-1 truncate">{p.name}</span>
                          <span className="shrink-0 text-xs text-muted">{p.kind}</span>
                          {picked?.href === p.href && <Check size={13} className="shrink-0 text-accent" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted">{t(copy.setup.status.noPlaces)}</p>
                )}
              </Part>
            </Reveal>
          </>
        )}
        {step === 1 && (
          <>
            <Part label={t(copy.setup.language)}>
              <ul role="listbox" aria-label={t(copy.setup.language)} className="flex flex-col gap-0.5">
                {languages.map((l) => (
                  <li key={l.code} role="option" aria-selected={lang === l.code}>
                    <button
                      type="button"
                      onClick={() => setLang(l.code)}
                      className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-accent-soft ${lang === l.code ? "bg-accent-soft font-medium" : ""}`}
                    >
                      <span className="min-w-0 truncate">{l.name}</span>
                      {l.nativeName && l.nativeName !== l.name && <span className="min-w-0 truncate text-xs text-muted">{l.nativeName}</span>}
                      {lang === l.code && <Check size={13} className="ml-auto text-accent" />}
                    </button>
                  </li>
                ))}
              </ul>
            </Part>
            <Part
              label={
                <span className="inline-flex items-center gap-1.5">
                  <Palette size={13} />
                  {t(copy.setup.look)}
                </span>
              }
            >
              <ThemeSwitcher />
            </Part>
          </>
        )}
      </div>
    </DialogShell>
  );
}
