---
{id: TSK-22F891CA0D38,name: "Model sites and domain patterns: expected hosts, verification and promotion to sources",type: task,status: planned,priority: medium,created_at: 2026-11-19T10:29:43.322Z,updated_at: 2026-11-19T10:29:43.322Z,order: 11264}
---

# Model sites and domain patterns: expected hosts, verification and promotion to sources

## Goal

Official bodies publish on predictable hosts: a county name under the government domain, a constituency fund under its own sub-domain, a ministry short name under the government domain. The system should generate these candidate hosts from patterns, check them, link verified ones to the right entity or institution, and offer them as sources for collection, without ever treating a guess as a source.

## Context

Existing contracts (`dryv/contracts/schemas/postgres/source.ts`): `Publishers` with `officialEntityId` (34-50), `Sources` (a real website or API with classification, credibility, `officialEntityId`, 52-71), `Domains` (host with start and end dates, 73-88), `Addresses` (page, listing, file or endpoint, 90-117), `Discoveries` (119-144), `Verifications` (311) and `Coverage` (407). `official.contacts` (`official.ts:118-139`) hold a sourced channel for exactly one entity or individual, kind from scheme `ofc.contact.kind`, with a visibility class. Every institution already has an entity (`governance.ts:28`). There is no state for a host that is only expected. Research acquisition rules in `AGENTS.md` apply: `robots.txt` is a recorded signal, challenge handling and scope ceilings are separate and configurable, nothing is assumed permitted because a URL is public. Full design: `.docs/design/data/POWER_MONEY_PATTERNS_AND_SITES.md` section 2.

## Proposed flow

1. Expect: a site-set pattern part (task 010) yields ranked candidate hosts per entity from its normalised name.
2. Record: add to `source.domains` a `statusId` (scheme `src.domain.status`: candidate, resolves, verified-official, redirects, dead, rejected), optional `patternPartId`, `entityId` (to `official.entities`), `lastCheckedAt` and optional `officialContactId`.
3. Probe: DNS, TLS and a polite home-page fetch compare the page title and text with the entity's recorded names; store a `source.verification` with method and confidence.
4. Promote: only a verified-official domain gets a `source.sources` row and an `official.contacts` website row, both citing the verification. Rejections are kept so guesses are not repeated.
5. Collect: collection may start only after the source assessment records robots signal, scope and request ceilings.

## Method options

A. Candidates in memory only (loses audit). B. Candidates as `domains` rows with status. Recommended. C. A separate `official.sites` table: rejected by the owner (19 Nov 2026); a website is an `official.contacts` row of kind website.

## Acceptance checklist

- [ ] Author the `source.domains` columns (status, entity, official contact, template, last checked), with no `official.sites` table (owner decision) and the `src.domain.status` scheme, with owner approval of values.
- [ ] Define the normalisers and templates as data in `seed/terms/` (name without kind word, short form, hyphenation, diacritics) and confirm no domain literal in code.
- [ ] Define how several candidate variants per entity are ranked, and how an irregular site found by a person is entered with a citation.
- [ ] Specify the probe's evidence (what is stored, confidence rules, what makes a rejection) and the review gate before promotion.
- [ ] Show how a site is found from an entity, an institution or a place, and how every promoted site appears as a possible source for the engine.
- [ ] Paper-test county, constituency-fund, ministry, parliament and court hosts for Kenya and one other country.
- [ ] Run `task validate`.
