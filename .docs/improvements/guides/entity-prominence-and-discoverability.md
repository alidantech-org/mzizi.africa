---
id: DOC-9A8E56DB1C16
name: Cross-domain entity prominence, ambiguity and research discoverability
type: documentation
tags: [improvements, prominence, reference, patterns, person, geography, governance, intelligence, ranking]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only, score_range: "0-1"}
---

# Cross-domain entity prominence, ambiguity and research discoverability

**Status: planning only.** This document records the 2026-11-07 proposal for a reusable, explainable 0–1 prominence system. It does not approve a new schema, fixed weights, a ranking policy, an AI model or automatic trust in Wikipedia/search results.

## 1. Purpose

Mzizi needs to estimate how publicly prominent or discoverable an entity is likely to be so it can allocate research effort intelligently.

The capability should work across at least:

- **People:** presidents, cabinet secretaries, governors, MPs, MCAs, judges, historical figures, activists, scholars and other public figures.
- **Geographic units and places:** countries, capital cities, counties, county capitals, constituencies, wards, towns, settlements, historic places and landmarks.
- **Institutions and organizations:** national institutions, county governments, legislatures, commissions, universities, cultural institutions and local bodies.
- **Historical entities or events:** where the platform later finds the same discovery-prioritization need.

The user's key observation is that the seat a person holds matters. A national office generally attracts wider coverage than a local office; a governor of Nairobi may attract more national attention than a governor of a smaller county; an MP may be more widely known nationally than an MCA; and a capital city may be prominent beyond its local area.

The system should encode these differences through reusable reference definitions and verified geographic context rather than manually assigning a popularity number to every person.

## 2. Keep four concepts separate

All scores are proposed to use a normalized range from **0.0 to 1.0**, with the meaning and model version shown.

| Measure | Meaning | What a high score means | What it must not mean |
|---|---|---|---|
| **Prominence** | Structural/public significance and likely visibility of an entity in a defined context and period | Wider public recognition or institutional/geographic significance is expected | Trustworthiness, competence, merit, legitimacy or factual correctness |
| **Identity ambiguity** | Difficulty distinguishing an entity from other plausible entities | More possible matches, name collisions or missing discriminators | Low prominence or low quality |
| **Evidence confidence** | Strength of evidence for one specific claim, relationship or identity match | The cited evidence strongly supports that particular assertion | General fame or popularity |
| **Source credibility / claim reliability** | Suitability and authority of a source for a particular claim and scope | This source is appropriate evidence for the claim | Entity prominence or page-view count |

Do not collapse these into a universal “confidence” field. A famous person may have ambiguous identity; a little-known ward representative may have a uniquely verified identity; a highly prominent person may still have a disputed biography. A source's authority must be evaluated for the claim it supports.

A related but separate output may be **expected external coverage/discoverability**: how likely it is that useful material exists in search engines, Wikipedia/Wikidata, official websites, archives or independent media. Prominence can inform that expectation, but actual coverage should be measured and the absence of a Wikipedia page must not count as a defect.

## 3. Score must be contextual and time-aware

A single global number is not enough. The conceptual function is:

```
prominence(entity, geographic_context, valid_time, model_version) -> 0.0..1.0
```

Useful contexts include global, African/continental, national, county, local/ward and subject-specific research. A person may have moderate global visibility but very high local prominence. A place may be nationally important as a capital and locally important for different reasons.

The result should identify the comparison scope and valid/evaluation time. A national prominence ranking must not silently be reused as a ward-level relevance ranking. Historical prominence must be time-aware: a former president, independence leader or historically important city does not become insignificant just because recent page views decline.

## 4. Structural prominence from reference data and generated offices

This is the preferred starting point because it is explainable and already aligns with the user's preference for reference-managed definitions and engine-executed patterns.

### 4.1 Reference-owned classifications

Evaluate reusable reference classifications for office and geographic categories. Illustrative office categories could include:

- national executive leadership;
- cabinet/ministerial leadership;
- national legislature;
- county executive leadership;
- county legislature;
- judiciary;
- independent constitutional commissions;
- local administrative or community leadership.

Illustrative geographic attributes/categories could include:

- country, county, constituency, ward, city/town or settlement;
- national capital, county capital or other legally designated seat;
- administrative level and parent jurisdiction;
- population band for a specified census/reference year;
- national/international transport, economic, cultural, academic or historical role;
- verified institutional concentration and regional relationships.

These are vocabulary examples, not approved codes, field names or scores. Their legal basis, effective dates and source evidence must be explicit where relevant.

