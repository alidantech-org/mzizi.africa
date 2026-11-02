---
{id: GRP-F0021DC8E03B,name: "Site content sections, crawling and document semantics",type: documentation,extra: {created_at: 2026-11-02T20:24:17.720Z}}
---

# Plan

Approach: extend the existing website structure bundles (manifest, modules, mappings, tags) with a content section module. A section has a semantic label (publications, downloads, media, tenders, notices, legislation, reports, press, jobs), a list of path rules (exact path or regex with named slots such as year, county or document number) and an expectation of file types. The crawler, running through the existing gate at 0.2 requests per second with robots.txt respected, depth two, only for trusted .go.ke hosts and named exact hosts, visits a section index, follows pagination, and records each file as a document with its URL, hash, size and headers. Size caps apply per file.

Classification uses layered tools: filename and URL regexes first, then text extraction (pdfplumber, PyMuPDF, openpyxl, python-docx), language and layout cues, table detection, and fuzzy matching (rapidfuzz) of titles against a catalogue of known document kinds such as gazette notices, Acts, Hansard, budgets, audit reports, census tables and tender notices. Uncertain results stay unclassified and enter the gap queue.

Milestones: structure schema for sections and path rules; crawler and document registry; classifier and parser routing; first publishers (ORPP, NG-CDF, Kenya Gazette, Parliament, National Land Commission, Controller of Budget, Auditor-General, KNBS, IEBC). Risks: sites behind bot challenges (Kenya Law) are never bypassed; sites with irregular paths need hand-written seed rules; large files need caps. Mitigation: start with seed rules prepared from manual research and let discovery add candidates for review.
