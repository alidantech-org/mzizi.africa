---
{id: GRP-0A692FF863B2,name: Mobile app alignment,type: documentation,extra: {created_at: 2026-11-02T20:53:32.137Z}}
---

# Mobile app alignment plan

## Approach

Start with a screen and contract audit against WHY, STORY, ARCHITECTURE, DATA_LIFECYCLE, DOMAINS, MIGRATION and the geography API contract. Keep the existing verified geography slice as the working foundation. Identify where static examples, transient state, ambiguous screen scope or missing API contracts make the app inconsistent with the evidence lifecycle.

## Milestones

1. Document current behavior and prioritized gaps, including source/evidence display, temporal exploration, geography-first navigation, money/history integration, saved state and error/offline behavior.
2. Define the app's public-facing scope and any API contracts required before each screen becomes data-backed.
3. Implement screen changes in small vertical slices that consume NestJS read contracts and preserve provenance, valid time and uncertainty.
4. Validate across supported platforms and devices, including accessibility, performance, offline and API failure states.

## Constraints and risks

The app is a consumer of canonical knowledge, not a source of it. The source registry, extraction pipeline and review workbench remain backend responsibilities. The API's current geography contract is ahead of the other public-domain contracts; prioritize contract availability instead of hard-coding facts into Flutter. Do not present sample civic/history content as canonical evidence.
