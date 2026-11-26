/* Sample data for the prototype. Fictional people and illustrative figures; NOT verified records.
   Shapes follow dryv/contracts/schemas/postgres/*.ts (table names are noted beside each generator). */
(function () {
  const D = (window.D = {});
  D.seed = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  D.rng = (s) => { let a = typeof s === "string" ? D.seed(s) : s; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  D.pick = (r, a) => a[Math.floor(r() * a.length)];
  D.fmt = (n) => Math.round(n).toLocaleString("en-US");
  D.slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  /* geography.features / areas / hierarchies+levels. Outline is schematic (a real one comes from geography.outlines bands 0-3). */
  D.country = { code: "ke", name: "Kenya", levels: ["County", "Constituency", "Ward"], flag: ["#000", "#bb0000", "#006600"] };
  D.outline = [[33.9,4.2],[35.0,5.0],[35.9,4.6],[36.9,4.4],[38.1,3.6],[39.5,3.5],[41.0,3.95],[41.9,3.95],[41.0,2.8],[40.9,-0.8],[41.5,-1.7],[40.3,-2.6],[39.2,-4.7],[37.7,-3.5],[37.6,-3.0],[34.0,-1.0],[33.9,0.2],[34.4,0.9],[34.6,1.2],[35.0,1.7],[34.4,3.3]];
  const C = (name, lat, lon, pop, region) => ({ id: D.slug(name), name, lat, lon, pop, region });
  D.counties = [
    C("Nairobi", -1.286, 36.82, 4400, "Nairobi"), C("Mombasa", -4.04, 39.67, 1200, "Coast"), C("Kisumu", -0.09, 34.77, 1150, "Nyanza"),
    C("Nakuru", -0.30, 36.07, 2160, "Rift Valley"), C("Uasin Gishu", 0.52, 35.27, 1160, "Rift Valley"), C("Turkana", 3.12, 35.6, 927, "Rift Valley"),
    C("Marsabit", 2.33, 37.98, 460, "Eastern"), C("Garissa", -0.45, 39.65, 840, "North Eastern"), C("Kakamega", 0.28, 34.75, 1870, "Western"),
    C("Nyeri", -0.42, 36.95, 760, "Central"), C("Kilifi", -3.63, 39.85, 1450, "Coast"), C("Machakos", -1.52, 37.26, 1420, "Eastern"), C("Kajiado", -1.85, 36.78, 1120, "Rift Valley"),
  ];
  const NAI = { Westlands: [[-1.265, 36.80], ["Parklands", "Kangemi", "Kitisuru"]], Langata: [[-1.35, 36.74], ["Karen", "Nyayo Highrise"]], Kibra: [[-1.31, 36.78], ["Laini Saba", "Sarang'ombe"]] };
  D.constituencies = (county) => {
    if (county.id === "nairobi") return Object.keys(NAI).map((n) => ({ id: D.slug(n), name: n, level: "Constituency", lat: NAI[n][0][0], lon: NAI[n][0][1], wards: NAI[n][1] }));
    return ["Central", "North", "South"].map((s, i) => ({ id: D.slug(county.name + " " + s), name: county.name + " " + s, level: "Constituency", lat: county.lat + (i - 1) * 0.18, lon: county.lon + (1 - i) * 0.15, wards: [county.name + " Township", county.name + " Rural"] }));
  };
  /** Resolve a path like ["ke","nairobi","westlands","parklands"]. */
  D.place = (at) => {
    if (!at.length || at[0] !== "ke") return { ok: false, error: "Only Kenya has sample data in this prototype." };
    const trail = []; let node = { name: "Kenya", level: "Country", lat: 0.2, lon: 37.9, id: "ke" };
    if (at[1]) { const c = D.counties.find((x) => x.id === at[1]); if (!c) return { ok: false, error: `No county "${at[1]}".` }; node = { ...c, level: "County" }; trail.push(node);
      if (at[2]) { const k = D.constituencies(c).find((x) => x.id === at[2]); if (!k) return { ok: false, error: `No constituency "${at[2]}".` }; node = k; trail.push(k);
        if (at[3]) { const w = k.wards.find((x) => D.slug(x) === at[3]); if (!w) return { ok: false, error: `No ward "${at[3]}".` }; node = { id: at[3], name: w, level: "Ward", lat: k.lat + 0.01, lon: k.lon + 0.01 }; trail.push(node); } } }
    return { ok: true, country: D.country, trail, node, depth: trail.length, at, name: node.name, level: node.level, county: trail[0] || null };
  };
  D.children = (pl) => {
    if (pl.depth === 0) return D.counties.map((c) => ({ ...c, level: "County" }));
    if (pl.depth === 1) return D.constituencies(pl.trail[0]);
    if (pl.depth === 2) return pl.trail[1].wards.map((w) => ({ id: D.slug(w), name: w, level: "Ward" }));
    return [];
  };
  /** Nearest-centroid location capture. Constituency/ward are approximate until real boundaries load (see web-navigation rule). */
  D.locate = (lat, lon) => {
    let best = null, bd = 1e9; D.counties.forEach((c) => { const d = (c.lat - lat) ** 2 + (c.lon - lon) ** 2; if (d < bd) { bd = d; best = c; } });
    let k = null, kd = 1e9; D.constituencies(best).forEach((x) => { const d = (x.lat - lat) ** 2 + (x.lon - lon) ** 2; if (d < kd) { kd = d; k = x; } });
    const w = k.wards[Math.abs(Math.round((lat * 100 + lon * 100))) % k.wards.length];
    const inside = lat < 5.1 && lat > -4.9 && lon > 33.8 && lon < 42;
    return { inside, distKm: Math.sqrt(bd) * 111, county: best, constituency: k, ward: w, approx: true };
  };

  /* identity.names, official.individuals, governance.offices/holders/terms, politics.parties+memberships */
  D.parties = [{ id: "ua", name: "Umoja Alliance", short: "UA", color: "#b8431f" }, { id: "jp", name: "Jamii Party", short: "JP", color: "#1f6b52" }, { id: "mf", name: "Maendeleo Front", short: "MF", color: "#2c6e8a" }, { id: "ind", name: "Independent", short: "IND", color: "#7a5c8f" }];
  const FIRST = ["Amani", "Baraka", "Chebet", "Dalila", "Eliud", "Fatuma", "Gathoni", "Hassan", "Imani", "Jomo", "Kamau", "Lulu", "Mwajuma", "Njeri", "Otieno", "Pendo", "Rono", "Salma", "Tabitha", "Wekesa", "Zawadi", "Achieng", "Barasa", "Kiprop"];
  const LAST = ["Mwangi", "Odhiambo", "Kiptoo", "Hussein", "Wanjiru", "Muthoni", "Ndungu", "Otieno", "Cheruiyot", "Mutua", "Nyaga", "Abdi", "Simiyu", "Kariuki", "Juma", "Lokiru"];
  D.name = (r) => D.pick(r, FIRST) + " " + D.pick(r, LAST);
  const ini = (n) => n.split(" ").map((x) => x[0]).join("").slice(0, 2);
  D.initials = ini;
  D.party = (id) => D.parties.find((p) => p.id === id) || D.parties[3];
  /** One office-holder row = holders ⨝ offices ⨝ individuals ⨝ terms. */
  const mk = (key, office, level, placeName, placeAt, from, method, extra) => {
    const r = D.rng("L:" + key); const name = D.name(r); const party = D.pick(r, D.parties);
    const past = []; let y = from; for (let i = 0; i < 1 + Math.floor(r() * 2); i++) { past.push({ office: D.pick(r, ["Member of County Assembly", "Mayor", "Deputy Governor", "Chairperson, Public Board", "Member of Parliament"]), from: y - 5 * (i + 1), to: y - 5 * i, place: placeName }); }
    return Object.assign({ id: "L-" + D.seed(key).toString(36), name, initials: ini(name), office, level, place: placeName, placeAt, party: party.id, since: from, until: null, method, born: 1958 + Math.floor(r() * 30), past: past.reverse(), color: party.color }, extra || {});
  };
  D._leaders = null;
  D.leaders = () => {
    if (D._leaders) return D._leaders; const L = [];
    L.push(mk("ke:pres", "President", "Country", "Kenya", ["ke"], 2022, "Elected", { contest: "ke-2022-presidential" }), mk("ke:dp", "Deputy President", "Country", "Kenya", ["ke"], 2022, "Elected on the same ticket"),
      mk("ke:speaker", "Speaker, National Assembly", "Country", "Kenya", ["ke"], 2022, "Elected by members"), mk("ke:cj", "Chief Justice", "Country", "Kenya", ["ke"], 2021, "Appointed (JSC nomination, President appoints)"),
      mk("ke:ag", "Auditor-General", "Country", "Kenya", ["ke"], 2019, "Appointed (Assembly approval)"));
    D.counties.forEach((c) => {
      const at = ["ke", c.id];
      L.push(mk(c.id + ":gov", "Governor", "County", c.name, at, 2022, "Elected", { contest: c.id + "-2022-governor" }), mk(c.id + ":dgov", "Deputy Governor", "County", c.name, at, 2022, "Elected on the same ticket"),
        mk(c.id + ":sen", "Senator", "County", c.name, at, 2022, "Elected", { contest: c.id + "-2022-senator" }), mk(c.id + ":wr", "Woman Representative", "County", c.name, at, 2022, "Elected", { contest: c.id + "-2022-womanrep" }));
      D.constituencies(c).forEach((k) => { const kat = ["ke", c.id, k.id]; L.push(mk(k.id + ":mp", "Member of Parliament", "Constituency", k.name, kat, 2022, "Elected", { contest: k.id + "-2022-mp" }));
        k.wards.forEach((w) => L.push(mk(k.id + ":" + w + ":mca", "Member of County Assembly", "Ward", w, [...kat, D.slug(w)], 2022, "Elected", { contest: D.slug(w) + "-2022-mca" }))); });
    });
    return (D._leaders = L);
  };
  D.leadersFor = (pl) => {
    const all = D.leaders(); const key = pl.at.join("/");
    if (pl.depth === 0) return all.filter((l) => l.level === "Country");
    return all.filter((l) => l.placeAt.join("/") === key || (pl.depth === 1 && l.placeAt.join("/").startsWith(key + "/") && l.level !== "Ward") || (pl.depth === 2 && l.placeAt.join("/").startsWith(key + "/")));
  };
  D.leader = (id) => D.leaders().find((l) => l.id === id);
  /** politics.commitments + fulfilments (claimed -> partial -> delivered), linked to civic.projects / finance / legislature */
  D.commitments = (l) => {
    const r = D.rng("C:" + l.id); const topics = [["Water", "Pipe clean water to {n} households", "households"], ["Roads", "Tarmac {n} km of access roads", "km"], ["Health", "Equip {n} dispensaries with essential drugs", "dispensaries"], ["Schools", "Build {n} classrooms", "classrooms"], ["Jobs", "Train {n} youths in a trade", "youths"], ["Markets", "Build {n} modern market stalls", "stalls"]];
    const st = ["claimed", "partial", "delivered", "no evidence"]; const out = [];
    for (let i = 0; i < 4; i++) { const t = topics[(i + Math.floor(r() * 6)) % 6]; const q = [200, 40, 25, 60, 500, 120][topics.indexOf(t)] * (1 + Math.floor(r() * 4));
      const s = D.pick(r, st); out.push({ id: l.id + "-c" + i, topic: t[0], statement: t[1].replace("{n}", D.fmt(q)), unit: t[2], quantity: q, madeOn: "2022-" + String(2 + Math.floor(r() * 4)).padStart(2, "0") + "-1" + Math.floor(r() * 9), dueOn: "202" + (5 + Math.floor(r() * 3)), kind: i ? "manifesto pledge" : "campaign promise", status: s,
        done: s === "delivered" ? q : s === "partial" ? Math.round(q * (0.2 + r() * 0.5)) : 0, evidence: s === "no evidence" ? [] : D.pick(r, [["Project record", "Budget line"], ["Contract", "Delivery report"], ["Bill", "Hansard"], ["Project record"]]) }); }
    return out;
  };

  /* statistics.indicators / observations / breakdowns */
  D.indicators = [
    { id: "pop", label: "Population", unit: "thousand", base: null, dim: ["Sex", "Area"] }, { id: "poverty", label: "Poverty rate", unit: "%", base: 36, dim: ["Sex", "Area"] },
    { id: "literacy", label: "Adult literacy", unit: "%", base: 82, dim: ["Sex", "Area"] }, { id: "water", label: "Access to clean water", unit: "%", base: 62, dim: ["Area"] },
    { id: "health", label: "Health facilities per 100k", unit: "", base: 14, dim: [] }, { id: "turnout", label: "Voter turnout (2022)", unit: "%", base: 66, dim: [] },
  ];
  D.value = (ind, county, year) => {
    const r = D.rng(ind.id + county.id); if (ind.id === "pop") return county.pop * Math.pow(1.025, year - 2019);
    const off = (r() - 0.5) * 36; const trend = ind.id === "poverty" ? -0.9 : 0.8; return Math.max(3, Math.min(98, ind.base + off + trend * (year - 2015) + (D.rng(ind.id + county.id + year)() - 0.5) * 2));
  };
  D.series = (ind, county, from, to) => { const o = []; for (let y = from || 2010; y <= (to || 2024); y++) o.push([y, D.value(ind, county, y)]); return o; };
  D.nationalValue = (ind, year) => { const w = D.counties.reduce((a, c) => a + c.pop, 0); return D.counties.reduce((a, c) => a + D.value(ind, c, year) * c.pop, 0) / w; };

  /* election.elections / contests / candidates / results / turnouts / forms / stations */
  D.elections = [{ id: "2022", year: 2022, heldOn: "2022-08-09", kind: "general", status: "held" }, { id: "2017", year: 2017, heldOn: "2017-08-08", kind: "general", status: "held" }];
  D.contest = (county, year, kind) => {
    const r = D.rng(`E:${county.id}:${year}:${kind}`); const n = kind === "presidential" ? 3 : 3; const w = Array.from({ length: n }, () => 0.15 + r()); const s = w.reduce((a, b) => a + b, 0);
    const registered = Math.round(county.pop * 1000 * 0.55 * (0.9 + r() * 0.2)); const turnout = 0.55 + r() * 0.25; const cast = Math.round(registered * turnout);
    const cands = Array.from({ length: n }, (_, i) => { const nm = D.name(r); const p = i < 3 ? D.parties[i] : D.parties[3]; return { id: `${county.id}-${year}-${kind}-${i}`, name: kind === "presidential" ? ["Amina Wekesa", "Joseph Kiprono", "Grace Otieno"][i] : nm, party: p.id, votes: Math.round((cast * w[i]) / s), ballotOrder: i + 1 }; });
    cands.sort((a, b) => b.votes - a.votes);
    const rev = r() < 0.18 ? 2 : 1; return { county, year, kind, registered, cast, turnout, candidates: cands, stations: Math.round(registered / 480), status: rev > 1 ? "revised" : "verified", revision: rev, form: kind === "presidential" ? "Form 34C" : "Form 37A", forms: Math.round(registered / 480 * (0.97 + r() * 0.03)) };
  };
  D.nationalContest = (year) => { const rs = D.counties.map((c) => D.contest(c, year, "presidential")); const names = ["Amina Wekesa", "Joseph Kiprono", "Grace Otieno"]; const tot = names.map((n, i) => ({ name: n, party: D.parties[i].id, votes: rs.reduce((a, r) => a + (r.candidates.find((c) => c.name === n)?.votes || 0), 0) })).sort((a, b) => b.votes - a.votes);
    return { rs, tot, registered: rs.reduce((a, r) => a + r.registered, 0), cast: rs.reduce((a, r) => a + r.cast, 0) }; };

  /* legislature.sittings / bills / stages / votes / hansards / speeches */
  D.stages = ["First reading", "Committee", "Second reading", "Third reading", "Assent"];
  D.bills = [
    { id: "b1", title: "Water Services Reform Bill (sample)", house: "National Assembly", sponsor: "Committee on Water", stage: 3, topic: "Water", intro: "2026-02-10" },
    { id: "b2", title: "County Revenue Sharing Bill (sample)", house: "Senate", sponsor: "Senate Finance Committee", stage: 2, topic: "Finance", intro: "2026-03-18" },
    { id: "b3", title: "Public Procurement Transparency Bill (sample)", house: "National Assembly", sponsor: "Member for Westlands (sample)", stage: 4, topic: "Procurement", intro: "2025-10-02" },
    { id: "b4", title: "Voter Registration (Amendment) Bill (sample)", house: "National Assembly", sponsor: "Committee on Justice", stage: 1, topic: "Elections", intro: "2026-06-04" },
  ];
  D.votesFor = (bill) => { const r = D.rng("V:" + bill.id); return D.parties.slice(0, 3).map((p, i) => { const mem = [160, 140, 49][i]; const y = Math.round(mem * (0.3 + r() * 0.65)); const n = Math.round((mem - y) * (0.5 + r() * 0.4)); return { party: p.id, yes: y, no: n, abstain: Math.max(0, Math.round((mem - y - n) * 0.5)), absent: Math.max(0, mem - y - n - Math.round((mem - y - n) * 0.5)) }; }); };
  D.speeches = [
    { id: "s1", by: "Member for Kibra (sample)", date: "2026-03-04", sitting: "Sitting 112", text: "The water vendors in Kibra charge ten times the utility tariff. This bill must set a ceiling on what households pay per jerrican." },
    { id: "s2", by: "Chair, Committee on Water (sample)", date: "2026-03-04", sitting: "Sitting 112", text: "Mr. Speaker, the committee heard from county governments that reticulation grants arrive late and in the wrong quarter." },
    { id: "s3", by: "Member for Westlands (sample)", date: "2026-04-15", sitting: "Sitting 131", text: "Public procurement rules should require every contract variation above ten percent to be published in the portal within thirty days." },
    { id: "s4", by: "Senator (sample)", date: "2026-05-20", sitting: "Sitting 74", text: "Revenue sharing must follow population, poverty and land area, and the formula must be published before the financial year begins." },
  ];

  /* governance.powers / procedures — the power model (sample, simplified) */
  D.nodes = [
    { id: "pres", label: "President", arm: "Executive", x: .2, y: .14 }, { id: "cab", label: "Cabinet", arm: "Executive", x: .2, y: .42 }, { id: "gov", label: "Governors", arm: "Executive", x: .2, y: .72 },
    { id: "na", label: "National Assembly", arm: "Legislature", x: .52, y: .14 }, { id: "sen", label: "Senate", arm: "Legislature", x: .52, y: .42 }, { id: "ca", label: "County Assemblies", arm: "Legislature", x: .52, y: .72 },
    { id: "sc", label: "Supreme Court", arm: "Judiciary", x: .84, y: .14 }, { id: "jsc", label: "Judicial Service Commission", arm: "Judiciary", x: .84, y: .42 },
    { id: "iebc", label: "Electoral commission", arm: "Independent", x: .84, y: .72 }, { id: "oag", label: "Auditor-General", arm: "Independent", x: .52, y: .92 }, { id: "voters", label: "Voters", arm: "People", x: .2, y: .94 },
  ];
  D.edges = [
    ["pres", "cab", "nominates", "—", false], ["na", "cab", "vets and approves", "simple majority", true], ["voters", "pres", "elects", "50% + 1 and 25% in half the counties", true], ["voters", "gov", "elects", "plurality", true],
    ["voters", "na", "elects", "plurality per seat", true], ["na", "pres", "may remove", "two-thirds (then Senate)", true], ["sen", "gov", "tries removal", "simple majority", true], ["ca", "gov", "may initiate removal", "majority of members", false],
    ["sc", "pres", "rules on election disputes", "—", true], ["jsc", "sc", "nominates judges", "—", false], ["pres", "jsc", "appoints (on nomination)", "—", true], ["iebc", "voters", "runs elections for", "—", true],
    ["oag", "gov", "audits", "—", false], ["oag", "cab", "audits", "—", false], ["na", "oag", "approves appointment", "simple majority", true], ["sen", "ca", "oversees county funds", "—", false], ["ca", "gov", "scrutinises", "—", false],
  ];
  D.procedures = [
    { id: "pr1", title: "Removing a Governor (sample, simplified)", steps: [["County Assembly", "A member tables a motion citing grounds."], ["County Assembly", "The assembly votes; a majority of members passes it."], ["Senate", "Speaker of the Senate convenes a hearing within days; a committee investigates."], ["Senate", "Senate votes; a majority upholds or dismisses the charges."], ["Governor", "On removal, the Deputy Governor assumes office."]] },
    { id: "pr2", title: "Appointing a Cabinet Secretary (sample, simplified)", steps: [["President", "Nominates a candidate."], ["National Assembly", "Vetting committee holds a public hearing."], ["National Assembly", "Assembly approves or rejects within a set period."], ["President", "Appoints the approved nominee."]] },
  ];
  D.institutions = [
    { id: "i1", name: "Office of the President", arm: "Executive", offices: ["President", "Deputy President"], staff: 410, parent: null },
    { id: "i2", name: "National Assembly", arm: "Legislature", offices: ["Speaker", "Majority Leader", "349 Members"], staff: 1020, parent: null },
    { id: "i3", name: "Senate", arm: "Legislature", offices: ["Speaker", "67 Senators"], staff: 600, parent: null },
    { id: "i4", name: "The Judiciary", arm: "Judiciary", offices: ["Chief Justice", "Deputy Chief Justice", "Judges"], staff: 5400, parent: null },
    { id: "i5", name: "Electoral commission", arm: "Independent", offices: ["Chairperson", "Commissioners"], staff: 1100, parent: null },
    { id: "i6", name: "Office of the Auditor-General", arm: "Independent", offices: ["Auditor-General"], staff: 1300, parent: null },
    { id: "i7", name: "County governments (47)", arm: "Executive", offices: ["Governor", "Deputy Governor", "County Executive"], staff: 140000, parent: null },
  ];
  D.laws = [
    { id: "lw1", title: "Constitution (2010)", kind: "constitution", year: 2010, status: "in force", sections: 264 }, { id: "lw2", title: "Elections Act (2011, as amended)", kind: "act", year: 2011, status: "in force", sections: 112 },
    { id: "lw3", title: "Public Finance Management Act (2012)", kind: "act", year: 2012, status: "in force", sections: 214 }, { id: "lw4", title: "County Governments Act (2012)", kind: "act", year: 2012, status: "in force", sections: 148 },
  ];

  /* finance.budgets / revisions / appropriations / flows / findings; civic.procurements / bids / contracts / variations */
  D.sectors = ["Education", "Health", "Roads & transport", "Water & sanitation", "Agriculture", "Administration", "Security", "Energy"];
  D.budget = (pl) => { const r = D.rng("B:" + pl.at.join("/")); const scale = pl.depth === 0 ? 3600000 : pl.depth === 1 ? pl.county.pop * 22 : pl.county ? pl.county.pop * 22 / 4 : 1000; const w = D.sectors.map(() => 0.3 + r()); const t = w.reduce((a, b) => a + b, 0);
    const lines = D.sectors.map((s, i) => ({ sector: s, amount: Math.round(scale * w[i] / t) })); const total = lines.reduce((a, l) => a + l.amount, 0);
    return { lines, total, unit: pl.depth === 0 ? "KES million" : "KES million", revisions: [["Original", total], ["Supplementary I", Math.round(total * 1.04)], ["Supplementary II", Math.round(total * (0.99 + r() * 0.08))]], flows: ["Q1", "Q2", "Q3", "Q4"].map((q, i) => [q, Math.round(total / 4 * (0.7 + r() * 0.6) * (i + 1) / 2.5)]),
      findings: [["Unsupported payments", Math.round(total * 0.012)], ["Pending bills", Math.round(total * 0.03)], ["Irregular procurement", Math.round(total * 0.006)]], debt: Math.round(total * (0.4 + r() * 0.5)) }; };
  D.contracts = (pl) => { const r = D.rng("K:" + pl.at.join("/")); const sup = ["Savannah Works Ltd", "Pwani Civil Co.", "Ziwa Engineering", "Kilele Supplies", "Mto Water Systems", "Baobab Builders"]; const items = ["Borehole drilling", "Road rehabilitation", "Dispensary construction", "Classroom block", "Market shed", "Ambulance supply", "Street lighting", "Drug supply"];
    return Array.from({ length: 8 }, (_, i) => { const base = Math.round((20 + r() * 380) * 10) / 10; const v = r() < 0.5 ? 0 : Math.round(base * (0.05 + r() * 0.5) * 10) / 10; return { id: "k" + i, item: items[i], supplier: D.pick(r, sup), method: D.pick(r, ["Open tender", "Open tender", "Restricted", "Direct"]), bids: 1 + Math.floor(r() * 7), value: base, variation: v, awarded: "202" + (3 + Math.floor(r() * 3)), status: D.pick(r, ["in progress", "complete", "in progress", "stalled"]), progress: Math.round(r() * 100), lat: pl.node.lat + (r() - 0.5) * 0.6, lon: pl.node.lon + (r() - 0.5) * 0.6 }; }); };

  /* history.eras / occurrences / geography.changes */
  D.eras = [{ n: "Pre-colonial states and trade", from: 1000, to: 1895 }, { n: "British East Africa Protectorate", from: 1895, to: 1920 }, { n: "Colony and Protectorate of Kenya", from: 1920, to: 1963 }, { n: "Independent Kenya", from: 1963, to: 2026 }];
  D.occurrences = [
    { y: 1895, t: "East Africa Protectorate declared", kind: "governance" }, { y: 1920, t: "Kenya Colony established", kind: "governance" }, { y: 1963, t: "Independence (12 December)", kind: "event" },
    { y: 1992, t: "Return to multiparty elections", kind: "election" }, { y: 2010, t: "New Constitution promulgated (27 August)", kind: "law" }, { y: 2013, t: "47 counties begin operating; first devolved elections", kind: "governance" }, { y: 2022, t: "General election held (9 August, sample record)", kind: "election" },
  ];
  D.changes = [{ y: 1963, t: "Provinces and districts inherited from the colonial administration", n: 7 }, { y: 2010, t: "Constitution replaces 8 provinces with 47 counties", n: 47 }, { y: 2013, t: "County governments take office", n: 47 }];

  /* media.articles / assets / captions / uses */
  D.media = (pl) => {
    const r = D.rng("M:" + pl.at.join("/")); const hue = (i) => `linear-gradient(135deg,hsl(${(i * 47 + 12) % 360} 50% 38%),hsl(${(i * 47 + 52) % 360} 55% 24%))`;
    const kinds = ["image", "video", "audio", "image", "document", "video", "image", "image"]; const subj = ["Market day", "Borehole commissioning", "County assembly sitting", "Road works", "Oral history interview", "Polling station queue", "Dispensary opening", "Bridge inspection"];
    const assets = kinds.map((k, i) => ({ id: "a" + i, kind: k, title: subj[i] + " — " + pl.name, caption: { en: subj[i] + " in " + pl.name + " (sample caption).", sw: "Picha ya " + subj[i].toLowerCase() + " (mfano)." }, provider: k === "video" ? D.pick(r, ["YouTube", "Vimeo"]) : k === "audio" ? "Local archive" : "Local archive", availability: i === 5 ? "unavailable (checked 2026-11-20)" : "available", start: k === "video" ? Math.floor(r() * 90) : null, end: k === "video" ? 120 + Math.floor(r() * 200) : null, used: D.pick(r, [["Article: Water access", "Place: " + pl.name], ["Candidate profile"], ["Project record"]]), bg: hue(i + D.seed(pl.name) % 7), by: "Contributor (sample)", on: "2025-0" + (1 + i) + "-1" + i }));
    const arts = [["Explainer", "How county budgets are voted"], ["Profile", "Who represents " + pl.name], ["Investigation", "Contracts that grew after award"], ["History", "The names " + pl.name + " has carried"]].map((a, i) => ({ id: "ar" + i, category: a[0], title: a[1], by: "Mzizi desk (sample)", on: "2026-0" + (2 + i) + "-1" + i, reactions: 12 + Math.floor(r() * 120) }));
    return { assets, arts };
  };

  /* community.posts / replies / reactions / places / cases */
  D.posts = (pl) => {
    const base = [
      { id: "p1", kind: "report", by: "Resident (verified place)", body: "The borehole at the market has been dry for three weeks. Residents queue at the vendor and pay triple.", county: "nairobi", topic: "Water", proof: true, state: "published", reply: { by: "County Water Office", status: "published", body: "Technician assigned; pump parts ordered. Update by Friday." }, rx: { helpful: 34, same: 21 } },
      { id: "p2", kind: "question", by: "Resident", body: "Where can I see the contract for the new road? The sign says KES 240M but no supplier is named.", county: "nairobi", topic: "Roads", proof: false, state: "published", reply: null, rx: { helpful: 12, same: 8 } },
      { id: "p3", kind: "review", by: "Resident (verified place)", body: "Westlands dispensary now stocks essential drugs. Waiting time is still long on Mondays.", county: "nairobi", topic: "Health", proof: true, state: "published", rating: 4, reply: { by: "County Health Office", status: "received", body: "" }, rx: { helpful: 19, same: 5 } },
      { id: "p4", kind: "comment", by: "Resident", body: "Thank you for publishing the ward budget in Kiswahili. It made the meeting much easier.", county: "kisumu", topic: "Budget", proof: false, state: "published", reply: null, rx: { helpful: 27, same: 3 } },
      { id: "p5", kind: "report", by: "Resident (verified place)", body: "A culvert on the road to the lakeshore has collapsed after the rains.", county: "kisumu", topic: "Roads", proof: true, state: "published", reply: { by: "County Roads Office", status: "published", body: "Inspection done; works scheduled." }, rx: { helpful: 41, same: 30 } },
      { id: "p6", kind: "question", by: "Resident", body: "Which projects were promised for this ward in 2022, and which are complete?", county: "nakuru", topic: "Promises", proof: false, state: "published", reply: null, rx: { helpful: 9, same: 14 } },
    ];
    return pl.depth === 0 ? base : base.filter((p) => !pl.county || p.county === pl.county.id).concat(base.filter((p) => pl.county && p.county !== pl.county.id).slice(0, 1));
  };
  /* source.* — evidence path and review queue */
  D.sources = [
    { id: "S1", title: "Constitution of Kenya (PDF, official publisher)", kind: "Law", fmt: "PDF", status: "Extracted", retrieved: "2026-11-02", robots: "n/a (document)", sha: "9f2c…a71e", cand: 14, acc: 9 },
    { id: "S2", title: "Election results portal (form images)", kind: "Election", fmt: "Image + OCR", status: "Needs review", retrieved: "2026-11-05", robots: "respect · allowed", sha: "41bd…03c9", cand: 22, acc: 6 },
    { id: "S3", title: "National gazetteer of places", kind: "Geography", fmt: "Dataset", status: "Queued", retrieved: "2026-11-09", robots: "respect · allowed", sha: "c0de…55aa", cand: 0, acc: 0 },
    { id: "S4", title: "Budget execution reports (county)", kind: "Finance", fmt: "XLSX", status: "Extracted", retrieved: "2026-11-11", robots: "respect · allowed", sha: "7a10…e2b4", cand: 31, acc: 28 },
    { id: "S5", title: "Hansard transcripts (parliament portal)", kind: "Legislature", fmt: "HTML", status: "Extracted", retrieved: "2026-11-14", robots: "override · approved scope, rationale on file", sha: "b33f…19d0", cand: 40, acc: 17 },
  ];
  D.candidates = [
    { id: "C1", src: "S2", claim: "Form 34A result for polling station 031 shows 412 votes for candidate B", conf: 0.71, state: "pending", note: "OCR confidence low on the last digit." },
    { id: "C2", src: "S2", claim: "Station 031 turnout 78%", conf: 0.88, state: "pending", note: "Matches the total on the form." },
    { id: "C3", src: "S5", claim: "Bill B3 passed second reading on 2026-04-15", conf: 0.93, state: "pending", note: "Seen in two Hansard sittings." },
    { id: "C4", src: "S1", claim: "Article 6 lists 47 counties", conf: 0.97, state: "pending", note: "Schedule 1 agrees." },
  ];
})();