### 4.2 Generated offices are normal domain records

A reference-managed pattern may generate expected office/seat records from legal and geographic rules. The pattern definition and version belong to the existing pattern-management review; the engine executes it; the resulting office or seat belongs to its proper domain (for example, governance or electoral).

The prominence calculation can use:

1. the verified office category and its reference-defined base importance;
2. the office's institutional and jurisdictional scope;
3. the prominence of the relevant geographic unit;
4. the role's legal/constitutional position and public function;
5. the time period and whether the person actually held the office.

**An expected/generated office is not proof that the office currently exists in practice, and it is not proof that a particular person holds it.** The person score must use a verified, time-bounded office-holding relationship, not merely a generated seat expectation.

### 4.3 Person structural score

A person's structural prominence may be derived from verified current and former positions, the importance of each office category, the prominence of the relevant jurisdiction/institution and the period of service.

Do not simply add every office a person has held: that would reward duplicate roles and inflate scores. Evaluate a bounded aggregation such as a maximum plus diminishing contributions from other independently verified roles, with historical significance and recency treated explicitly. The exact aggregation remains open.

Illustrative comparisons only:

| Person's role | Possible structural interpretation |
|---|---|
| President of Kenya | Very high national/international structural prominence |
| Governor of Nairobi | High national visibility and very high local relevance |
| Cabinet Secretary | High national executive prominence |
| Member of Parliament | National legislative visibility, with constituency context |
| Governor of a smaller county | High county-level relevance; national visibility may differ |
| MCA in Nairobi | High ward/county relevance, generally lower national structural prominence |
| MCA in a smaller county | High local relevance even if national prominence is lower |

These examples are not an official ranking of constitutional importance or human worth. A Governor's legal authority, an MP's representative mandate and an MCA's local role are different; prominence is a discoverability measure, not a judgment of the value of their work.

## 5. Geographic and place prominence

Place prominence should combine multiple sourced dimensions rather than rely on population or page views alone:

- administrative level and jurisdictional role;
- capital or designated-seat status, with valid dates;
- population and demographic evidence for a named reference period;
- economic, transport, education, cultural and institutional functions;
- historical significance and documented events;
- relationships to nationally or internationally significant networks;
- independently observed public recognition and external coverage.

A capital city such as Nairobi can have high national and international prominence. A smaller county capital can still have very high prominence within its county. A ward or local settlement may be highly relevant to a local query even when its global score is low.

Keep **global/national prominence** separate from **prominence within the relevant geographic context**. Search relevance should combine contextual prominence with the user's query and requested geography, rather than always sorting by the global score.

## 6. Proposed numerical model (illustrative, not approved)

An initial explainable experiment could be:

```
P = 0.70 * S + 0.20 * R + 0.10 * A

S = structural prominence
R = independent public recognition
A = normalized audience attention
P = prominence in a defined context and period
```

- **S — Structural prominence:** reference-defined office/institution/geographic importance and verified relationships.
- **R — Independent recognition:** evidence of recognition across distinct, reputable and relevant publications, knowledge bases, institutional histories or archives. Count independent coverage, not copied syndication as many sources.
- **A — Audience attention:** privacy-preserving, bot-filtered, normalized aggregate interest such as profile views over a time window. This should be a small, capped signal.

The 70/20/10 weights are a discussion starting point only. Calibrate them on reviewed examples, different countries, urban/rural settings, office types and historical cohorts. Test whether the structural component is sufficiently dominant for a governance/history platform. Do not let page views turn a public knowledge platform into a popularity contest.

A simple illustrative range could label 0.80–1.00 as very high, 0.55–0.79 as high, 0.25–0.54 as moderate and 0.00–0.24 as lower expected prominence. These bands are not approved thresholds and should be validated per model and context.

## 7. Audience attention: useful but bounded

The user's idea of considering how often people view a person's information can help estimate observed public interest. Treat it as an attention signal, not a vote about the person's worth or truthfulness.

If used, it should be:

- aggregated rather than exposing individual browsing histories;
- privacy-preserving and consistent with the platform's notice and retention policy;
- normalized by exposure/impressions and a defined time window;
- filtered for bots, crawlers, repeated refreshes, staff/admin previews and manipulation;
- capped so viral attention cannot overwhelm structural significance;
- optionally separated by broad query context without inferring sensitive traits or treating IP geolocation as verified residence.

Citizen corrections, swipe votes and report counts must not directly increase prominence. Feedback volume indicates review activity, not public importance.

## 8. AI agents: batch ranking and ambiguity assessment

An intelligence agent may receive a bounded list of candidate people, places or institutions and return:

