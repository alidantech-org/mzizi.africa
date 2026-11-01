---
{id: TSK-EAB6FC782E86,name: Make mobile local API configuration reproducible,type: task,status: planned,priority: high,created_at: 2026-11-01T00:36:49.420Z,updated_at: 2026-11-01T05:36:27.889Z,tags: [mobile,configuration,geography],extra: {description: "Align Flutter runtime configuration with MZIZI_API_BASE_URL dart-define, local .env.local expectations, and browser/emulator/physical-device host differences. Ensure the app does not imply .env.local is loaded unless code actually loads it.",acceptance_criteria: ["README gives copyable Chrome, Android emulator, and physical-device commands.",API origin has a safe development default or clear missing-config state.,No backend credentials are embedded in the client.]},due_at: 2026-11-07}
---

# Make mobile local API configuration reproducible

## Summary

Make Flutter local API configuration understandable for Chrome, Android emulator, and physical-device development.

## Acceptance criteria

- [ ] README shows correct reachable host per target platform.
- [ ] Document that .env.local is not consumed unless code loads it; use supported Dart defines.
- [ ] Missing configuration and unreachable API states are clear, and no backend credentials enter the app.
