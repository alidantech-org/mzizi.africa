---
id: DOC-USER-INTERACTIONS-AND-TRUST-20261118
name: USER_INTERACTIONS_AND_TRUST
type: documentation
tags: [interactions, comments, evidence, fingerprint, gps, moderation, privacy, mobile, proposal]
extra: {status: proposal_for_owner_agreement_and_legal_review, date: 2026-11-18, code_changes: none}
---

# User interactions, device identity and trust

**Status: proposal. Owner direction recorded on 2026-11-18, not yet reviewed against law or built.** The owner's direction is that the server holds user interactions even without accounts; the web app only allows likes and views; the mobile app (the Flutter `source/apps/app`) alone allows comments, evidence, opinions and images; posting requires GPS and a device fingerprint; GPS proves the poster is in the region they speak about; the fingerprint deduplicates; content is filtered. More interaction features are coming, so the model must be generic.

This document records the model, evaluates it and lists what must be settled before any build. It does not decide privacy-law questions: **the policy baseline says jurisdictional legal review is required** ([LEGALITY_SAFETY_AND_COMPLIANCE](../policy/LEGALITY_SAFETY_AND_COMPLIANCE.md)).

## 1. Interaction matrix

| Interaction | Web | Mobile app | Needs location | Needs device identity | Stored as |
| --- | --- | --- | --- | --- | --- |
| View an entity page | yes (counted once per device and entity per window) | yes (same rule) | no | yes (pseudonymous) | view event, deduplicated |
| Like an entity | yes | yes | no | yes | like, one per device and entity, reversible |
| Comment on an entity | no | yes | yes | yes | contribution, moderated |
| Opinion or "view" on an entity | no | yes | yes | yes | contribution, moderated |
| Evidence (text, link, document) | no | yes | yes | yes | contribution with attachments, moderated, never canonical until reviewed |
| Image or media | no | yes | yes | yes | contribution with file, scanned and stripped |
| Report a contribution | no | yes | no | yes | report, feeds moderation |

"View" in the owner's sentence is read here as two things: the passive page view counter (all clients) and an authored opinion (mobile only). The owner should confirm.

The web being read-only for content must be **enforced by the API**: web-facing operations are authored without write operations and write operations require the mobile client attestation described below. Hiding buttons is not enough.

## 2. Anonymous actor and device identity

- Every interaction belongs to an **actor** row. With no account, the actor is a **device actor**: a server-issued random identifier stored on the device, plus a **device fingerprint hash** (salted, one-way) used to deduplicate and rate-limit.
- The raw fingerprint inputs are not stored. The salt is a server secret, rotated by policy.
- An optional account can later be linked to a device actor without losing history; whether accounts ever exist is an open question.
- Likes and views deduplicate on (actor or fingerprint hash, entity, kind, window). Posting is rate-limited per actor, per fingerprint, per region and per entity.

**What fingerprinting can and cannot guarantee.** A fingerprint is approximate: two devices can collide, one device can change (reinstall, update, privacy mode), and a determined user can reset or spoof it. Treat dedupe as "approximately one per device", record the collision and confidence, never present like or view counts as exact, and never use a fingerprint to identify a person.

## 3. Location proof for posting

- The mobile app sends the device position and its accuracy and a mock-location flag with each post. The server checks it against the geographic features Mzizi already holds: the position must fall inside, or within an agreed tolerance of, the place the post is about.
- The server stores a **location proof** record: the matched place, the check result, the accuracy band and a trust score, and by default only a coarse position (the place unit or a rounded cell), not the raw coordinates. Raw coordinates are kept only where evidence requires it and for a defined time.
- GPS can be spoofed. The proof is a signal with a confidence, combined with mock-location detection, accuracy limits, impossible-travel checks, the Cloudflare country header and device attestation (Play Integrity or App Attest). A failed or low-confidence proof routes the post to stricter moderation or rejects it; it does not claim truth.
- A poster outside the region may still be allowed to like but not to post about it. Whether non-local posts are allowed with a label is an open question.

## 4. Moderation and content filtering

