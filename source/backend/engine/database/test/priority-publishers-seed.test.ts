import { describe, expect, test } from "bun:test";

import { join } from "node:path";

import { seedRoot } from "../src/config.ts";

const read = async (name: string) => JSON.parse(await Bun.file(join(seedRoot, name)).text());

describe("priority publishers seed (Gazette, Parliament, NLC, Controller of Budget, Auditor-General)", () => {
  test("every publisher names an institution and site that already exist in the governance and site seeds", async () => {
    const catalogue = await read("ke/catalogues/ke-priority-publishers-catalogue.json");
    const structure = await read("ke/governance/ke-governance-structure.json");
    const sites = await read("ke/registry/ke-expected-sites.json");
    expect(catalogue._meta.label).toBe("Custom-prepared from manual research");
    for (const p of catalogue.publishers) {
      const site = sites.sites.find((s: { code: string }) => s.code === p.site);
      expect(site, p.site).toBeTruthy();
      expect(site.institution, p.site).toBe(p.institution);
      expect(structure.institutions.some((i: { code: string }) => i.code === p.institution), p.institution).toBe(true);
      for (const field of ["probe", "publication", "pipeline"]) expect(p[field], `${p.site} ${field}`).toBeTruthy();
    }
  });

  test("every host is a .go.ke host (no exact-host rule needed) and the Auditor-General is read at www", async () => {
    const catalogue = await read("ke/catalogues/ke-priority-publishers-catalogue.json");
    for (const p of catalogue.publishers) for (const host of p.hosts) expect(host.endsWith(".go.ke"), host).toBe(true);
    const sites = await read("ke/registry/ke-expected-sites.json");
    expect(sites.sites.find((s: { code: string }) => s.code === "ke/auditor-general").hosts).toContain("www.oagkenya.go.ke");
    const policy = await read("system/policy/trusted-domains.json");
    expect(policy.suffixes.some((r: { suffix?: string }) => r.suffix === ".go.ke")).toBe(true);
  });

  test("each publisher with sections has a seeded section family using only known section labels", async () => {
    const catalogue = await read("ke/catalogues/ke-priority-publishers-catalogue.json");
    const sections = await read("ke/registry/ke-site-sections.json");
    for (const p of catalogue.publishers.filter((x: { familySections: string }) => x.familySections.startsWith("ke/publisher/"))) {
      const family = sections.families[p.familySections];
      expect(family, p.familySections).toBeTruthy();
      expect(new Set(family.map((s: { label: string }) => s.label)).size).toBe(family.length);
    }
  });

  test("kenyalaw.org is never a crawl scope of these publishers", async () => {
    const catalogue = await read("ke/catalogues/ke-priority-publishers-catalogue.json");
    expect(JSON.stringify(catalogue.publishers.map((p: { hosts: string[] }) => p.hosts))).not.toContain("kenyalaw");
  });
});
