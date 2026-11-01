---
{id: DOC-364040F754D0,name: Mobile App Goal,type: documentation}
---

# Mobile App Goal

## Goal

Deliver a reliable Flutter application that lets people explore verified Mzizi geography, navigate country-specific administrative hierarchies, and find places through canonical API records. A user should understand whether a boundary is verified, where its data came from, and what to do when the API is slow, unavailable, or has no geometry for an area. Developers should be able to run the same app locally in Chrome, an Android emulator, or a physical Android device by selecting the API host reachable from that target.

## Success criteria

- Place searches resolve stable backend IDs and never infer an entity from its display name.
- County and child boundaries are drawn only when the full feature collection passes ID, geometry, verification, source, and license validation.
- Parent navigation follows explicit parent IDs, and rapid searches or selections cannot restore stale state.
- Local development instructions distinguish Chrome loopback, Android emulator host access, and physical-device LAN access.
- User-facing loading, empty, unavailable-boundary, retry, and API error states remain clear without invented records.
- Representative Android memory, frame rate, and interaction latency are measured before rollout.
