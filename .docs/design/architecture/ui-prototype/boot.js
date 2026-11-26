/* Boot: apply preferences, paint the frame, render the page, open location setup on a first visit. */
(function () {
  P.applyTheme(); P.applySide(); P.applyA11y();
  matchMedia("(prefers-color-scheme:dark)").addEventListener("change", () => P.pref.theme().mode === "system" && P.applyTheme());
  const first = !P.store.get(P.K.place);
  const hasQuery = P.pathMode ? location.pathname.split("/").filter(Boolean).length > 0 : new URLSearchParams(location.search).has("at");
  if (!hasQuery) { const last = P.store.get(P.K.place); if (last) history.replaceState(null, "", P.pathMode ? "/" + last : "?at=" + last); }
  P.render();
  if (first && !hasQuery) setTimeout(() => P.shell.capture(), 500);
})();
