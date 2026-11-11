# Notes: example treasury publications (sample, fictional host)

Observed (sample only, nothing here was fetched from a real site): publications are listed as `article.pub` blocks with a link and a date; a second layout `li.publication` is listed as a lower-confidence fallback. Pagination is assumed to use a `page` query parameter and to end with an empty page.

Gaps: the date format is assumed to be `%d %B %Y`; the real site may use another. Fiscal year is parsed from the title and fails for titles without one, which the dry run reports as a field error rather than guessing. No licence is known (`licence.ref: unknown`), so publication of the content is blocked until an assessment records one.

This bundle is a technical recipe only. It validates, but the collection gate refuses it until the site has a current approved legal/source assessment.
