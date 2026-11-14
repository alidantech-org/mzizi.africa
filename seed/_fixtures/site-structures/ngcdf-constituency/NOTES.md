# ngcdf-constituency (family fixture)

Observed 2026-11-14 on kasarani.ngcdf.go.ke (WordPress 6.4). Westlands, Langata, Makadara and Starehe share the same sections and layouts (family score 0.93-1.0).

- /allocations/: table, columns Amount (KSH) and Financial Year.
- /proposals/: table, columns Number, Filename (text carries the financial year), Status, Action (PDF link).
- /downloads/: PDF links with "Financial Year" link text.

Gaps: no `projects` table in the approved contracts; project rows are only listed in the draft module. The allocation mapping needs `fromUnitId` and `toUnitId` lookups; their kinds are assumptions for review. Selectors come from a draft crawl and are unverified against other constituencies.
