# Notes: Parliament of Kenya budget documents, pilot structure

Observed 2026-11-02 by one manual GET of https://www.parliament.go.ke/2025-2026-budget-documents and the home page: a Drupal site (views markup such as `views-field-field-pdf`), PDFs published under `/sites/default/files/<year-month>/`. The budget documents page lists links such as "Budget Statement for FY 2026/2027" inside `div.field--name-body`; the page also contains a sidebar table of order papers and Hansards (`td.views-field-field-pdf`) that is deliberately not selected. The example file is an excerpt of the body block.

robots.txt exists (Drupal default) and is respected by the engine. No licence or terms of use were read; licence is `unknown`. Titles carry the fiscal year in several spellings (`FY 2026/2027`, `2025 - 2026`); the `fiscal_year` transform accepts consecutive-year pairs only and reports anything else as a field error rather than guessing.

Gaps: the page for 2026-2027 (`/2026-2027-budget-documents`) has the same template but is not modelled as its own module; document dates are not on the listing, so `publishedOn` is not mapped; the sitemap and committee pages (reports, bills) are not covered; hosts `parliament.go.ke` and `www.parliament.go.ke` both appear in links and both are in scope (a possible alias relation to record in the site registry).

Technically valid only: collection stays blocked until an approved assessment exists.
