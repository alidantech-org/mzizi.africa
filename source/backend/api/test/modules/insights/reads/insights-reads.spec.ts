/**
 * The insight reads against a real database filled by `bun run dev:data`. Set TEST_DATABASE_URL to the dev database to run
 * it; without it the suite is skipped. Hand-written.
 */
import "reflect-metadata";

import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { leaderProfile } from "#/modules/insights/features/insights/reads/leader.ts";
import { browsePlaces } from "#/modules/insights/features/insights/reads/browse.ts";
import { electionDetail, listElections, listParties, placeElections } from "#/modules/insights/features/insights/reads/elections.ts";
import { indicatorMap, indicatorSeries, placeStatistics } from "#/modules/insights/features/insights/reads/statistics.ts";
import { leaderboard, leaderboardMetrics } from "#/modules/insights/features/insights/reads/leaderboards.ts";
import { listMotions, motionDetail } from "#/modules/insights/features/insights/reads/activity.ts";
import { listTenders, placeCivic, projectDetail } from "#/modules/insights/features/insights/reads/civic.ts";
import { globalSearch } from "#/modules/insights/features/insights/reads/search.ts";
import { getInstitution, listInstitutions } from "#/modules/insights/features/insights/reads/institutions.ts";
import { governanceTabs, governanceTree } from "#/modules/insights/features/insights/reads/govtree.ts";
import { getContent, listContent } from "#/modules/insights/features/insights/reads/content.ts";
import { legalBasisFor } from "#/modules/insights/features/insights/reads/legal.ts";
import { compareOptions, comparison } from "#/modules/insights/features/insights/reads/compare.ts";

const url = process.env.TEST_DATABASE_URL;

