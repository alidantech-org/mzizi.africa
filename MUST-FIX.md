You're right. The addresses, the hierarchy and the generation approach were agreed in the docs, and I built the shell and theme but never moved the pages onto them. I'll audit the web app against every document I wrote, then give you the violations. First I'm listing those documents.

Now I'm auditing the web code against these commitments with measurable checks.

# Why I failed, and what is still violated

You were right. I built the shell and the theme, which you complained about visibly. The structure the docs agreed, meaning addresses, hierarchy, composed reads and generated pages, I treated as later work. I then reported "about 20 pages remain" as a footnote instead of doing them. My earlier summaries understated this.

## The audit, against the docs I wrote

**1. Addresses and hierarchy (UI_INFORMATION_ARCHITECTURE §14 and §15): mostly not done.**
- **Missing addresses.** These return 404: `/finance`, `/politics/parties`, `/government/law`, `/procurement/tenders`, `/data/statistics`, `/elections/general/2027` and `/places`. The sidebar still links to the old flat paths (`/parties`, `/parliament`, `/institutions`, `/tenders`, `/civic`, `/statistics`, `/leaderboards`, `/compare`, `/source-browse`, `/browse`).
- **Ids in addresses.** Six routes still use opaque ids: `/browse/[id]`, `/civic/[id]`, `/statistics/[id]`, `/elections/[id]`, `/leaders/[id]` and `/elections/place/[id]`. The agreement was slugs only, never ids.
- **Place paths.** Place slugs do work (`/nairobi`, `/nairobi/westlands`), but `/nairobi/elections` and `/kisumu/finance` only redirect.
- **Missing sections.** No Finance section, no Politics group (coalitions, manifestos), no election kind pages, no `/events/{slug}`, no Infrastructure nearest, no `{place}/report`, no Data coverage or exports.
- **Leftovers.** The four scaffold pages, `/evidence-view` and `/source-browse` were meant to be removed or replaced.
- **Slug data and SEO.** The slug registry data exists: 2,099 places, 2,305 people, 1,571 projects and more. The web barely uses it, and there is no sitemap, canonical tag or hreflang.
- **Hand-written sidebar.** The sidebar is a hand-written list in `app-frame.tsx`, not authored in contracts.

**2. Contract-first and server rendering (DEC-CONTRACT-FIRST §1, §2, §4): partly violated.**
- **Client pages.** 69 files carry `"use client"`, including 24 page views: browse, civic, compare, content, elections/[id], institutions, law, leaderboards, leaders, motions, profile, saved, search, statistics, tenders and others.
- **Untyped contract sections.** 81 `dynamic()` fields remain in the API contract. About 1,000 lines of hand parsing (`governance/parse/documents.ts` and `insights.ts`) exist only because of them.
- **Reads from the browser.** There is no browser `fetch` in hand-written code. But the 24 client views still read through the generated server actions from the browser, not as one server read per screen.
- **No composed reads.** The "one authored read per screen" rule is not built.
- **No Dryv frontend capabilities.** The Dryv frontend work (component catalog, address grammar, navigation as data, page states, gallery) hasn't started. That is the root cause of the hand-written pages.

**3. No hard-coding (DEC-CONTRACT-FIRST §5): partly violated.**
- **Indicator codes:** `sta.population.total`, `sta.population.density` and `civ.projects.per-100k` are literals in home, statistics and leaderboards.
- **Country and currency:** "Kenya" in a few strings and comments, and a `KSh` example comment.
- **Colours:** hex colours in `place-map.tsx`.
- **Hand-written interface copy:** about 40 English strings in view files bypass the copy system. Parts of Explore are English literals inside `<T>`.

**4. Layout (§13): mostly done, one gap.** The sidebar and app bar layout is done, there is no footer, and the legal links are in the sidebar foot. The place switcher is missing from the shell, since I removed it per your last request.

**5. Context (CONTEXT_AND_LOCALISATION):** the API reads the Cloudflare header, but I haven't verified the trust rule (only from the edge, with a dev override). The same goes for cache-key variation by country and language.

**6. Interactions (USER_INTERACTIONS_AND_TRUST):** likes and views on the web are not built.

## What to do about it
I suggest this order, no more summaries until each is done:
1. Move all routes to the agreed addresses and slugs, with 301 redirects from the old ones, and remove the scaffold pages.
2. Type the 81 `dynamic()` sections, then delete the hand parsing.
3. Convert the 24 client views to server pages with client leaves only.
4. Remove the remaining literals and copy strings.
5. Add the Dryv navigation and address work, then the missing sections.

Decision for you: should I start step 1 now?