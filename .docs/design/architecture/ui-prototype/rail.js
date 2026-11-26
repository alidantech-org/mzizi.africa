/* On-this-page rail (wide screens) and reading progress. Sections carry stable ids, so this follows the hash rules:
   clicking a dot scrolls and records #section with replaceState, never a new history entry. */
(function () {
  const el = document.createElement("nav"); el.id = "rail"; el.setAttribute("aria-label", "On this page"); document.body.appendChild(el);
  const secs = () => [...document.querySelectorAll("#main [data-section]")];
  const spy = () => { let cur = ""; secs().forEach((x) => { if (x.getBoundingClientRect().top <= 140) cur = x.id; }); el.querySelectorAll("a").forEach((a) => a.setAttribute("aria-current", a.dataset.sec === cur)); const p = document.documentElement.scrollHeight - innerHeight; document.getElementById("bar").style.setProperty("--prog", (p > 0 ? Math.min(100, (scrollY / p) * 100) : 0) + "%"); };
  const build = () => { const s = secs(); if (s.length < 3) { el.classList.remove("on"); el.innerHTML = ""; return; } el.innerHTML = s.map((x) => `<a href="#${x.id}" data-sec="${x.id}"><span>${P.esc((x.querySelector("h2") || {}).textContent || x.id)}</span><i></i></a>`).join(""); el.classList.add("on"); spy(); };
  addEventListener("scroll", spy, { passive: true });
  el.addEventListener("click", (e) => { const a = e.target.closest("a"); if (!a) return; e.preventDefault(); const t = document.getElementById(a.dataset.sec); if (!t) return; t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth" }); history.replaceState(null, "", location.pathname + location.search + "#" + a.dataset.sec); P.hash = a.dataset.sec; });
  const r = P.render; P.render = function () { r.apply(this, arguments); setTimeout(build, 320); setTimeout(build, 900); };
})();
