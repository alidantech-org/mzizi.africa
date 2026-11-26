/* Sample data for services, projects, events and parties. Fictional and illustrative; NOT verified records.
   Shapes follow civic.facilities / civic.services / civic.projects / event.occurrences / politics.parties. Fields the schemas
   do not model (opening hours, accessibility claims) are deliberately absent, and the UI says "not recorded". */
(function () {
  const hav = (a, b, c, d) => { const R = 6371, t = (x) => (x * Math.PI) / 180; const dl = t(c - a), dn = t(d - b); const h = Math.sin(dl / 2) ** 2 + Math.cos(t(a)) * Math.cos(t(c)) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  D.dist = hav;

  /* ---- services and facilities (civic.services is the service, civic.facilities the building) ---- */
  D.CATS = [["gov", "Government offices"], ["health", "Hospitals and clinics"], ["edu", "Schools and education"], ["police", "Police and security"], ["courts", "Courts and legal services"], ["utility", "Utilities"], ["social", "Social services"], ["transport", "Public transport"]];
  D.CATCOL = { gov: "--c1", health: "--c2", edu: "--c4", police: "--c5", courts: "--c3", utility: "--c4", social: "--c2", transport: "--c1" };
  const SVC = { gov: ["Civil registration", "Permits and licences", "Public information desk"], health: ["Outpatient care", "Maternal and child health", "Immunisation", "Laboratory tests"], edu: ["Primary education", "Secondary education"], police: ["Report an incident", "Occurrence book entry"], courts: ["Registry and filing", "Small claims"], utility: ["Water connection", "Billing enquiries"], social: ["Social protection enquiries", "Community support desk"], transport: ["Bus terminus", "Matatu stage"] };
  const SING = { gov: "Government Office", health: "Health Centre", edu: "School", police: "Police Station", courts: "Court Registry", utility: "Utility Office", social: "Social Services Office", transport: "Transport Stage" };
  const OPS = ["County government", "National government", "Private (licensed)", "Faith-based (registered)"];
  D.servicesList = (cat) => SVC[cat] || [];
  D.facilitiesFor = (pl) => { const key = pl.at.join("/"), r = D.rng("FAC:" + key), spread = pl.depth === 0 ? 3.2 : pl.depth === 1 ? 0.22 : pl.depth === 2 ? 0.1 : 0.05; const out = [];
    D.CATS.forEach(([cat]) => { const n = 3 + Math.floor(r() * 3); for (let i = 0; i < n; i++) { const lat = pl.node.lat + (r() - 0.5) * 2 * spread, lon = pl.node.lon + (r() - 0.5) * 2 * spread; const ops = cat === "police" || cat === "courts" ? OPS[1] : cat === "gov" ? OPS[r() < 0.5 ? 0 : 1] : OPS[Math.floor(r() * 4)];
      const sv = SVC[cat].filter(() => r() < 0.75); out.push({ id: `f-${D.seed(key + cat + i).toString(36)}`, name: `${pl.depth ? pl.name : "Kenya"} ${SING[cat]} ${i + 1} (sample)`, cat, lat, lon, status: r() < 0.08 ? "under-construction" : r() < 0.04 ? "closed" : "operational", operator: ops, services: sv.length ? sv : [SVC[cat][0]], contact: r() < 0.6, updated: "2026-0" + (3 + Math.floor(r() * 7)) + "-1" + Math.floor(r() * 9), reviews: Math.floor(r() * 14), dist: hav(pl.node.lat, pl.node.lon, lat, lon) }); } });
    return out.sort((a, b) => a.dist - b.dist); };

  /* ---- projects (civic.projects, sites, deliveries, contracts; finance.* for money) ---- */
  const SECT = ["Roads", "Health", "Water", "Education", "Markets", "Energy"];
  const PN = { Roads: "road resurfacing", Health: "dispensary upgrade", Water: "borehole and pipeline", Education: "classroom block", Markets: "market shed", Energy: "street lighting" };
  D.projectsFor = (pl) => { const key = pl.at.join("/"), r = D.rng("PRJ:" + key), nm = pl.depth ? pl.name : "National";
    return Array.from({ length: 9 }, (_, i) => { const sec = SECT[i % 6], st = D.pick(r, ["planned", "ongoing", "ongoing", "complete", "stalled", "ongoing", "complete", "abandoned", "ongoing"]); const total = Math.round(20 + r() * 380); const stages = { allocated: total, approved: r() < 0.9 ? total : null, committed: st === "planned" ? null : Math.round(total * 0.95), contracted: st === "planned" ? null : Math.round(total * (0.8 + r() * 0.2)), disbursed: st === "planned" ? null : r() < 0.7 ? Math.round(total * (0.2 + r() * 0.7)) : null, spent: st === "planned" ? null : r() < 0.5 ? Math.round(total * (0.1 + r() * 0.6)) : null };
      const rep = st === "planned" || r() < 0.35 ? null : { pct: st === "complete" ? 100 : Math.round(10 + r() * 80), source: D.pick(r, ["County progress report", "Implementing agency report", "Auditor-General report"]), date: "2026-0" + (4 + Math.floor(r() * 6)) + "-" + (10 + Math.floor(r() * 18)) };
      const link = () => D.pick(r, ["linked (reviewed)", "linked (reviewed)", "no link recorded", "candidate link, awaiting review"]);
      return { id: "pr" + i + D.seed(key).toString(36).slice(0, 3), name: `${nm} ${PN[sec]} ${Math.floor(i / 6) + 1} (sample)`, sector: sec, status: st, institution: D.pick(r, ["County works department (sample)", "County water company (sample)", "National roads agency (sample)", "County health department (sample)"]), sponsor: D.pick(r, ["County revenue", "National government transfer", "Development partner (sample)"]), implementer: D.pick(r, ["Savannah Works Ltd", "Pwani Civil Co.", "Ziwa Engineering", "Kilele Supplies"]), stages, unit: "KES million", reported: rep, scope: pl.depth >= 2 ? `${pl.name} ${pl.level.toLowerCase()}` : D.pick(r, ["Ward-level", "Constituency-level", "County-wide"]), lat: pl.node.lat + (r() - 0.5) * (pl.depth > 1 ? 0.06 : 0.5), lon: pl.node.lon + (r() - 0.5) * (pl.depth > 1 ? 0.06 : 0.5), start: "202" + (3 + Math.floor(r() * 3)) + "-0" + (1 + Math.floor(r() * 8)) + "-01", media: Math.floor(r() * 9), docs: 1 + Math.floor(r() * 4),
        updates: [{ date: "2026-09-12", text: "Contractor mobilised to site.", src: "Implementing agency report", cls: "official" }, { date: "2026-10-30", text: "Section one completed; crossing still being finished.", src: "Resident observation, firsthand", cls: "community" }].slice(0, rep ? 2 : 1),
        trail: [["Promise or policy", link()], ["Law or policy action", link()], ["Budget allocation", stages.approved ? "linked (reviewed)" : "no link recorded"], ["Procurement and contract", st === "planned" ? "no link recorded" : "linked (reviewed)"], ["Delivery on the ground", rep ? "reported (dated source)" : "no observation recorded"], ["Evidence and assessment", link()]] }; }); };

  /* ---- events (event.events, occurrences; status expected/scheduled/held/postponed/cancelled; date knowledge announced/gazetted/estimated) ---- */
  D.EVT = [["election", "Election calendar"], ["parliament", "Parliamentary sittings"], ["assembly", "County assembly"], ["participation", "Public participation"], ["holiday", "Public holidays"], ["deadline", "Civic deadlines"]];
  D.EVTCOL = { election: "--c1", parliament: "--c2", assembly: "--c4", participation: "--c5", holiday: "--c3", deadline: "--c1" };
  const E = (id, type, title, date, status, know, scope, org, extra) => Object.assign({ id, type, title, date, end: date, status, know, scope, org, format: "in person", src: "Source on record" }, extra || {});
  D.EVENTS = [
    E("e1", "holiday", "Jamhuri Day", "2026-12-12", "scheduled", "gazetted", "ke", "Public holiday (national)"),
    E("e2", "holiday", "Christmas Day", "2026-12-25", "scheduled", "gazetted", "ke", "Public holiday (national)"),
    E("e3", "holiday", "Boxing Day", "2026-12-26", "scheduled", "gazetted", "ke", "Public holiday (national)"),
    E("e4", "holiday", "New Year’s Day", "2027-01-01", "scheduled", "gazetted", "ke", "Public holiday (national)"),
    E("e5", "election", "General election (expected)", "2027-08-10", "expected", "estimated", "ke", "Electoral commission", { note: "Estimated from the constitutional schedule (second Tuesday in August, every fifth year). Not an official announcement.", end: "2027-08-10" }),
    E("e6", "election", "Voter registration drive (sample)", "2026-12-15", "scheduled", "announced", "ke/nairobi", "Electoral commission", { end: "2027-01-15" }),
    E("e7", "parliament", "Sitting: second reading, Water Services Reform Bill", "2026-12-01", "scheduled", "announced", "ke", "National Assembly", { format: "in person" }),
    E("e8", "parliament", "Committee of the whole: Procurement Transparency Bill", "2026-12-02", "scheduled", "announced", "ke", "National Assembly"),
    E("e9", "parliament", "Senate sitting: County Revenue Sharing Bill", "2026-12-03", "scheduled", "announced", "ke", "Senate"),
    E("e10", "assembly", "Nairobi County Assembly sitting (sample)", "2026-12-08", "scheduled", "announced", "ke/nairobi", "County assembly"),
    E("e11", "participation", "Public hearing: county budget estimates (sample)", "2026-12-02", "scheduled", "announced", "ke/nairobi", "County executive", { format: "in person and online", end: "2026-12-02" }),
    E("e12", "participation", "Ward forum: water access (sample)", "2026-12-18", "scheduled", "announced", "ke/nairobi/westlands/parklands", "Ward administrator"),
    E("e13", "deadline", "Register inspection closes (sample)", "2027-01-20", "expected", "estimated", "ke", "Electoral commission", { note: "Date depends on the register timetable, which has not been gazetted." }),
    E("e14", "assembly", "Kisumu County Assembly sitting (sample)", "2026-12-09", "scheduled", "announced", "ke/kisumu", "County assembly"),
    E("e15", "participation", "Public hearing: roads priority list (sample)", "2026-12-10", "postponed", "announced", "ke/kisumu", "County executive", { note: "Postponed. A new date has not been announced." }),
  ];
  D.eventsFor = (pl) => D.EVENTS.filter((e) => e.scope === "ke" || pl.at.join("/").startsWith(e.scope) || e.scope.startsWith(pl.at.join("/") + "/") || e.scope === pl.at.join("/"));

  /* ---- parties (politics.parties, memberships, coalitions, manifestos) ---- */
  D.partyProfiles = () => D.parties.filter((p) => p.id !== "ind").map((p, i) => { const r = D.rng("PTY:" + p.id); const seats = D.leaders().filter((l) => l.party === p.id && l.level !== "Country"); const reg = ["Registered (sample date)", "Registered (sample date)", "Registered (sample date)"][i];
    return { ...p, reg, leader: { name: D.name(r), role: "Party leader", since: 2019 + Math.floor(r() * 4) }, officials: [...Array(3)].map((_, k) => ({ name: D.name(r), role: ["Secretary-General", "Chairperson", "Treasurer"][k] })), seats: seats.length, coalition: i < 2 ? "Coalition (sample)" : "None recorded", manifestos: [{ year: 2022, title: p.name + " manifesto 2022 (sample)", commitments: 20 + Math.floor(r() * 30) }, { year: 2017, title: p.name + " manifesto 2017 (sample)", commitments: 15 + Math.floor(r() * 25) }],
      move: [{ who: D.name(r), from: "Independent", to: p.short, year: 2020 + Math.floor(r() * 3) }, { who: D.name(r), from: p.short, to: D.parties[(i + 1) % 3].short, year: 2021 + Math.floor(r() * 2) }] }; });
})();
