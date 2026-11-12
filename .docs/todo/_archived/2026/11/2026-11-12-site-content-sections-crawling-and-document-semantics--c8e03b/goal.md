---
{id: GOAL-GRP-F0021DC8E03B,name: "Site content sections, crawling and document semantics goal",type: documentation,extra: {created_at: 2026-11-02T20:24:17.720Z,group: GRP-F0021DC8E03B}}
---

# Goal

Make every Kenyan public site a modelled, crawlable source. A site structure declares the content sections a site is expected to have (publications, downloads, media, notices, tenders, legislation, reports), the path patterns that lead to each section (static paths or regular expressions with named slots), and what kind of material each section holds. A bounded crawler expands those sections, downloads the documents it finds, and a semantic classifier built on Python libraries decides what each document is and which parser handles it.

Success is measured by: every one of the 481 registered sites having a structure with at least the sections its family implies; each section recording the last crawl, the documents found, and their classified kind; every downloaded document carrying provenance, a content hash and a classification with a confidence; and the same fact found in several documents being stored as separate claims that reinforce or dispute each other rather than overwriting each other.
