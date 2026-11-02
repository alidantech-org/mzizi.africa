---
{id: GRP-EC5D0BCEE594,name: "Media, flags and reinforcement from Wikimedia",type: documentation,extra: {created_at: 2026-11-02T20:01:37.126Z}}
---

# Media, flags and reinforcement from Wikimedia plan

## Approach

Use the official Wikipedia, Wikidata and Commons APIs, never page scraping, with identified requests and the same politeness limits. Media is stored in the file service as raw artifacts with a record of licence, author and source; an item without a recorded licence is not stored. Wikidata identifiers are the join key to units, parties and people, matched by name within context and confirmed by instance-of and country checks. The reinforcement loop is general: a coverage report finds nullable fields that are empty, queues search tasks per entity, and records what each attempt found.

## Milestones

1. Schema for flag and media existence and Wikidata identifiers (task 001).
2. Wikimedia pipeline with licence tracking (task 002).
3. Reinforcement framework: coverage, gap queue and refill jobs (task 003).
