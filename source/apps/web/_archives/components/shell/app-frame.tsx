"use client";

/** The shell consumes server-resolved context and contract-generated navigation. */
import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@mzizi/ui-web/shell/app-shell.tsx";
import type { Crumb, NavGroup } from "@mzizi/ui-web/shell/types.ts";
import type { ExperienceContext } from "@mzizi/api-client/types/experience/context.ts";
import {
  explorerAt,
  explorerNavigation,
  parseExplorerAddress,
} from "#/_archives/lib/dryv/explorer-address";
import { ExplorerView } from "#/_archives/lib/types/explorer-view.enum";
import { Logo } from "#/_archives/components/brand/logo";
import { Icon } from "#/_archives/components/brand/icon";
import { ThemeToggle } from "#/_archives/components/site/theme-toggle";
import { LanguageSwitcher } from "#/_archives/components/site/language-switcher";
import { useLanguage } from "#/_archives/lib/site/i18n";
import { PlaceChip } from "#/_archives/components/shell/place-chip";

export interface ShellContext {
  readonly countryName: string;
  readonly countryIso?: string | null;
  readonly place: ExperienceContext["place"];
  readonly chain: readonly { readonly name: string; readonly path: string }[];
  readonly rest: readonly string[];
}
const UpdateShell = createContext<((context: ShellContext) => void) | null>(
  null,
);

/** A newly rendered server page updates the persistent layout without a browser API read. */
export function ExplorerShellUpdate({ context }: { context: ShellContext }) {
  const update = useContext(UpdateShell);
  useEffect(() => {
    update?.(context);
  }, [update, context]);
  return null;
}

export function AppFrame({
  context,
  children,
}: {
  context: ShellContext;
  children: ReactNode;
}) {
  const [resolved, setResolved] = useState(context);
  const { tr } = useLanguage();
  const query = useSearchParams();
  let state;
  try {
    state = parseExplorerAddress(new URLSearchParams(query.toString()));
  } catch {
    state = { view: ExplorerView.OVERVIEW };
  }
  const countryPath = resolved.countryIso?.toLowerCase() ?? "";
  const path = [countryPath, resolved.place?.path].filter(Boolean).join("/");
  const groupNames = [
    ...new Set(explorerNavigation.map((entry) => entry.group)),
  ];
  const groups: NavGroup[] = groupNames.map((group) => ({
    id: group,
    label: tr(group),
    items: explorerNavigation
      .filter((entry) => entry.group === group)
      .map((entry) => ({
        href: explorerAt(path, { view: entry.view, lang: state.lang }),
        label: tr(entry.label),
      })),
  }));
  const crumbs: Crumb[] = [
    {
      label: resolved.countryName,
      href: explorerAt(countryPath, { view: state.view, lang: state.lang }),
    },
  ];
  for (const unit of resolved.chain)
    crumbs.push({
      label: unit.name,
      href: explorerAt([countryPath, unit.path].join("/"), {
        view: state.view,
        lang: state.lang,
      }),
    });
  const search = (
    <form action={`/${path}`} className="flex items-center gap-2">
      <input type="hidden" name="view" value="search" />
      {state.lang ? (
        <input type="hidden" name="lang" value={state.lang} />
      ) : null}
      <label className="sr-only" htmlFor="shell-search">
        Search this place
      </label>
      <input
        id="shell-search"
        className="input w-full"
        name="filters.q"
        placeholder={tr("Search this place")}
      />
    </form>
  );
  return (
    <UpdateShell.Provider value={setResolved}>
      <AppShell
        logo={<Logo />}
        groups={groups}
        crumbs={crumbs}
        search={search}
        menuLabel={tr("Menu")}
        breadcrumbLabel={tr("Breadcrumb")}
        actions={
          <>
            <ThemeToggle />
            <LanguageSwitcher />
            <Link
              href="/me/saved"
              className="btn btn-ghost"
              aria-label={tr("Saved")}
            >
              <Icon name="heart" />
            </Link>
            <Link
              href="/me"
              className="btn btn-ghost"
              aria-label={tr("Profile")}
            >
              <Icon name="user" />
            </Link>
          </>
        }
        sidebarTop={
          <PlaceChip
            countryName={resolved.countryName}
            countryIso={resolved.countryIso ?? null}
            placeName={resolved.place?.name ?? null}
            placePath={path}
          />
        }
        sidebarFoot={
          <div className="space-y-2">
            <Link className="block" href="/me/privacy">
              {tr("Privacy and preferences")}
            </Link>
            <Link className="block" href="/help">
              {tr("Help")}
            </Link>
            <Link className="block" href="/">
              {tr("Personal overview")}
            </Link>
          </div>
        }
      >
        {children}
      </AppShell>
    </UpdateShell.Provider>
  );
}
