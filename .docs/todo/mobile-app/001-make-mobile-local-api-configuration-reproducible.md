---
{id: TSK-EAB6FC782E86,name: Make mobile local API configuration reproducible,type: task,status: completed,priority: high,created_at: 2026-11-01T00:36:49.420Z,updated_at: 2026-11-01T05:46:57.425Z,tags: [mobile,configuration,geography],extra: {description: "Align Flutter runtime configuration with MZIZI_API_BASE_URL dart-define, local .env.local expectations, and browser/emulator/physical-device host differences. Ensure the app does not imply .env.local is loaded unless code actually loads it.",acceptance_criteria: ["README gives copyable Chrome, Android emulator, and physical-device commands.",API origin has a safe development default or clear missing-config state.,No backend credentials are embedded in the client.],status_history: [{from: planned,to: completed,at: 2026-11-01T05:46:57.425Z}]},due_at: 2026-11-07}
---

# Make mobile local API configuration reproducible

## Goal

Make the mobile app connect to the local Mzizi geography API from a developer's actual target device without guessing host addresses or committing configuration. This resolves the recurring “failed to fetch” setup problem by distinguishing the computer's loopback address from the Android emulator bridge and the computer's LAN address for a physical phone. Keep the same compile-time configuration model in source so release builds remain reproducible and backend credentials never enter the mobile bundle.

## Context

`GeographyApiClient` reads `MZIZI_API_BASE_URL` with `String.fromEnvironment`. Flutter does not discover `.env.local` by filename; the developer must pass the file using Flutter's supported `--dart-define-from-file` option. The file is ignored by the mobile `.gitignore`. Chrome and the API share the computer network namespace, while an Android emulator reaches the host through `10.0.2.2`. A physical phone needs the computer's reachable LAN IP and a backend bound to a network interface. Plain HTTP is limited to local development, with cleartext allowed only in Android debug builds. The API still needs to be running and the browser origin must be allowed by its CORS policy.

## Acceptance checklist

- [x] README shows copyable Chrome, Android emulator, and physical Android phone commands with the correct host address for each.
- [x] Document that `.env.local` is not loaded automatically and is passed explicitly with `--dart-define-from-file`.
- [x] Missing or unreachable API configuration has a visible map/search error, local HTTP is debug-only on Android, and no backend credential is added to the app.
