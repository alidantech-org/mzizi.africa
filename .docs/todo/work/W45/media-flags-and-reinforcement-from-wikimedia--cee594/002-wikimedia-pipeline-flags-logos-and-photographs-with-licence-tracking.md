---
{id: TSK-7EC27F97DC64,name: "Wikimedia pipeline: flags, logos and photographs with licence tracking",type: task,status: completed,priority: medium,created_at: 2026-11-02T20:02:42.528Z,updated_at: 2026-11-03T01:26:31.297Z,order: 2048,depends_on: [TSK-A6C9B9251A15],extra: {status_history: [{from: planned,to: completed,at: 2026-11-03T01:26:31.297Z}]}}
---

# Wikimedia pipeline: flags, logos and photographs with licence tracking

## Goal

Fetch flags, coats of arms, party logos and people's portraits for Kenyan counties, the country, parties and public figures from Wikipedia, Wikidata and Wikimedia Commons through their official APIs, storing each file only with its licence and source.

## Context

The product owner asked for county flags, country flags, party logos and people's photographs from Wikipedia and its sister projects. The safe route is the official APIs: Wikidata to find the item and its image properties (flag image, coat of arms image, logo image, image), Commons to read each file's licence, author and attribution text, and the Wikipedia REST API for summaries when needed; page scraping is not used. Requests are identified with the project user agent, rate limited and stop on any challenge. An item without a recorded free licence is not stored, and photographs of people are matched by the person's Wikidata item with an instance-of human, citizenship Kenya and position checks, never by name alone. Every file keeps its Commons page URL, author, licence name and URL, and the attribution required by the licence, and attribution is displayed with the media.

## Acceptance checklist

- [x] Register the Wikimedia hosts as a site, assess them, and probe through the gate.
- [x] Match counties, the country, parties and public figures to Wikidata items with context checks and a report of unmatched or ambiguous names.
- [x] Fetch flags, emblems, logos and portraits through Commons with licence, author and attribution text.
- [x] Store files as raw artifacts and link them to entities with the role and update the markers.
- [x] Skip and report any file without a recorded free licence.
- [x] Add tests with recorded API responses.
