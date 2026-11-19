import { describe, expect, test } from "bun:test";
import { explorerAt, explorerListAt, explorerNavigation, explorerPlaceAt, explorerViewAt, parseExplorerAddress } from "#/lib/dryv/explorer-address.ts";
import { ExplorerView } from "#/lib/types/explorer-view.enum.ts";
import { InterfaceLanguage } from "#/lib/types/interface-language.enum.ts";

describe("geographic explorer addresses", () => {
  test("a provision link round trips with its filters, paging and explicit language", () => {
    const raw = new URLSearchParams("view=laws&view.entity=instrument&view.id=constitution&view.provision=article-43&filters.kind=constitution&page.no=2&page.limit=25&lang=sw");
    const state = parseExplorerAddress(raw);
    const url = new URL(explorerAt("ke/nairobi/westlands", state), "https://mzizi.africa");
    expect(url.pathname).toBe("/ke/nairobi/westlands");
    expect(parseExplorerAddress(url.searchParams)).toEqual(state);
  });
  test("changing subject preserves place and explicit language but removes old record and list state", () => {
    const current = parseExplorerAddress(new URLSearchParams("view=laws&view.entity=instrument&view.id=constitution&filters.kind=bill&page.no=4&lang=sw"));
    expect(explorerViewAt("ke/nairobi", ExplorerView.FINANCE, current)).toBe("/ke/nairobi?lang=sw&view=finance");
  });
  test("changing place preserves the subject and subsection without retaining a locally selected record", () => {
    const state = parseExplorerAddress(new URLSearchParams("view=finance&view.tab=projects&view.entity=project&view.id=road&page.no=3"));
    expect(explorerPlaceAt("za/gauteng", state)).toBe("/za/gauteng?view.tab=projects&view=finance");
  });
  test("cookie-only language is not forced into links", () => {
    expect(explorerAt("ke", { view: ExplorerView.OVERVIEW })).toBe("/ke");
    expect(explorerAt("ke", { view: ExplorerView.OVERVIEW, lang: InterfaceLanguage.KISWAHILI })).toBe("/ke?lang=sw");
  });
  test("view-specific identity and filter combinations are rejected", () => {
    for (const query of ["view=finance&view.entity=instrument&view.id=constitution", "view=overview&view.contest=2022", "view=leaders&view.indicator=population"]) {
      expect(() => parseExplorerAddress(new URLSearchParams(query))).toThrow();
    }
  });
  test("a list transition drops its old page and retains explicit language", () => {
    const current = parseExplorerAddress(new URLSearchParams("view=laws&filters.kind=bill&page.no=4&lang=sw"));
    const next = new URL(explorerListAt("ke/nairobi", current, { kind: "act" }), "https://mzizi.africa");
    expect(next.searchParams.has("page.no")).toBe(false);
    expect(next.searchParams.get("filters.kind")).toBe("act");
    expect(next.searchParams.get("lang")).toBe("sw");
  });
  test("navigation order and group membership come from the contract", () => {
    expect(explorerNavigation[0]?.view).toBe(ExplorerView.OVERVIEW);
    expect(explorerNavigation.find((entry) => entry.view === ExplorerView.LEADERS)?.group).toBe("Public life");
  });
  test("ambiguous identities and unsupported state are rejected", () => {
    for (const query of ["view=laws&view=finance", "view=laws&view.id=orphan", "view=finance&view.provision=article-43", "view=unknown", "page.no=0", "page.limit=201", "page.no=NaN", "lang=xx", "sort.order=sideways", "filters.__proto__=x"]) {
      expect(() => parseExplorerAddress(new URLSearchParams(query))).toThrow();
    }
  });
});
