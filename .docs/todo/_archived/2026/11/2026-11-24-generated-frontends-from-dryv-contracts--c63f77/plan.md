---
{id: GRP-6AE884C63F77,name: Generated frontends from Dryv contracts,type: documentation,extra: {created_at: 2026-11-17T07:26:01.203Z}}
---

# Plan

Start small and look at what is generated before widening scope. The first milestone is the shared theme contract, authored from the palette already used by the landing page (oat, cream, sand, ink, clay, calabash, raffia, indigo, radii, fonts and shadows) with a dark mode. The second is one application contract per frontend, each selecting that theme. The third is activating the official `flutter-app` and `nextjs-app` packs against their destinations and inspecting the output. The fourth is renaming the current web app to `admin` and creating the public website and developer portal.

Approach: use the Theme and Application features already implemented in Dryv (decision 0017 and 0018), run the real pack tests before trusting them, and record any gap, such as missing Tailwind or CSS token output, as a Dryv change rather than a Mzizi workaround. The developer portal talks to the engine through a server-side layer so the service key never reaches a browser.

Risks: the packs are version 0.1.0 and list limits (nested schemas, features required for views); the pinned local packs checkout may lack the frontend packs; renaming the web app touches root scripts and docs. Each is handled in its own task and reported truthfully.
