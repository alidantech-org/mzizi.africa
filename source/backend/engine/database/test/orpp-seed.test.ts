import { describe, expect, test } from "bun:test";

const read = async (name: string) => JSON.parse(await Bun.file(new URL(`../fixtures/${name}.json`, import.meta.url)).text());

describe("ORPP seed (institution, site, host rule, catalogue)", () => {
  test("the Registrar is an institution with a legal basis and its site is linked to it", async () => {
    const structure = await read("seed/ke-governance-structure");
    const institution = structure.institutions.find((row: { code: string }) => row.code === "ke/registrar-of-political-parties");
    expect(institution.legalBasis).toContain("Political Parties Act");
    const sites = await read("seed/ke-expected-sites");
    const site = sites.sites.find((row: { code: string }) => row.code === "ke/orpp");
    expect(site.institution).toBe(institution.code);
    expect(site.hosts).toEqual(["orpp.or.ke"]);
  });

  test("orpp.or.ke needs and has an exact host rule (the .go.ke suffix does not cover it)", async () => {
    const policy = await read("policy/trusted-domains");
    const rule = policy.suffixes.find((row: { host?: string }) => row.host === "orpp.or.ke");
    expect(rule.maxRequestsPerSecond).toBeLessThanOrEqual(0.2);
    expect(policy.suffixes.filter((row: { host?: string }) => row.host === "orpp.or.ke")).toHaveLength(1);
    expect("orpp.or.ke".endsWith(".go.ke")).toBe(false);
    // The subdomains of the self-service portal are deliberately not covered.
    expect(policy.suffixes.some((row: { host?: string }) => row.host === "ippms.orpp.or.ke")).toBe(false);
  });

  test("the catalogue names format, frequency and pipeline for every publication type", async () => {
    const catalogue = await read("seed/ke-orpp-catalogue");
    expect(catalogue._meta.label).toBe("Custom-prepared from manual research");
    expect(catalogue.publications.length).toBeGreaterThanOrEqual(8);
    for (const p of catalogue.publications) for (const field of ["type", "urlPattern", "format", "frequency", "pipeline"]) expect(p[field], `${p.type} ${field}`).toBeTruthy();
  });
});