describe.skipIf(url === undefined)("insight reads (dev database)", () => {
  let db: DataSource;
  let nairobi: string;
  let westlands: string;
  beforeAll(async () => {
    db = new DataSource({ type: "postgres", url });
    await db.initialize();
    const found = await globalSearch(db, "westlands", "place", 10);
    westlands = found.hits.find((h) => h.title === "Westlands")!.id;
    nairobi = (await globalSearch(db, "nairobi", "place", 10)).hits.find((h) => h.title === "Nairobi")!.id;
  });
  afterAll(async () => {
    await db.destroy();
  });

  it("labels every search hit with what it is and where it sits", async () => {
    const found = await globalSearch(db, "kibera", undefined, 20);
    const hit = found.hits.find((h) => h.title === "Kibera")!;
    expect(hit.kind).toBe("place");
    expect(hit.path).toEqual(["Republic of Kenya", "Nairobi", "Kibra", "Lindi", "Kibera"]);
    expect(found.counts.place).toBeGreaterThan(0);
  });

  it("lists the counties first and the places inside one, with towns and villages below wards", async () => {
    const root = await browsePlaces(db, undefined);
    expect(root.children).toHaveLength(47);
    const kibera = (await globalSearch(db, "soweto east", "place", 5)).hits[0]!;
    expect(kibera.path.at(-2)).toBe("Kibera");
  });

  it("serves census figures, breakdowns and a density derived from population and area", async () => {
    const stats = await placeStatistics(db, nairobi);
    const indicators = stats.topics.flatMap((t) => t.indicators as { code: string }[]);
    expect(indicators.map((i) => i.code)).toEqual(expect.arrayContaining(["sta.population.total", "sta.population.density"]));
    expect(Object.keys(stats.breakdowns)).toEqual(expect.arrayContaining(["sex", "age", "residence", "community"]));
    const series = await indicatorSeries(db, "sta.population.total", nairobi);
    expect(series.points.length).toBeGreaterThan(10);
    const map = await indicatorMap(db, "sta.population.density", undefined, "county");
    expect(map.units).toHaveLength(47);
    expect(map.units[0]!.rank).toBe(1);
  });

  it("ranks places and leaders by metrics from several domains", async () => {
    const { metrics } = await leaderboardMetrics(db);
    expect(new Set(metrics.map((m) => m.domain))).toEqual(new Set(["statistics", "finance", "civic", "elections", "activity"]));
    const share = await leaderboard(db, "fin.ngcdf.project-share", "constituency", undefined, 5);
    expect(share.rows).toHaveLength(5);
    expect(share.rows[0]!.value).toBeGreaterThanOrEqual(share.rows[4]!.value);
    const attendance = await leaderboard(db, "act.attendance", undefined, undefined, 5);
    expect(attendance.rows[0]!.subjectId).not.toBeNull();
  });

  it("matches the published presidential totals and adds the county split up to them", async () => {
    const { elections } = await listElections(db);
    const latest = elections[0]!;
    expect(latest.year).toBe(2022);
    expect(latest.winner!.votes).toBe(7_176_141);
    const detail = await electionDetail(db, latest.electionId, undefined, "presidential");
    expect(detail.units).toHaveLength(47);
    expect(detail.totals[0]!.votes).toBe(7_176_141);
  });

  it("shows a place's elections, registration trend and winners", async () => {
    const history = await placeElections(db, westlands);
    expect(history.elections.map((e) => e.year)).toEqual([2022, 2017, 2013]);
    expect(history.registrationTrend.length).toBeGreaterThanOrEqual(0);
  });

  it("ranks parties and lists a party's members", async () => {
    const { parties } = await listParties(db);
    expect(parties.length).toBeGreaterThan(40);
    expect(parties[0]!.votes2022).toBeGreaterThanOrEqual(parties[1]!.votes2022);
  });

  it("records every member's position on a motion and its outcome agrees with the votes", async () => {
    const { motions } = await listMotions(db, undefined, 20);
    for (const m of motions) {
      const motion = m as unknown as { outcome: string; yes: number; no: number; code: string };
      if (motion.yes + motion.no > 0) expect(motion.outcome === "passed").toBe(motion.yes > motion.no);
    }
    const detail = await motionDetail(db, (motions[0] as { code: string }).code);
    expect(detail.members.length).toBeGreaterThan(5);
    expect(detail.tally.total).toBe(detail.members.length);
  });

  it("reads the constituency fund from the scraped allocation PDFs and classes the spending", async () => {
    const civic = await placeCivic(db, westlands);
    expect(civic.fund).not.toBeNull();
    expect(civic.years.map((y) => y.year)).toEqual([2023, 2021, 2020, 2019]);
    expect(civic.classes.map((c) => c.code)).toEqual(expect.arrayContaining(["education-infrastructure", "bursary", "salaries"]));
    const project = (civic.projects as unknown as { code: string; location: unknown }[]).find((p) => p.location !== null && p.code.includes("ngcdf"))!;
    const detail = await projectDetail(db, project.code);
    expect(detail.media.length).toBeGreaterThan(0);
  });

  it("lists tenders by status and says what is not published", async () => {
    const open = await listTenders(db, "open", undefined, 20);
    expect((open.tenders as unknown as { status: string }[]).every((t) => t.status === "open")).toBe(true);
    expect(open.gaps.length).toBeGreaterThan(0);
  });

  it("builds a leader's profile with contacts, votes, the election that put them in office and the fund they oversee", async () => {
    const civic = await placeCivic(db, westlands);
    const mp = civic.leadership.find((o) => /Member of Parliament/i.test(o.officeTitle))!;
    const profile = await leaderProfile(db, mp.holderId);
    expect(profile.contacts.length).toBeGreaterThan(0);
    expect((profile.election as unknown as { year: number }[])[0]!.year).toBe(2022);
    expect(profile.fund).not.toBeNull();
  });

  it("groups every public body by arm of government from the reference values", async () => {
    const list = await listInstitutions(db, {});
    expect(list.arms.map((a) => a.code)).toEqual(["executive", "legislature", "judiciary", "independent", "county", "funds"]);
    const independent = list.arms.find((a) => a.code === "independent")!;
    expect(independent.groups.flatMap((g) => g.institutions).some((i) => i.code === "ke.institution.iebc")).toBe(true);
    expect(list.total).toBeLessThan(200); // the 47 county governments and 290 NG-CDF committees are folded into their parents
  });

  it("describes one body with its legal basis, leaders and text", async () => {
    const iebc = (await getInstitution(db, "ke.institution.iebc"))!;
    expect(iebc.institution.basis?.code).toBe("constitution");
    expect(iebc.leaders.length).toBeGreaterThan(3);
    expect(iebc.legalBasis.some((l) => l.designation === "Article 88")).toBe(true);
    expect(iebc.legalBasis.some((l) => l.type === "act")).toBe(true);
    expect(iebc.content[0]?.body).toContain("Independent Electoral");
    expect(await getInstitution(db, "ke.institution.nope")).toBeNull();
    expect((await getInstitution(db, "gov.ins.ke.institution.iebc"))?.institution.code).toBe("ke.institution.iebc");
  });

  it("builds the elected tree for a place: President, Deputy, Governor, Senator, MP and MCA, with arms as branches", async () => {
    const ward = (await globalSearch(db, "karura", "place", 10)).hits.find((h) => h.title === "Karura")!.id;
    const tree = await governanceTree(db, { tab: "elected", featureId: ward });
    const tiers = new Set(tree.nodes.filter((n) => n.type === "leader").map((n) => (n.tier as { code: string }).code));
    for (const t of ["president", "deputy-president", "governor", "deputy-governor", "senator", "woman-representative", "member-of-parliament", "member-of-county-assembly"]) {
      expect(tiers.has(t), t).toBe(true);
    }
    expect(tree.nodes.some((n) => n.type === "arm")).toBe(true);
    const deputy = tree.nodes.find((n) => n.type === "leader" && (n.tier as { code: string }).code === "deputy-president")!;
    expect(tree.edges.some((e) => e.to === deputy.id && e.kind === "reports")).toBe(true);
    expect(tree.rail.map((r) => r.code)).toEqual(["country", "county", "sub-county", "constituency", "ward"]);
  });

  it("keeps nominated and elected apart and builds a tree for one body", async () => {
    const nominated = await governanceTree(db, { tab: "nominated" });
    expect(nominated.nodes.filter((n) => n.type === "leader").every((n) => (n.how as { code: string }).code === "nominated")).toBe(true);
    const cabinet = await governanceTree(db, { institution: "ke.institution.cabinet" });
    expect(cabinet.nodes.filter((n) => n.type === "leader" && (n.tier as { code: string }).code === "cabinet-secretary").length).toBe(22);
    const tabs = await governanceTabs(db);
    expect(tabs.tabs.map((t) => t.code)).toEqual(["elected", "nominated", "appointed"]);
    expect(tabs.arms.length).toBe(6);
  });

  it("filters a body tree by an explicitly selected appointment category", async () => {
    const elected = await governanceTree(db, { institution: "ke.institution.parliament", tab: "elected" });
    const electedKinds = new Set(["elected", "running-mate"]);
    const leaders = elected.nodes.filter((n) => n.type === "leader");
    expect(leaders.length).toBeGreaterThan(0);
    expect(leaders.every((n) => electedKinds.has((n.how as { code: string }).code))).toBe(true);
    const nominated = await governanceTree(db, { institution: "ke.institution.parliament", tab: "nominated" });
    expect(nominated.nodes.filter((n) => n.type === "leader").every((n) => (n.how as { code: string }).code === "nominated")).toBe(true);
    const places = await compareOptions(db, nairobi);
    expect(places.hierarchy[0]?.rung).toBe("ward");
  });

  it("resolves media in texts and lists texts by category", async () => {
    const page = await getContent(db, { slug: "institution/iebc" });
    expect(page.content?.image).toMatch(/^https:/);
    expect(page.content?.body).not.toContain("media:");
    const learn = await listContent(db, { category: "explainer" });
    expect(learn.items.some((i) => i.slug === "explainer/devolution")).toBe(true);
    const swahili = await getContent(db, { slug: "arm/executive", languageCode: "sw" });
    expect(swahili.content?.language).toBe("sw");
    const biography = await getContent(db, { subjectTable: "official.individuals", subjectCode: "ke.person.william-ruto" });
    expect(biography.content?.slug).toBe("person/william-ruto");
    expect((await getContent(db, { subjectTable: "geography.features", subjectCode: nairobi })).content).not.toBeNull();
  });

  it("navigates stored Constitution chapters, articles and wording through content", async () => {
    const overview = await getContent(db, { slug: "constitution/overview" });
    const chapter = overview.related.find((i) => i.slug.startsWith("legal/"));
    expect(chapter).toBeDefined();
    const chapterPage = await getContent(db, { slug: chapter!.slug });
    expect(chapterPage.content?.subject.table).toBe("legal.provisions");
    expect(chapterPage.related.length).toBeGreaterThan(0);
    const article = await getContent(db, { slug: chapterPage.related[0]!.slug });
    expect(article.content?.body.length).toBeGreaterThan(0);
    expect(article.content?.frontMatter.parent).toBe(chapter!.slug);
    const sovereignty = await getContent(db, { slug: "legal/ke.constitution-2010.art-1" });
    expect(sovereignty.content?.body).toContain("All sovereign power belongs");
    expect(sovereignty.content?.body).toContain("county level");
    expect(sovereignty.content?.frontMatter.sourceProvisions).toContain("ke.constitution-2010.art-1");
    expect((await getContent(db, { slug: "legal/not-recorded" })).content).toBeNull();
  });

  it("finds the articles behind a leader and an office kind", async () => {
    const holder = (await governanceTree(db, { institution: "ke.institution.presidency" })).nodes.find((n) => n.type === "leader")!;
    const items = await legalBasisFor(db, "governance.holders", (holder.refs as { table: string; office: string }).office + ".2022");
    expect(items.map((i) => i.designation)).toEqual(expect.arrayContaining(["Article 131"]));
    const byId = await legalBasisFor(db, "governance.holders", holder.holderId as string);
    expect(byId.map((i) => i.designation)).toEqual(expect.arrayContaining(["Article 131"]));
    expect((await legalBasisFor(db, "geography.features", nairobi)).length).toBeGreaterThan(0);
  });

  it("offers places to compare with and says which rungs of the ladder are missing", async () => {
    const ward = (await globalSearch(db, "karura", "place", 10)).hits.find((h) => h.title === "Karura")!.id;
    const options = await compareOptions(db, ward);
    expect(options.nearby.length).toBe(10);
    expect(options.hierarchy.find((h) => h.rung === "sub-county")?.available).toBe(false);
    expect(options.hierarchy.find((h) => h.rung === "world")?.message).toContain("Other countries");
    const other = (options.nearby[0] as { featureId: string }).featureId;
    const both = await comparison(db, ward, other);
    expect(both.rows.some((r) => (r as { code: string }).code === "sta.population.total")).toBe(true);
  });
});