- a proposed prominence rank and component-level rationale;
- identity ambiguity rank and the specific ambiguity drivers;
- likely external coverage/discoverability;
- likely source types to search next;
- possible external profile/knowledge-base matches, each with evidence;
- conflicts, missing discriminators and an explicit abstention when evidence is insufficient.

Potential ambiguity drivers include common names, spelling variants, multiple people with the same office, missing stable identifiers, conflicting dates, duplicate profile URLs and contradictory geographic/office associations.

The agent must not invent a biography, treat image similarity as identity proof, or silently overwrite the deterministic score. Its output must retain model/version, prompt/procedure version, input snapshot, evidence links, score explanation, uncertainty and review status. A deterministic, versioned engine calculation should combine approved reference rules and evaluated features; an AI proposal can contribute only under an explicit policy.

## 9. Using prominence to guide internet search and Wikipedia research

Prominence can help estimate how broad a research search should be:

| Expected prominence | Research strategy |
|---|---|
| Very high | Search official records, institutional biographies, gazettes, reputable independent media, archives and relevant knowledge bases |
| High | Search official institutional sources, election/appointment material, independent media and knowledge bases |
| Moderate | Prioritize the relevant county/local institution, assembly records, local publications, election documents and official profiles |
| Lower / little external footprint | Use tightly scoped official records, local archives, primary documents and known institutional relationships; avoid broad name-only matching |

These are search-budget heuristics, not source-trust rules.

**Wikipedia and general web search are discovery aids, not automatic authorities.** A high-prominence person may have a Wikipedia biography, but individual claims still need their cited underlying sources and Mzizi's own evidence evaluation. A low-prominence person may have no Wikipedia entry and still require a complete, accurate Mzizi record. A search result's rank, snippet, knowledge panel or number of mentions does not prove a claim.

Source credibility remains claim-specific: an official gazette may be authoritative for a legal appointment, an assembly page for its own membership list, and a statistical agency for a census value. No entity prominence score can replace that evaluation.

## 10. Output and lineage requirements

A future derived prominence result should be explainable and reproducible. Conceptual output information includes:

- entity identity and entity kind;
- prominence score (0.0–1.0);
- geographic comparison context;
- valid/evaluation period;
- structural, recognition and attention components;
- separate ambiguity and evidence-confidence values where relevant;
- expected external coverage/discoverability;
- contributing office, institution and geographic relationships;
- source/evidence references for input facts;
- reference/pattern/rule version;
- model/formula/configuration version;
- generated time, reviewer/approval state and prior score version.

These are logical output requirements, not approved SQL columns. Store or cache a derived result only after examining existing engine, reference, source, audit and analytical capabilities. The reference definitions should be the source of scoring rules; engine runs should be reproducible; evidence stays in source; canonical office/person/geography facts remain in their domain owners.

## 11. Evaluation and misuse prevention

Evaluate:

- whether independent reviewers agree with the prominence ordering within a declared context;
- whether Nairobi/national and smaller-county/local comparisons behave as intended;
- whether local officials remain discoverable in local queries;
- whether office categories produce sensible and legally explainable results;
- whether historical prominence is preserved without making current relevance misleading;
- whether scores are stable under duplicated media coverage, bot traffic or coordinated views;
- whether low-prominence people are still researched adequately;
- whether AI ambiguity ranking identifies true duplicate cases without excessive false matches;
- whether score changes can be traced to changed evidence, reference rules or model versions.

Never use prominence to infer competence, honesty, corruption, legitimacy, electoral support, wealth, danger or personal worth. Never reduce evidence standards for prominent people or deny research to less prominent people.

## 12. Open decisions — no implementation approved

1. Which entity kinds receive prominence first: people and geography, then institutions and historical entities?
2. What reference classifications and office categories should drive structural prominence?
3. How should geographic significance be measured without privileging population alone?
4. Should the 70/20/10 experiment be replaced with a calibrated learned ranking model after labelled examples exist?
5. What local/national/global contexts and historical time windows are required?
6. Which attention metrics can be collected lawfully and with adequate privacy?
7. What evidence qualifies as independent recognition, and how are copied articles/syndication deduplicated?
8. How should expected external coverage influence research budgets without creating a source-trust shortcut?
9. Which existing storage/engine contracts can retain score history without adding unnecessary tables?

**No prominence schema, new reference schema, score column, fixed weights or automated ranking policy is approved by this document.** The first step is to review current reference classifications, generated office patterns, governance office-holding records, geography attributes, source evidence and engine-derived outputs together.
