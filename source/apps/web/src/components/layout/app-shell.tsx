"use client";
/** Sidebar, top bar and mobile drawer. */
import {
  BarChart3,
  Lock,
  Building2,
  ChevronDown,
  Coins,
  Gavel,
  GitCompare,
  Home,
  Landmark,
  Layers,
  Library,
  MapPin,
  Network,
  PanelLeft,
  PanelLeftOpen,
  Triangle,
  Users,
  Vote,
  X,
} from "lucide-react";
import Link from "#/components/navigation/demo-link";
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { SearchDialog } from "#/components/navigation/search";
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
import { usePlaceCatalogue, usePlaceNames } from "#/lib/places/catalogue";
import { initPrefs, setCountry, usePrefsInit } from "#/lib/preferences/prefs";
import { COOKIES, GROUPS, encodeGroups, encodeSide, writeCookie, type Side } from "#/lib/preferences/pref-cookies";
import { FlagPalette } from "#/components/preferences/flag-palette";
import { VIEWS, type ViewId } from "#/lib/navigation/route";
import { useCtx, useNav } from "#/lib/navigation/use-ctx";
import { Logo } from "#/components/brand/logo";
import { ScrollKeeper } from "#/components/navigation/scroll-keeper";
import { LanguageSwitcher } from "#/components/preferences/language-switcher";
import { LocationSwitcher } from "#/components/navigation/location-switcher";
import { SettingsMenu } from "#/components/preferences/settings-menu";
import { HelpMenu } from "#/components/layout/help-menu";
import { SavedMenu } from "#/components/layout/saved-menu";
import { HoverSpeech, VoiceEffects } from "#/components/accessibility/voice-bar";
import { AppbarMenu } from "#/components/layout/appbar-menu";
import { SetupGate } from "#/components/preferences/setup-gate";
import { ListRefresh } from "#/lib/navigation/list-refresh";

const icons: Record<ViewId, typeof Home> = {
  overview: MapPin,
  leaders: Users,
  elections: Vote,
  parliament: Landmark,
  institutions: Building2,
  arms: Triangle,
  power: Network,
  law: Gavel,
  finance: Coins,
  suppliers: Layers,
  statistics: BarChart3,
  compare: GitCompare,
  sources: Library,
};

const groupsOrder = GROUPS;
/** Law, leadership and institutions are the Government links; the arms and power pages are reached from Leadership. */
const sidebar: ViewId[] = [
  "elections",
  "parliament",
  "law",
  "leaders",
  "institutions",
  "finance",
  "suppliers",
  "statistics",
  "compare",
];

/** A link this place cannot open. It stays in the sidebar, greyed out and disabled, and says why on hover, focus or tap. */
function DisabledItem({ label, Icon, rail, reason }: { label: string; Icon: typeof Home; rail: boolean; reason: string }) {
  const [tip, setTip] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLButtonElement>(null);
  const id = useId();
  const t = useCopy();
  const show = () => {
    const r = ref.current!.getBoundingClientRect();
    setTip({ top: r.top + r.height / 2, left: r.right + 10 });
  };
  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-disabled="true"
        aria-describedby={id}
        onMouseEnter={show}
        onMouseLeave={() => setTip(null)}
        onFocus={show}
        onBlur={() => setTip(null)}
        onClick={show}
        className={`flex h-9 w-full cursor-not-allowed items-center gap-3 rounded-md text-sm text-muted opacity-45 ${rail ? "justify-center" : "px-3"}`}
      >
        <Icon size={17} className="shrink-0" />
        {!rail && (
          <>
            <span className="truncate">{label}</span>
            <Lock size={12} className="ml-auto shrink-0" />
          </>
        )}
      </button>
      <span id={id} className="sr-only">
        {t(copy.shell.unavailable.description, { label, reason })}
      </span>
      {tip &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            style={{ top: tip.top, left: tip.left }}
            className="floating fixed z-[80] w-64 -translate-y-1/2 rounded-lg border border-line bg-surface p-3 text-xs leading-relaxed"
          >
            <b className="mb-1 block text-sm text-ink">{t(copy.shell.unavailable.title, { label })}</b>
            <span className="text-muted">{reason}</span>
          </div>,
          document.body,
        )}
    </>
  );
}