- States: `received`, `filtered`, `pending_review`, `published`, `held`, `rejected`, `removed`, `appealed`.
- Automated filters run on receipt: abuse and hate language, personal data (phone numbers, identity numbers, addresses of private individuals), spam and duplicates, links, and images (illegal content, nudity, violence). A model-assisted filter produces a proposal, not a decision: low-risk content may publish, risky content waits for human review (consistent with "model-assisted output is a reviewable proposal").
- Evidence versus opinion: evidence contributions carry the evidence type and are shown separately; neither is shown as Mzizi's data. Contributions link to the entity but never modify canonical rows; promotion to data goes through the existing review path (raw artifact, extraction, candidate, review).
- Reporting, takedown on legal request, appeal and a public moderation policy are required before launch. A named owner for takedown requests is needed.
- Public-interest speech about office holders in their office is treated differently from content about private individuals; the filters and reviewers need that distinction.

## 5. Images and files

- Raw bytes are preserved in the filesystem package; display derivatives are separate. EXIF and other metadata are stripped from derivatives and the location in EXIF is never published.
- Limits on type, size and count; scanning for illegal content before publication; hashes for duplicate and known-bad detection.
- Retention and deletion follow section 7.

## 6. Data model sketch (generic, authored in Dryv)

Not final; to be authored as schemas, not hand SQL.

- `actors` (device actor or account), `devices` (fingerprint hash, platform, attestation result, first and last seen), `consents` (purpose, country, text version, given at, withdrawn at).
- `interactions` (actor, target subject reference, kind code, payload, evidence attachments, location proof, device, moderation state, created at) with kinds defined as reference values so new features add kinds, not tables. `reactions` (likes) and `view_events` are lightweight specialisations or kinds with deduplication keys.
- `location_proofs` (interaction, matched place, check result, accuracy band, trust score, signals).
- `moderation_cases` (interaction, filter results, reviewer, decision, reason, appeal).
- Targets use the existing subject-reference mechanism ([SUBJECT_REFERENCES](../data/SUBJECT_REFERENCES.md)) so any entity can be commented on without schema changes.
- Counters (likes, views) are derived and cached, not edited by hand.

## 7. Privacy, law and retention (must be settled before build)

- Device fingerprints and precise location are personal data in Kenya (Data Protection Act, 2019) and in most countries Mzizi will serve, and under the GDPR for EU visitors. Anonymous does not mean exempt: a stable device hash is a persistent identifier.
- Requirements to document and decide: lawful basis (consent for posting, legitimate interest for aggregate view counts, to be checked per country), a plain-language consent screen before the first post and before any location use, purpose limitation, minimisation (hash and coarse region by default), retention periods per data kind, access, correction and deletion on request (which needs a way to link a request to a device actor), cross-border transfer rules, registration duties with national regulators where required.
- Cloudflare country detection for the web is separate and needs no consent beyond the privacy notice, but the derived country must be logged only as a code.
- The policy documents under `design/policy` and `rules/security.md` must be updated with these rules before implementation.

## 8. Abuse cases to design against

Fake local presence by spoofed GPS; brigading with many fingerprints; ballot-stuffing likes and views; defamation of private individuals; doxxing in comments or images; coordinated disinformation in election periods; evidence forgery; child safety content; scraping of contributions; harassment of other contributors; a poster reidentified from a rare device hash plus a small place; legal demands for poster identity (the system should hold little to give).

## 9. What this means for architecture

- Interaction operations are authored in the API contract with a `clientKind` requirement (mobile only for writes) and an attestation check generated into middleware.
- The web app uses only `Like`, `Unlike` and `RecordView` operations, anonymous with a device actor created on first visit (cookie plus server record) under the privacy notice.
- Feed, moderation and counters are composed reads; moderation tooling lives in the `dev` portal until an admin app is funded.
- All of it uses the same context object (country, language, place) as every other read.

## 10. Open questions for the owner

1. Confirm "view" means both the passive counter and a mobile-only opinion.
2. Posting tolerance: must the poster be inside the place, or within a distance? Are non-local posts allowed with a label?
3. Which entities can be commented on first (places, people, projects, institutions)? Comment threads or single comments?
4. Do comments appear before moderation, after automated filtering only, or only after review?
5. Does a poster have any display name, a generated pseudonym, or nothing?
6. Retention periods and the deletion route for a device actor with no account.
7. Are like and view counts shown publicly, and are they shown exactly or as rounded ranges?
8. Consent wording per country and who approves it; who reviews law per country.
9. Is device attestation (Play Integrity, App Attest) acceptable as the proof the client is the real app?
10. Is any optional account planned, and what would it unlock?
11. Who owns moderation and legal takedown, and what is the response time target?
12. Which image classes are allowed (evidence photos of projects, damaged roads) and which are not?
13. Is the mobile app distributed outside app stores (so attestation may not be available)?
