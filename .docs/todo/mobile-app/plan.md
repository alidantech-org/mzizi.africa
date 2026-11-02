---
{id: GRP-695C42C20702,name: Mobile app,type: documentation}
---

# Mobile app

## Goal

Deliver a dependable Flutter client that consumes stable Mzizi contracts, makes verified map geography explorable, and behaves clearly when data is absent or the API is unavailable.

## Activities

1. Document reproducible local API configuration across Chrome, emulator, and physical phone (`TSK-EAB6FC782E86`).
2. Complete county-to-child navigation with verified geometries and canonical IDs (`TSK-471C902B718F`).
3. Connect search entry points to real data and selected-place navigation (`TSK-C8093926792F`).
4. Verify platform behavior, accessibility, and representative Android map performance (`TSK-62F7658798F7`).

## Boundary

The app consumes geography and governance facts from Mzizi APIs. Never embed backend secrets, invent canonical records, derive identity from names, or highlight unverified geometry.

## Execution notes

Keep local host configuration separate from data ownership: a reachable development API does not make its records authoritative unless it supplies stable canonical IDs and verified provenance. The first mobile map layer is country-specific and should follow the API's classification rather than assume every country has counties or wards. Mobile search can only search records for which a real API or local saved-record list exists; fiscal record search stays limited to the sections currently present until a fiscal endpoint is available. The map remains usable as an imagery globe when the API is not configured, but it must explain that boundary data is unavailable. Complete the software checks first, then capture device-specific accessibility and performance evidence on a connected Android device before closing the final verification task.
