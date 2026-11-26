/* Core: preferences (cookies), URL state, availability rules, paint-first rendering, scroll keeping.
   Mirrors .docs/rules/web-navigation.md and loading-states.md. The real app puts the place in the path
   (/ke/nairobi/westlands); a static file cannot, so the place is the `at` query key here and nothing else changes. */
(function () {
  const P = (window.P = { views: {}, mounts: [], gen: 0 });
  /* Documented scheme: /<country>/<place…>?view=&view.id=&filters.*  (path = place). Hosts that cannot serve deep paths (file://, a plain index.html, the artifact sandbox) fall back to ?at=. */
  P.pathMode = location.protocol !== "file:" && !/\.html?$/.test(location.pathname);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  P.esc = esc;
  /* ---- preferences: one cookie per topic (localStorage fallback on file://) ---- */
  P.store = {
    get(k) { try { const m = document.cookie.match(new RegExp("(?:^|; )" + k + "=([^;]*)")); if (m) return decodeURIComponent(m[1]); } catch (e) {} try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { document.cookie = k + "=" + encodeURIComponent(v) + ";path=/;max-age=31536000;samesite=lax"; } catch (e) {} try { localStorage.setItem(k, v); } catch (e) {} },
  };
  const K = { theme: "mzizi-proto-theme", side: "mzizi-proto-side", groups: "mzizi-proto-groups", place: "mzizi-proto-place", a11y: "mzizi-proto-a11y", saved: "mzizi-proto-saved" };
  P.K = K;
  P.pref = {
    theme() { const v = (P.store.get(K.theme) || "system.terra").split("."); return { mode: v[0], palette: v[1] || "terra" }; },
    setTheme(mode, palette) { P.store.set(K.theme, mode + "." + palette); P.applyTheme(); },
    side() { const v = (P.store.get(K.side) || "open").split("."); return v[0]; },
    setSide(m) { P.store.set(K.side, m); P.applySide(); },
    groups() { return (P.store.get(K.groups) || "").split(",").filter(Boolean); },
    setGroups(a) { P.store.set(K.groups, a.join(",")); },
    a11y() { const v = (P.store.get(K.a11y) || "m.on").split("."); return { size: v[0], motion: v[1] }; },
    saved() { try { return JSON.parse(P.store.get(K.saved) || "null") || [{ label: "Home", at: ["ke", "nairobi"], isHome: false }]; } catch (e) { return []; } },
    setSaved(a) { P.store.set(K.saved, JSON.stringify(a)); },
  };
  P.applyTheme = () => { const t = P.pref.theme(); const m = t.mode === "system" ? (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light") : t.mode; document.documentElement.dataset.mode = m; document.documentElement.dataset.palette = t.palette; };
  P.applySide = () => { document.documentElement.dataset.side = { open: "open", rail: "rail", hidden: "hidden" }[P.pref.side()] || "open"; };
  P.applyA11y = () => { const a = P.pref.a11y(); document.documentElement.dataset.size = a.size; document.documentElement.dataset.motion = a.motion; };

  /* ---- navigation vocabulary (src/app/demo/_lib/navigation/route.ts) ---- */
  P.GROUPS = ["Place", "Politics", "Government", "Money", "Data"];
  P.NAV = [
    ["overview", "Place", "home", 9, "Overview"], ["atlas", "Place", "map", 9, "Atlas"], ["history", "Place", "clock", 1, "History"], ["media", "Place", "image", 9, "Media"], ["community", "Place", "message", 9, "Community"],
    ["elections", "Politics", "vote", 3, "Elections"], ["parliament", "Politics", "landmark", 1, "Parliament"], ["promises", "Politics", "flag", 3, "Promises"],
    ["leaders", "Government", "users", 3, "Leadership"], ["institutions", "Government", "building", 1, "Institutions"], ["power", "Government", "network", 0, "Power model"], ["law", "Government", "gavel", 0, "Laws"],
    ["finance", "Money", "coins", 2, "Finance"], ["suppliers", "Money", "layers", 2, "Suppliers"],
    ["statistics", "Data", "chart", 3, "Statistics"], ["compare", "Data", "compare", 1, "Compare"], ["sources", "Data", "library", 9, "Sources"],
  ].map((a) => ({ id: a[0], group: a[1], icon: a[2], max: a[3], label: a[4] }));
  P.nav = (id) => P.NAV.find((n) => n.id === id);
  const SW = { Overview: "Muhtasari", Atlas: "Atlasi", History: "Historia", Media: "Vyombo vya habari", Community: "Jamii", Elections: "Uchaguzi", Parliament: "Bunge", Promises: "Ahadi", Leadership: "Uongozi", Institutions: "Taasisi", "Power model": "Mfumo wa mamlaka", Laws: "Sheria", Finance: "Fedha", Suppliers: "Wasambazaji", Statistics: "Takwimu", Compare: "Linganisha", Sources: "Vyanzo", Place: "Mahali", Politics: "Siasa", Government: "Serikali", Money: "Pesa", Data: "Data" };
  P.t = (s) => (P.q && P.q.lang === "sw" && SW[s]) || s;
  const LEVELS = ["country", "county", "constituency", "ward"];
  P.whyUnavailable = (id, pl) => { const n = P.nav(id); if (!pl.ok) return null; if (pl.depth > n.max) return `${n.label} only applies down to ${LEVELS[n.max]} level. You are at ${LEVELS[pl.depth]} level. Go up to ${n.max === 0 ? "the country" : "a " + LEVELS[n.max]} to open it.`; return null; };
  /* Which query keys each view owns. Anything else is dropped when the subject changes. */
  P.ALLOWED = { atlas: ["view.layer", "view.ind", "view.year"], history: ["view.year"], media: ["view.id", "display.lang", "filters.kind"], community: ["filters.kind", "filters.topic", "sort.by"], elections: ["view.id", "view.contest", "view.year", "sort.by"], parliament: ["view.id", "view.tab", "filters.q"], promises: ["filters.status", "filters.topic"], leaders: ["view.id", "filters.level"], institutions: ["view.id"], power: ["view.node", "view.proc"], law: ["view.id"], finance: ["view.tab"], suppliers: ["filters.status", "sort.by", "view.id"], statistics: ["view.indicator", "view.break", "view.from"], compare: ["view.ids", "view.indicator"], sources: ["view.id", "view.tab"] };

  /* ---- URL state ---- */
  P.parse = () => {
    const sp = new URLSearchParams(location.search); const q = {}; sp.forEach((v, k) => (q[k] = v));
    const at = (P.pathMode ? location.pathname : "/" + (q.at || "ke")).split("/").filter(Boolean); if (!at.length) at.push("ke"); delete q.at; const pl = D.place(at); const raw = q.view || "overview"; const view = P.nav(raw) ? raw : "overview";
    P.q = q; P.at = at; P.pl = pl; P.view = view; P.hash = location.hash.replace("#", ""); P.errors = [];
    if (!P.nav(raw)) P.errors.push(`Unknown view "${raw}".`);
    if (!pl.ok) P.errors.push(pl.error);
    Object.keys(q).forEach((k) => { if (["at", "view", "lang"].includes(k) || !/^(view|filters|sort|page|display)\./.test(k)) return; if (!(P.ALLOWED[view] || []).includes(k)) P.errors.push(`"${k}" is not used by the ${P.nav(view).label} view.`); });
    return q;
  };
  /** patch: {at, view, set:{k:v}, keep:true (carry current params), hash} — nothing is carried implicitly when the subject changes. */
  P.href = (patch = {}) => {
    const at = patch.at || P.at; const view = patch.view || P.view; const sameSubject = view === P.view; const p = new URLSearchParams();
    if (!P.pathMode) p.set("at", at.join("/")); if (view !== "overview") p.set("view", view);
    const base = patch.keep || (sameSubject && patch.set) ? Object.assign({}, P.q) : {};
    Object.keys(base).forEach((k) => { if (/^(view|filters|sort|page|display)\./.test(k) && (P.ALLOWED[view] || []).includes(k)) base[k] = base[k]; else delete base[k]; });
    if (patch.at && patch.at.join("/") !== P.at.join("/") && patch.dropOnPlace) patch.dropOnPlace.forEach((k) => delete base[k]);
    Object.assign(base, patch.set || {}); Object.keys(base).forEach((k) => { if (base[k] === "" || base[k] == null) return; p.set(k, base[k]); });
    if (P.q.lang) p.set("lang", P.q.lang);
    const h = patch.hash !== undefined ? patch.hash : sameSubject ? P.hash : "";
    const qs = p.toString().replace(/%2F/g, "/").replace(/%2C/g, ","); return (P.pathMode ? "/" + at.join("/") : "") + (qs || !P.pathMode ? "?" + qs : "") + (h ? "#" + h : "");
  };
  P.navigate = (url, opt = {}) => { if (opt.scrollTop) P.forceTop = true; P.keepY = opt.fromSameSubject === false ? null : window.scrollY; history[opt.replace ? "replaceState" : "pushState"](null, "", url); P.render(); };
  P.setQ = (k, v) => { P.keepY = window.scrollY; const u = P.href({ set: { [k]: v } }); P.navigate(u, { replace: false }); };
  /* In-page links keep the scroll position when the subject stays the same */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='?'],a[href^='/ke']"); if (a && !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !a.target) { e.preventDefault(); const u = new URL(a.getAttribute("href"), location.href); const nv = u.searchParams.get("view") || "overview"; P.navigate(a.getAttribute("href"), { fromSameSubject: nv === P.view }); P.closeAll && P.closeAll(); return; }
    const t = e.target.closest("[data-href]"); if (t && !e.target.closest("a,button,input,select")) { const h = t.getAttribute("data-href"); const nv = new URL(h, location.href).searchParams.get("view") || "overview"; P.navigate(h, { fromSameSubject: nv === P.view }); }
  });
  document.addEventListener("change", (e) => { const s = e.target.closest("[data-q]"); if (s) P.setQ(s.dataset.q, s.value); });
  addEventListener("popstate", () => P.render());

  /* ---- helpers for views ---- */
  P.toast = (m) => { const t = document.getElementById("toast"); t.textContent = m; t.className = "show"; clearTimeout(P._tt); P._tt = setTimeout(() => (t.className = ""), 2200); };
  P.icons = { home: "M3 11l9-8 9 8M5 10v10h14V10", map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14", users: "M16 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7M21 20v-1a4 4 0 00-3-3.9M16 4.1a3.5 3.5 0 010 6.8", vote: "M9 11l3 3 8-8M5 21h14M5 21v-4h14v4", landmark: "M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M2 10l10-7 10 7", building: "M4 21V4h10v17M14 9h6v12M8 8h2M8 12h2M8 16h2", network: "M12 5a2 2 0 100-4 2 2 0 000 4M5 21a2 2 0 100-4 2 2 0 000 4M19 21a2 2 0 100-4 2 2 0 000 4M12 5v6M12 11l-7 6M12 11l7 6", gavel: "M14 4l6 6M9 9l6 6M4 20l7-7M12 2l8 8-3 3-8-8z", coins: "M12 6c4 0 7-1 7-2s-3-2-7-2-7 1-7 2 3 2 7 2zM5 4v6c0 1 3 2 7 2s7-1 7-2V4M5 10v6c0 1 3 2 7 2s7-1 7-2v-6", layers: "M12 2l10 6-10 6L2 8zM2 14l10 6 10-6", chart: "M4 20V4M4 20h16M8 16v-5M12 16V7M16 16v-3", compare: "M6 3v12M18 9v12M6 15a3 3 0 100 6 3 3 0 000-6M18 3a3 3 0 100 6", library: "M4 4v16M9 4v16M14 6l4 14", message: "M21 12a8 8 0 01-11.6 7.1L3 21l1.9-6.4A8 8 0 1121 12z", image: "M3 5h18v14H3zM8 11a2 2 0 100-4 2 2 0 000 4M21 16l-5-5-8 8", clock: "M12 21a9 9 0 100-18 9 9 0 000 18M12 7v5l3 2", search: "M11 18a7 7 0 100-14 7 7 0 000 14M21 21l-5-5", bell: "M6 16V11a6 6 0 1112 0v5l2 2H4zM10 21h4", pin: "M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12M12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5", settings: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4", chev: "M6 9l6 6 6-6", x: "M6 6l12 12M18 6L6 18", panel: "M3 4h18v16H3zM9 4v16", lock: "M6 11h12v10H6zM8 11V8a4 4 0 118 0v3", target: "M12 21a9 9 0 100-18 9 9 0 000 18M12 16a4 4 0 100-8 4 4 0 000 8M12 12h0", flag: "M5 21V4M5 4h12l-2 4 2 4H5", menu: "M4 6h16M4 12h16M4 18h16", heart: "M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z", play: "M7 4l13 8-13 8z", mic: "M12 3a3 3 0 013 3v6a3 3 0 01-6 0V6a3 3 0 013-3M5 11a7 7 0 0014 0M12 18v3", doc: "M6 3h9l4 4v14H6zM14 3v5h5", plus: "M12 5v14M5 12h14", check: "M5 12l5 5 9-10", help: "M12 21a9 9 0 100-18 9 9 0 000 18M9.5 9.5a2.5 2.5 0 114 2c-1 .7-1.5 1-1.5 2M12 17h0" };
  P.icon = (n, c) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${c ? ` class="${c}"` : ""}><path d="${P.icons[n] || ""}"/></svg>`;
  P.chip = (t, k) => `<span class="chip ${k || ""}">${esc(t)}</span>`;
  P.stat = (l, v, s) => `<div class="stat"><span class="eyebrow">${esc(l)}</span><b>${v}</b>${s ? `<small>${s}</small>` : ""}</div>`;
  P.panel = (title, body, o = {}) => { const id = o.id || D.slug(title); return `<section class="panel" id="${id}" data-section="${id}"${o.cls ? ` style="${o.cls}"` : ""}><div class="ph"><h2>${esc(title)}</h2>${o.sub ? `<span class="muted sm">${o.sub}</span>` : ""}<div class="tools">${o.tools || ""}</div></div>${body}</section>`; };
  P.head = (title, sub, tools) => `<div class="pagehead"><div><span class="eyebrow">${esc(P.pl.ok ? P.pl.level : "")}</span><h1>${esc(title)}</h1>${sub ? `<p>${sub}</p>` : ""}</div>${tools ? `<div class="tools">${tools}</div>` : ""}</div>`;
  P.table = (cols, rows, o = {}) => `<div class="tw"><table><thead><tr>${cols.map((c) => `<th class="${c.n ? "n" : ""}">${esc(c.h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr${r.href ? ` data-href="${r.href}"` : ""}${r.hl ? ' class="hl"' : ""}>${cols.map((c, i) => `<td class="${c.n ? "n" : ""}">${r.c[i]}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  P.seg = (key, opts, cur, label) => `<div class="seg" role="group" aria-label="${esc(label || key)}">${opts.map((o) => `<a href="${P.href({ set: { [key]: o[0] } })}" aria-current="${cur === o[0]}">${esc(o[1])}</a>`).join("")}</div>`;
  P.select = (key, opts, cur, label) => `<label class="f"><span class="sr">${esc(label)}</span><select data-q="${key}" aria-label="${esc(label)}">${opts.map((o) => `<option value="${esc(o[0])}"${o[0] === cur ? " selected" : ""}>${esc(o[1])}</option>`).join("")}</select></label>`;
  P.q1 = (k, d) => (P.q && P.q[k]) || d;
  P.placeHref = (at, extra) => P.href(Object.assign({ at, view: P.view }, extra || {}));
  P.after = (fn) => P.mounts.push(fn);
  P.drain = () => { let n = 0; while (P.mounts.length && n++ < 200) P.mounts.shift()(); };
  /** A region that streams in on its own, holding the size of what replaces it (Suspense equivalent). */
  P.lazy = (h, fn, delay) => { const id = "lz" + Math.random().toString(36).slice(2, 8); const g = P.gen; P.after(() => setTimeout(() => { if (g !== P.gen) return; const el = document.getElementById(id); if (!el) return; el.innerHTML = fn(); el.style.minHeight = ""; el.removeAttribute("aria-busy"); P.drain(); }, delay || 150 + Math.random() * 250)); return `<div id="${id}" aria-busy="true" aria-label="Loading" style="min-height:${h}px"><div class="sk" style="height:${h}px"></div></div>`; };
  P.skeleton = () => `<div class="sk" style="height:34px;width:min(320px,60%);margin-bottom:14px"></div><div class="grid g4" style="margin-bottom:14px">${"<div class='sk' style='height:86px'></div>".repeat(4)}</div><div class="split"><div class="sk" style="height:380px"></div><div class="sk" style="height:380px"></div></div>`;

  /* ---- render: paint first, fill in after; keep scroll within a subject ---- */
  P.render = () => {
    P.parse(); P.gen++; P.mounts.length = 0; const main = document.getElementById("main"); const same = P.lastView === P.view && P.lastErr === !!P.errors.length && !P.forceTop;
    P.shell.update();
    const fill = () => {
      const n = P.nav(P.view); let html;
      const why = P.pl.ok ? P.whyUnavailable(P.view, P.pl) : null;
      if (!P.pl.ok) html = `<div class="panel empty"><h2>Place not found</h2><p>${esc(P.pl.error)}</p><a class="btn pri" href="${P.href({ at: ["ke"] })}">Go to Kenya</a></div>`;
      else if (why) html = `<div class="panel empty"><h2>${esc(n.label)} is not available here</h2><p>${esc(why)}</p><a class="btn pri" href="${P.href({ at: P.at.slice(0, Math.max(n.max, 0) + 1) })}">Go up one level</a></div>`;
      else { try { html = P.views[P.view](); } catch (e) { console.error(e); html = `<div class="panel empty"><h2>This screen failed to render</h2><p class="mono">${esc(e.message)}</p></div>`; } }
      if (P.errors.length && P.pl.ok) html = `<div class="note warn" style="margin-bottom:12px">${P.errors.map(esc).join(" ")}</div>` + html;
      main.innerHTML = html; main.classList.remove("busy"); P.drain(); P.validateHash();
      document.title = `${n.label} · ${P.pl.ok ? P.pl.name : "Mzizi"} — Mzizi prototype`;
      if (same && P.keepY != null) window.scrollTo(0, P.keepY); else if (P.hash && document.getElementById(P.hash)) document.getElementById(P.hash).scrollIntoView(); else window.scrollTo(0, 0);
      P.keepY = null; P.forceTop = false; P.lastView = P.view; P.lastErr = !!P.errors.length;
      if (P.pl.ok) P.store.set(K.place, P.at.join("/"));
    };
    if (same) { main.classList.add("busy"); const y = window.scrollY; P.keepY = P.keepY == null ? y : P.keepY; setTimeout(fill, 90); } else { main.innerHTML = P.skeleton(); window.scrollTo(0, 0); setTimeout(fill, 140); }
  };
  P.validateHash = () => { if (P.hash && !document.getElementById(P.hash)) { history.replaceState(null, "", location.pathname + location.search); P.hash = ""; } };
  /* Hash follows the reader (replaceState, never a new history entry) */
  let st; addEventListener("scroll", () => { clearTimeout(st); st = setTimeout(() => { const s = [...document.querySelectorAll("[data-section]")]; let cur = ""; s.forEach((e) => { if (e.getBoundingClientRect().top <= 120) cur = e.id; }); if (window.scrollY < 60) cur = ""; if (cur !== P.hash) { P.hash = cur; history.replaceState(null, "", location.pathname + location.search + (cur ? "#" + cur : "")); } }, 120); }, { passive: true });
})();
