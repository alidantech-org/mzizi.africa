# Notes: IEBC resources (Kenya), pilot structure

Observed 2026-11-02 by one manual GET of https://www.iebc.or.ke/resources/?Party_list (and the home page): server-rendered HTML, no generator tag, navigation lists Gazette Notices, Electoral Acts, Publications / Reports, Party list, Forms, Court Rulings, Boundary Delimitation, By-elections, Tenders and others under `/resources/?<Category>` and `/electionlaws/`. Each document is a `div.row` with an `h4` title, an "Uploaded on: Sat 22nd Jul, 2017" text and an `a.r_download` link to `../uploads/resources/<random>.pdf`. The example file is a six-row excerpt of that page.

robots.txt: `https://www.iebc.or.ke/robots.txt` returned an HTML page, not a robots file, so there is no machine-readable crawl policy; the engine treats an unparseable robots response as no restrictions, which is a gap a human should judge. No terms of use or licence were found on the pages read; licence is `unknown`, so the content cannot be published until an assessment records one.

Gaps: other categories (Gazette Notices, Publications, Boundary Delimitation) use the same page template but were not read; only Party list is modelled. Pagination was not seen (the page lists everything). Download counters change on every visit and are ignored. The `Downloads` menu entry links to `#home`, not a page. Documents are PDFs; extracting their content is a separate Tier B task. Dates carry weekday and ordinal suffixes, handled by `clean_ordinal` and a date format.

Technically valid only: the collection gate refuses this recipe until the site has a current approved legal/source assessment and the Kenya jurisdiction dossier reaches pilot.
