---
{id: GOAL-GRP-EC5D0BCEE594,name: "Media, flags and reinforcement from Wikimedia goal",type: documentation,extra: {created_at: 2026-11-02T20:01:37.126Z,group: GRP-EC5D0BCEE594}}
---

# Media, flags and reinforcement from Wikimedia goal

## Goal

Record whether things have flags, logos or photographs (counties, constituencies, wards, countries, parties, people), fetch them from Wikimedia sources with their licences, and give the whole system a reinforcement loop: because almost every field is nullable and data is expected to be incomplete, the system must know what is missing, search for it, and refill it when a source is found.

## Why it matters

The registry already holds counties, wards, parties and people, but not their flags, emblems or photographs, and nothing says which of them are known to have one. Wikipedia, Wikidata and Wikimedia Commons hold flags, coats of arms, party logos and portraits with licence information. A reinforcement framework turns missing data into work items rather than silent gaps.

## Success criteria

- A nullable, three-valued marker (known to have, known not to have, unknown) for flag, emblem and logo on geography levels and units, parties and institutions.
- Wikidata identifiers on units, parties and people, and media files stored with licence, author, source URL and retrieval time.
- A gap queue that lists missing fields per entity and a refill job that searches for them.
