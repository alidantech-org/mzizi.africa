---
{id: TSK-C44589F7EF4B,name: Add persistent three-step mobile onboarding,type: task,status: completed,priority: medium,created_at: 2026-11-02T21:53:05.935Z,updated_at: 2026-11-02T21:55:11.851Z,order: 9216,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T21:53:07.772Z},{from: in-progress,to: completed,at: 2026-11-02T21:55:11.851Z}]}}
---

# Add persistent three-step mobile onboarding

## Goal

Add the three onboarding screens shown in the Mzizi mobile design reference before the app's existing five-tab experience. Introduce the product, explain its supported discovery paths, and show how users can save API-backed event and budget records. The flow must be skippable, accessible, match the existing warm visual theme, and appear only until completed or skipped.

## Context

The mobile app has a data-backed Home, geography Explore map, event History, public Money budget list and a My Mzizi saved view. The reference includes Welcome, What you'll get and Stay connected slides. The app does not currently implement push notifications or persistent sign-in; onboarding copy must not promise those features. Mzizi API and verified map boundaries may be unavailable at launch, so the geography illustration must show API-backed boundaries only when returned and use an abstract neutral illustration otherwise. Persist completion using cross-platform local preferences so browser, Android and iOS launches do not repeatedly show onboarding. Do not put sample data values or unsupported claims into the onboarding.

## Acceptance checklist

- [x] Build a responsive three-page onboarding flow with page indicators, Next, Skip and final Get Started actions.
- [x] Use warm Mzizi styling and honest product descriptions for geography, event and budget exploration and saved records.
- [x] Use verified map geometry when the API provides it; never bundle or imply sample boundaries as canonical data.
- [x] Persist completion across app restarts on supported mobile and web targets, and let users bypass onboarding immediately.
- [x] Route completed/skipped users into the existing AppShell without changing existing tab behavior.
- [x] Format changed Dart files, run `task validate`, and record that visual/runtime checks were not run unless an app target is available.

## Comments

### 2026-11-02T21:55:09.431Z · Ruth Moraa

Implemented a three-page welcome flow and persistent completion using browser localStorage plus Android SharedPreferences and iOS UserDefaults through a Flutter method channel. The map slide reuses the existing verified-boundary map. The shared_preferences package could not be fetched because pub.dev access failed, so no package dependency was added. Dart formatting, git diff --check and task validate passed; no Flutter visual/runtime check was run.
