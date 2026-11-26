/* Touch behaviour: edge swipe opens the menu, swipe back closes it, a scroll-to-top button on long pages, an offline notice, and
   the legal contents tree starts collapsed on small screens. Nothing here is needed on desktop. */
(function () {
  const small = () => innerWidth <= 900; const reduced = () => document.documentElement.dataset.motion === "off" || matchMedia("(prefers-reduced-motion:reduce)").matches;
  const root = document.documentElement; const scrim = document.getElementById("scrim");
  const openDrawer = () => { root.classList.add("drawer"); scrim.hidden = false; }; const closeDrawer = () => { P.closeAll(); };
  /* edge swipe */
  let sx = 0, sy = 0, tracking = null;
  addEventListener("touchstart", (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; tracking = small() ? (root.classList.contains("drawer") ? "close" : sx < 22 ? "open" : null) : null; }, { passive: true });
  addEventListener("touchend", (e) => { if (!tracking) return; const t = e.changedTouches[0]; const dx = t.clientX - sx, dy = Math.abs(t.clientY - sy); if (dy < 60) { if (tracking === "open" && dx > 70) openDrawer(); else if (tracking === "close" && dx < -70) closeDrawer(); } tracking = null; }, { passive: true });
  /* scroll to top */
  const top = document.createElement("button"); top.id = "totop"; top.setAttribute("aria-label", "Back to top"); top.innerHTML = P.icon("chev"); document.body.appendChild(top);
  top.onclick = () => window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" });
  addEventListener("scroll", () => top.classList.toggle("on", small() && scrollY > 700), { passive: true });
  /* offline notice */
  const net = document.createElement("div"); net.id = "netbar"; net.setAttribute("role", "status"); net.textContent = "You are offline. You can keep reading what has already loaded."; document.body.appendChild(net);
  const sync = () => net.classList.toggle("on", !navigator.onLine); addEventListener("online", sync); addEventListener("offline", sync); sync();
  /* after each render: collapse the legal contents tree on small screens */
  const r = P.render; P.render = function () { r.apply(this, arguments); setTimeout(() => { if (innerWidth <= 1100) document.querySelectorAll("details.toc").forEach((d) => { if (!d.dataset.touched) d.open = false; }); }, 360); };
  document.addEventListener("toggle", (e) => { if (e.target.matches && e.target.matches("details.toc")) e.target.dataset.touched = "1"; }, true);
})();