function NavLinks({ rail, onNavigate }: { rail: boolean; onNavigate: () => void }) {
  const nav = useNav();
  const t = useCopy();
  const names = usePlaceNames();
  const { navigation } = usePlaceCatalogue();
  const reasonText = (v: ViewId) =>
    t(copy.shell.unavailable.noData, { view: t(copy.shell.link[v]), country: names.countryName(nav.ctx.country) });
  const groupLabel = (g: string) => t(copy.shell.group[g.toLowerCase() as "politics" | "government" | "money" | "data"]);
  const [closed, setClosed] = useState<string[]>(usePrefsInit().groups);
  const toggle = (g: string) =>
    setClosed((c) => {
      const n = c.includes(g) ? c.filter((x) => x !== g) : [...c, g];
      writeCookie(COOKIES.groups, encodeGroups(n));
      return n;
    });

  const item = (key: string, href: string, label: string, Icon: typeof Home, active: boolean) => (
    <Link
      key={key}
      href={href}
      onClick={onNavigate}
      title={rail ? label : undefined}
      aria-label={rail ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={`flex h-9 items-center gap-3 rounded-md text-sm ${rail ? "justify-center" : "px-3"} ${active ? "bg-accent-soft font-medium text-ink" : "text-muted hover:bg-accent-soft hover:text-ink"}`}
    >
      <Icon size={17} className="shrink-0" />
      {!rail && <span className="truncate">{label}</span>}
    </Link>
  );
  const place = { country: nav.ctx.country, trail: nav.ctx.trail };
  const placeName = names.nameOf(place);
  return (
    <nav className="flex flex-col gap-0.5 p-2" aria-label={t(copy.shell.main)}>
      {/* The place you are in is the home: one link, named after it. */}
      {item("overview", nav.viewHref("overview"), placeName, Home, nav.ctx.explorer && nav.ctx.view === "overview")}
      {groupsOrder.map((g) => {
        const views = sidebar.filter((v) => VIEWS[v].group === g);
        const open = rail || !closed.includes(g);
        return (
          <div key={g} className="mt-2">
            {rail ? (
              <div className="mx-2 mb-1.5 border-t border-line" />
            ) : (
              <button
                onClick={() => toggle(g)}
                aria-expanded={open}
                className="flex w-full items-center justify-between rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted hover:text-ink"
              >
                <span className="min-w-0 truncate">{groupLabel(g)}</span>
                <ChevronDown size={12} className={`shrink-0 transition-transform ${open ? "" : "-rotate-90"}`} />
              </button>
            )}
            {open && (
              <div className="flex flex-col gap-0.5">
                {views.map((v) => {
                  const label = t(copy.shell.link[v]);
                  const unavailable = navigation[v] === false; // never removed: a subject with no recorded data is greyed out with a reason
                  return unavailable ? (
                    <DisabledItem key={v} label={label} Icon={icons[v]} rail={rail} reason={reasonText(v)} />
                  ) : (
                    item(
                      v,
                      nav.viewHref(v),
                      label,
                      icons[v],
                      nav.ctx.explorer &&
                        (nav.ctx.view === v || (v === "leaders" && (nav.ctx.view === "arms" || nav.ctx.view === "power"))),
                    )
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

const Divider = () => <span aria-hidden className="mx-1 h-5 w-px bg-line" />;

/** Keeps the preferences store told which country you are in, so the flag palette switches on and off with it. */
function CountryTheme() {
  const { country, explorer } = useCtx();
  // Only a place page can change the active country. The welcome and preferences pages leave country and theme alone.
  useEffect(() => {
    if (explorer) setCountry(country);
  }, [country, explorer]);
  return null;
}

/** The actions on the right of the top bar: language, appearance, saved places and help. */
function Actions() {
  return (
    <>
      <Suspense>
        <LanguageSwitcher />
      </Suspense>
      <SettingsMenu placement="bottom" />
      <Divider />
      <Suspense>
        <SavedMenu />
      </Suspense>
      <Divider />
      <Suspense>
        <HelpMenu />
      </Suspense>
    </>
  );
}

const RAIL = 56;
const clampW = (w: number) => Math.max(200, Math.min(380, w));

export function AppShell({ children }: { children: ReactNode }) {
  const t = useCopy();
  const init = usePrefsInit();
  const [side, setSide] = useState<Side>(init.side);
  const [drawer, setDrawer] = useState(false);
  const [dragging, setDragging] = useState(false);
  const path = usePathname();
  const start = useRef(0);

  useEffect(() => setDrawer(false), [path]);
  useEffect(() => {
    initPrefs(init);
  }, [init]);
  const save = useCallback((next: Side) => {
    setSide(next);
    writeCookie(COOKIES.side, encodeSide(next));
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        save({ ...side, mode: side.mode === "expanded" ? "hidden" : "expanded" });
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [side, save]);

  const width = side.mode === "hidden" ? 0 : side.mode === "rail" ? RAIL : side.w;
  const rail = side.mode === "rail";

  const onDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(true);
    start.current = side.mode === "expanded" ? side.w : RAIL;
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const x = e.clientX;
    if (x < 90) setSide((s) => ({ ...s, mode: "hidden" }));
    else if (x < 150) setSide((s) => ({ ...s, mode: "rail" }));
    else setSide({ w: clampW(x), mode: "expanded" });
  };
  const onUp = () => {
    setDragging(false);
    save(side);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft")
      save(
        side.mode === "expanded"
          ? side.w <= 210
            ? { ...side, mode: "rail" }
            : { ...side, w: clampW(side.w - 16) }
          : { ...side, mode: "hidden" },
      );
    if (e.key === "ArrowRight")
      save(
        side.mode === "hidden"
          ? { ...side, mode: "rail" }
          : side.mode === "rail"
            ? { ...side, mode: "expanded" }
            : { ...side, w: clampW(side.w + 16) },
      );
  };

  const header = (compact: boolean) => (
    <div
      className={`group/head flex h-12 shrink-0 items-center border-b border-line ${compact ? "justify-center" : "justify-between px-2 sm:px-3"}`}
    >
      {compact ? (
        // Minimised: the mark turns into the expand button while the pointer is over the header.
        <>
          <Link
            href="/"
            className="grid size-9 place-items-center group-hover/head:hidden group-focus-within/head:hidden"
            aria-label={t(copy.shell.home)}
          >
            <Logo compact markSize={28} />
          </Link>
          <button
            onClick={() => save({ ...side, mode: "expanded" })}
            aria-label={t(copy.shell.sidebar.expand)}
            title={t(copy.shell.sidebar.expand)}
            className="hidden size-9 place-items-center rounded-md text-muted hover:bg-accent-soft hover:text-ink group-hover/head:grid group-focus-within/head:grid"
          >
            <PanelLeftOpen size={18} />
          </button>
        </>
      ) : (
        <>
          <Link href="/" className="flex items-center gap-2" aria-label={t(copy.shell.home)}>
            <Logo compact={false} />
          </Link>
          <button
            onClick={() => save({ ...side, mode: "rail" })}
            aria-label={t(copy.shell.sidebar.minimise)}
            title={t(copy.shell.sidebar.minimise)}
            className="hidden size-8 place-items-center rounded-md text-muted hover:bg-accent-soft hover:text-ink lg:grid"
          >
            <PanelLeft size={17} />
          </button>
        </>
      )}
    </div>
  );
  const footer = (compact: boolean) => (
    <div className={`flex h-12 shrink-0 items-center border-t border-line ${compact ? "justify-center" : "px-2"}`}>
      <Suspense>
        <LocationSwitcher compact={compact} />
      </Suspense>
    </div>
  );

  return (
    <div className="relative z-10 flex min-h-dvh bg-paper text-ink lg:h-dvh lg:overflow-hidden">
      <aside
        aria-label={t(copy.shell.sidebar.label)}
        style={{ width, transition: dragging ? "none" : "width .18s" }}
        className="relative hidden shrink-0 flex-col overflow-hidden border-r border-line bg-surface lg:flex"
      >
        <div style={{ width: side.mode === "rail" ? RAIL : side.w }} className="flex h-full flex-col">
          {header(rail)}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Suspense>
              <NavLinks rail={rail} onNavigate={() => {}} />
            </Suspense>
          </div>
          {footer(rail)}
        </div>
      </aside>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={t(copy.shell.sidebar.resize)}
        aria-valuenow={width}
        tabIndex={0}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onKeyDown={onKey}
        onDoubleClick={() => save({ ...side, mode: side.mode === "expanded" ? "rail" : "expanded" })}
        style={{ left: width - 3 }}
        className={`absolute inset-y-0 z-20 hidden w-1.5 cursor-col-resize hover:bg-accent/40 focus-visible:bg-accent/60 lg:block ${dragging ? "bg-accent/50" : ""}`}
      />

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label={t(copy.shell.sidebar.closeMenu)} className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="relative flex h-full w-[260px] flex-col border-r border-line bg-surface">
            {header(false)}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <Suspense>
                <NavLinks rail={false} onNavigate={() => setDrawer(false)} />
              </Suspense>
            </div>
            <button
              aria-label={t(copy.shell.sidebar.closeMenu)}
              onClick={() => setDrawer(false)}
              className="absolute right-2 top-1.5 grid size-7 place-items-center text-muted"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex min-h-12 shrink-0 items-center gap-2 border-b border-line bg-surface px-2 pt-[env(safe-area-inset-top)] sm:px-3 lg:static">
          {/* On wide screens this button appears only while the sidebar is completely hidden; otherwise it lives in the sidebar header. */}
          <button
            onClick={() =>
              window.matchMedia("(min-width:1024px)").matches ? save({ ...side, mode: "expanded" }) : setDrawer(true)
            }
            aria-label={t(copy.shell.sidebar.open)}
            title={t(copy.shell.sidebar.openWithKey)}
            className={`grid size-9 place-items-center rounded-md text-muted hover:bg-accent-soft hover:text-ink ${side.mode === "hidden" ? "" : "lg:hidden"}`}
          >
            <PanelLeft size={18} />
          </button>
          <Suspense>
            <SearchDialog />
          </Suspense>
          <div className="ml-auto hidden items-center gap-1.5 md:flex">
            <Actions />
          </div>
          <div className="ml-auto md:hidden">
            <AppbarMenu>
              <Actions />
            </AppbarMenu>
          </div>
        </header>
        <main className="min-w-0 flex-1 max-lg:overflow-x-clip lg:min-h-0 lg:overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] px-3 pb-16 pt-8 sm:px-4 md:px-8">{children}</div>
        </main>
        <VoiceEffects />
        <HoverSpeech />
        <Suspense>
          <SetupGate />
          <ListRefresh />
        </Suspense>
        <Suspense>
          <CountryTheme />
        </Suspense>
        <FlagPalette />
        <Suspense>
          <ScrollKeeper />
        </Suspense>
      </div>
    </div>
  );
}
