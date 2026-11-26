/* Government views: leaders (governance.holders, official.individuals), institutions, power model (governance.powers/procedures), laws (legal.*). */
(function () {
  const esc = P.esc, fmt = D.fmt, V_ = window.V;
  const ARM = { Executive: "var(--c1)", Legislature: "var(--c2)", Judiciary: "var(--c4)", Independent: "var(--c5)", People: "var(--c3)" };

  /* ---------- Leaders ---------- */
  P.views.leaders = () => {
    const id = P.q1("view.id", ""); const l = id && D.leader(id); if (l) return leader(l);
    const lvl = P.q1("filters.level", "all"); let ls = D.leadersFor(P.pl); const levels = [...new Set(ls.map((x) => x.level))];
    if (lvl !== "all") ls = ls.filter((x) => x.level === lvl);
    const byParty = D.parties.map((p) => ({ name: p.name, v: ls.filter((x) => x.party === p.id).length, color: p.color })).filter((x) => x.v);
    const card = (x) => `<a class="person" href="${P.href({ at: x.placeAt, view: "leaders", set: { "view.id": x.id } })}"><span class="av" style="background:${x.color}">${x.initials}</span><span><b>${esc(x.name)}</b><small>${esc(x.office)}<br>${esc(x.place)}</small><br>${P.chip(D.party(x.party).short)} <span class="muted sm">since ${x.since}</span></span></a>`;
    const arms = P.pl.depth <= 1 ? "" : "";
    return P.head("Leadership", `Everyone who holds office for ${esc(P.pl.name)} and the places inside it. Open a person for their tenure, promises, votes and projects.`, `<div class="row">${P.select("filters.level", [["all", "All levels"]].concat(levels.map((x) => [x, x])), lvl, "Level")}${P.pl.depth === 0 ? `<a class="btn" href="${P.href({ view: "power" })}">${P.icon("network")} Power model</a>` : ""}</div>`) +
      `<div class="stack"><div class="split">${P.panel("Office-holders (" + ls.length + ")", ls.length ? `<div class="people">${ls.slice(0, 48).map(card).join("")}</div>` : '<div class="empty">No office-holders loaded here.</div>', { id: "holders", sub: "governance.holders ⨝ offices ⨝ individuals" })}
      <div class="stack">${P.panel("By party", V_.donut(byParty, { center: ls.length, sub: "office-holders" }), { id: "parties", sub: "politics.memberships" })}${P.panel("Why leadership has a start and an end", `<p class="sm" style="margin-top:0">Each holder row ties a <b>person</b> to an <b>office</b> for a <b>term</b>, with how they got there (elected, appointed) and why it ended (term end, resignation, removal). A seat is never “owned” by a name.</p>`, { id: "why" })}</div></div></div>`;
  };
  function leader(l) {
    const cm = D.commitments(l); const done = cm.filter((c) => c.status === "delivered").length; const sp = D.speeches.slice(0, 2);
    const rows = l.past.concat([{ office: l.office, from: l.since, to: 2026, place: l.place }]).map((p) => ({ label: p.office, segs: [{ from: p.from, to: p.to, text: p.place, color: p.office === l.office ? "var(--accent)" : "var(--c4)" }] }));
    const vote = [["Yes", 22, "var(--c2)"], ["No", 6, "var(--c1)"], ["Abstained", 3, "var(--c3)"], ["Absent", 4, "var(--line)"]];
    return `<div class="pagehead"><span class="av" style="background:${l.color};width:72px;height:72px;font-size:26px">${l.initials}</span><div><span class="eyebrow">${esc(l.level)} · ${esc(l.place)}</span><h1>${esc(l.name)}</h1><p>${esc(l.office)} · ${P.chip(D.party(l.party).name)} · ${esc(l.method)}</p></div><div class="tools"><a class="btn" href="${P.href({ set: { "view.id": "" } })}">← All leaders</a><button class="btn" data-act="follow">${P.icon("bell")} Follow</button></div></div>
    <div class="stack"><div class="grid g4">${P.stat("In office since", l.since, "current term")}${P.stat("Born", l.born, "official.individuals")}${P.stat("Promises delivered", `${done} of ${cm.length}`, "politics.fulfilments")}${P.stat("Won with", fmt(30000 + (D.seed(l.id) % 90000)) + " votes", l.contest || "")}</div>
    ${P.panel("Career and tenure", V_.timeline(rows, 1998, 2030), { id: "tenure", sub: "governance.terms · holders" })}
    <div class="split">${P.panel("Promises", cm.map((c) => `<div style="padding:8px 0;border-bottom:1px solid var(--line)"><b>${esc(c.statement)}</b><div class="row" style="margin-top:4px">${P.chip(c.status, c.status === "delivered" ? "ok" : c.status === "no evidence" ? "bad" : "warn")}<span class="muted sm">${c.done}/${c.quantity} ${c.unit} · due ${c.dueOn}</span>${c.evidence.map((e) => P.chip(e, "mute")).join(" ")}</div></div>`).join(""), { id: "promises", sub: "politics.commitments" })}
    <div class="stack">${P.panel("Voting record (sample)", V_.stack([{ label: "Last 35 votes", parts: vote.map((v) => ({ name: v[0], v: v[1], color: v[2] })) }], { lw: 90 }) + V_.legend(vote.map((v) => [v[0] + " " + v[1], v[2]])), { id: "votes", sub: "legislature.votes" })}${P.panel("In the chamber", sp.map((s) => `<p class="sm"><span class="muted">${s.date}</span> ${esc(s.text)}</p>`).join(""), { id: "speeches", sub: "legislature.speeches" })}${P.panel("Declared interests", '<div class="empty sm">Not loaded in this sample (official.relationships).</div>', { id: "interests" })}</div></div></div>`;
  }
  document.addEventListener("click", (e) => { if (e.target.closest("[data-act='follow']")) P.toast("Following. You will be told when this office-holder’s record changes."); });

  /* ---------- Institutions ---------- */
  P.views.institutions = () => {
    const id = P.q1("view.id", ""); const i = D.institutions.find((x) => x.id === id);
    const list = P.table([{ h: "Institution" }, { h: "Arm" }, { h: "Offices" }, { h: "Staff", n: 1 }], D.institutions.map((x) => ({ href: P.href({ set: { "view.id": x.id } }), hl: i && i.id === x.id, c: [`<b>${esc(x.name)}</b>`, `<span style="color:${ARM[x.arm]}">●</span> ${x.arm}`, esc(x.offices.join(", ")), fmt(x.staff)] })));
    const detail = i ? P.panel(i.name, `<div class="grid g3">${P.stat("Arm", i.arm)}${P.stat("Staff", fmt(i.staff))}${P.stat("Offices", i.offices.length)}</div><h3 class="eyebrow" style="margin-top:14px">Offices (governance.offices)</h3><div class="row">${i.offices.map((o) => P.chip(o)).join("")}</div><h3 class="eyebrow" style="margin-top:14px">Powers held</h3>${D.edges.filter((e) => D.nodes.find((n) => n.id === e[0]).label.toLowerCase().split(" ")[0] === i.name.toLowerCase().split(" ")[0] || false).length ? "" : `<p class="sm muted">See the <a href="${P.href({ view: "power", at: ["ke"] })}">power model</a> for what this institution can do to others.</p>`}`, { id: "detail" }) : "";
    const arms = ["Executive", "Legislature", "Judiciary", "Independent"].map((a) => `<div class="arm" style="border-top:4px solid ${ARM[a]}"><h3>${a}</h3><div class="sm muted">${D.institutions.filter((x) => x.arm === a).map((x) => esc(x.name)).join("<br>") || "—"}</div></div>`).join("");
    return P.head("Institutions", "Public bodies, what offices they have and where they sit in the system.") + `<div class="stack"><div class="grid g4">${arms}</div><div class="split">${P.panel("Directory", list, { id: "directory", sub: "governance.institutions" })}${detail || P.panel("Select one", '<div class="empty">Choose an institution to see its offices and powers.</div>', { id: "detail" })}</div></div>`;
  };

  /* ---------- Power model ---------- */
  P.views.power = () => {
    const nodeId = P.q1("view.node", ""); const proc = D.procedures.find((p) => p.id === P.q1("view.proc", "pr1")) || D.procedures[0];
    P.after(() => { const el = document.getElementById("graph"); if (!el) return; const g = V_.graph(el, { nodes: D.nodes, edges: D.edges, selected: nodeId ? { type: "node", id: nodeId } : null, onPick: (s) => { const d = document.getElementById("pdetail"); d.innerHTML = s ? detail(s) : hint; } }); });
    const hint = '<div class="empty sm">Click a box or an arrow. Drag boxes to rearrange.</div>';
    const detail = (s) => { if (s.type === "node") { const n = D.nodes.find((x) => x.id === s.id); const out = D.edges.filter((e) => e[0] === s.id), inn = D.edges.filter((e) => e[1] === s.id); const lab = (id) => D.nodes.find((x) => x.id === id).label;
      return `<h3 style="font-size:18px">${esc(n.label)}</h3><span class="chip" style="background:${ARM[n.arm]};color:#fff">${n.arm}</span><h4 class="eyebrow" style="margin:12px 0 4px">Can act on</h4>${out.map((e) => `<div class="sm">${esc(e[2])} <b>${esc(lab(e[1]))}</b> ${e[4] ? P.chip("binding", "ok") : P.chip("advisory", "mute")}</div>`).join("") || '<span class="muted sm">Nothing in this sample.</span>'}<h4 class="eyebrow" style="margin:12px 0 4px">Checked by</h4>${inn.map((e) => `<div class="sm"><b>${esc(lab(e[0]))}</b> ${esc(e[2])}</div>`).join("") || '<span class="muted sm">—</span>'}`; }
      const e = D.edges[s.idx]; const a = D.nodes.find((x) => x.id === e[0]), b = D.nodes.find((x) => x.id === e[1]);
      return `<h3 style="font-size:18px">${esc(a.label)} → ${esc(b.label)}</h3><table><tbody><tr><td>Power</td><td><b>${esc(e[2])}</b></td></tr><tr><td>Threshold</td><td>${esc(e[3])}</td></tr><tr><td>Effect</td><td>${e[4] ? P.chip("binding", "ok") : P.chip("advisory", "mute")}</td></tr></tbody></table><p class="sm muted">A row of <code>governance.powers</code>: <code>fromId</code>, <code>toId</code>, <code>kindTerm</code>, <code>thresholdTerm</code>, <code>isBinding</code>, optional <code>procedureId</code> and <code>step</code>.</p>`; };
    const selStart = nodeId ? detail({ type: "node", id: nodeId }) : hint;
    return P.head("Power model", "Who can appoint, approve, remove, audit or overrule whom. Every arrow is a recorded power with a threshold and a procedure.") +
      `<div class="stack"><div class="split">${P.panel("Who checks whom", `<div class="graphbox" id="graph"></div><div class="legend">${Object.keys(ARM).map((a) => `<span><i style="background:${ARM[a]}"></i>${a}</span>`).join("")}<span>━ binding</span><span>┅ advisory</span></div>`, { id: "graph-panel", sub: "governance.powers" })}${P.panel("Detail", `<div id="pdetail">${selStart}</div>`, { id: "detail" })}</div>
      <div class="cols3">${["Executive", "Legislature", "Judiciary"].map((a) => `<div class="arm" style="border-top:4px solid ${ARM[a]}"><h3>${a}</h3><p class="sm muted" style="margin:0">${a === "Executive" ? "Runs government and proposes the budget." : a === "Legislature" ? "Makes law, approves appointments, scrutinises." : "Interprets law and settles disputes."}</p></div>`).join("")}</div>
      ${P.panel("Procedures", `<div style="margin-bottom:10px">${P.seg("view.proc", D.procedures.map((p) => [p.id, p.title.split(" (")[0]]), proc.id, "Procedure")}</div><ol class="steps">${proc.steps.map((s) => `<li><span><b>${esc(s[0])}</b> — ${esc(s[1])}</span></li>`).join("")}</ol><p class="sm muted">Sample and simplified; thresholds and timings come from the legal text once extracted (<code>governance.procedures</code>, <code>powers.step</code>).</p>`, { id: "procedures", sub: "governance.procedures" })}</div>`;
  };

  /* ---------- Laws ---------- */
  P.views.law = () => {
    const rows = D.laws.map((l) => ({ c: [`<b>${esc(l.title)}</b>`, P.chip(l.kind), l.year, P.chip(l.status, "ok"), fmt(l.sections)] }));
    return P.head("Laws", "Constitution, acts and instruments, with amendments tracked over time and sections linked to what they say.") + `<div class="stack">${P.panel("Instruments", P.table([{ h: "Title" }, { h: "Kind" }, { h: "Year" }, { h: "Status" }, { h: "Provisions", n: 1 }], rows), { id: "instruments", sub: "legal.instruments · provisions" })}${P.panel("Provisions that reference this place’s offices", '<div class="empty">Loaded when legal text extraction is reviewed.</div>', { id: "refs" })}</div>`;
  };
})();
