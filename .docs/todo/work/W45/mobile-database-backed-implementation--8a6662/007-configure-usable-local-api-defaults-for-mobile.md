---
{id: TSK-E83EEDD6D381,name: Configure usable local API defaults for mobile,type: task,status: completed,priority: medium,created_at: 2026-11-02T21:38:55.666Z,updated_at: 2026-11-02T21:39:23.495Z,order: 7168,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T21:38:57.307Z},{from: in-progress,to: completed,at: 2026-11-02T21:39:23.495Z}]}}
---

# Configure a usable local API default for the mobile app

## Goal

Make the mobile app issue real read requests by default when developers launch it in the normal local browser or Android emulator workflow. Both the geography map and the event/finance screens must share one source of truth for the API origin. The app should preserve compile-time overrides for physical phones and deployed environments, and explain clearly when the API host cannot be reached.

## Context

The mobile UI now uses NestJS routes for event, fiscal-year and budget records, and the map uses the same service for verified geography boundaries. A screenshot showed the screens failing before making a request because `MZIZI_API_BASE_URL` was unset. Flutter does not read the documented `.env.local` automatically unless `--dart-define-from-file` is passed. Local defaults can safely use loopback for Flutter Web/desktop and Android emulator host routing for Android; physical devices and deployments still require an explicit reachable origin. The API is not running in this workspace at present, so this task must distinguish missing configuration from an unavailable server and must not claim database records were fetched during implementation.

## Acceptance checklist

- [x] Centralize mobile API origin resolution and use it in geography, events and finance clients.
- [x] Default local browser/desktop launches to `http://127.0.0.1:3000` and Android emulator launches to `http://10.0.2.2:3000`; retain `MZIZI_API_BASE_URL` override behavior.
- [x] Convert client connection and timeout failures into actionable messages that tell developers to start/check the NestJS API and configure a reachable address.
- [x] Update mobile setup documentation to explain defaults, overrides, and the requirement that NestJS plus its database be running.
- [x] Format changed Dart files, run Task workspace validation, and report that live fetching remains unverified if the API/database is unavailable.
