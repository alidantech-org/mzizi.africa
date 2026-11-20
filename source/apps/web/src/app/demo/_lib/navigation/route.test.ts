import { describe, expect, test } from "bun:test";
import manifest from "#demo/_lib/pwa/manifest";
import { demoHref, demoSegments, isDemoPath } from "./base";
import { build, toPlace, toView, withParams, type Ctx } from "./route";
const law: Ctx = {
  country: "ke",
  trail: ["nairobi", "westlands"],
  view: "law",
  lang: "sw",
  params: { "view.entity": "instrument", "view.id": "constitution", "view.provision": "article-43" },
};
describe("permanent demo isolation", () => {
  test("internal links stay in demo while external and anchor links are unchanged", () => {
    expect(demoHref("/")).toBe("/demo");
    expect(demoHref("/ke?view=law#article-43")).toBe("/demo/ke?view=law#article-43");
    expect(demoHref("/demo/ke")).toBe("/demo/ke");
    expect(demoHref("/?lang=sw")).toBe("/demo?lang=sw");
    expect(demoHref("https://example.org/source")).toBe("https://example.org/source");
    expect(demoHref("//example.org/source")).toBe("//example.org/source");
    expect(demoHref("#evidence")).toBe("#evidence");
  });
  test("place decoding accepts logical data paths and rendered demo URLs", () => {
    expect(demoSegments("/ke/nairobi/westlands")).toEqual(["ke", "nairobi", "westlands"]);
    expect(demoSegments("/demo/ke/nairobi/westlands?view=law#sources")).toEqual(["ke", "nairobi", "westlands"]);
    expect(isDemoPath("/demo")).toBe(true);
    expect(isDemoPath("/demo/ke")).toBe(true);
    expect(isDemoPath("/ke")).toBe(false);
    expect(isDemoPath("/demography")).toBe(false);
  });
  test("installation cannot launch or declare scope in the real application", () => {
    const install = manifest();
    expect(install.scope).toBe("/demo");
    expect(install.start_url?.startsWith("/demo")).toBe(true);
    expect(install.shortcuts?.every((shortcut) => shortcut.url.startsWith("/demo/"))).toBe(true);
  });
  test("subject, place and record transitions never enter the real explorer", () => {
    expect(toView(law, "finance")).toBe("/demo/ke/nairobi/westlands?view=finance&lang=sw");
    expect(toPlace(law, { country: "ke", trail: ["kisumu"] }).startsWith("/demo/ke/kisumu?")).toBe(true);
    expect(build(law, { params: law.params })).toContain("view.provision=article-43");
    expect(withParams(law, { "view.chapter": "4" })).toContain("/demo/ke/nairobi/westlands?");
  });
});
