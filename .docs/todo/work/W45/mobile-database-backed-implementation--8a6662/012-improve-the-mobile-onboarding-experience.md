---
{id: TSK-CC25565BE285,name: Improve the mobile onboarding experience,type: task,status: in-progress,priority: medium,created_at: 2026-11-04T07:27:39.463Z,updated_at: 2026-11-04T08:03:41.504Z,order: 12288,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-04T07:27:45.432Z},{from: in-progress,to: completed,at: 2026-11-04T07:30:04.957Z},{from: completed,to: in-progress,at: 2026-11-04T07:46:20.016Z},{from: in-progress,to: completed,at: 2026-11-04T07:49:23.083Z},{from: completed,to: in-progress,at: 2026-11-04T07:57:14.733Z},{from: in-progress,to: completed,at: 2026-11-04T07:59:18.641Z},{from: completed,to: in-progress,at: 2026-11-04T08:03:41.504Z}]}}
---

---
{id: TSK-CC25565BE285,name: Improve the mobile onboarding experience,type: task,status: in-progress,priority: medium,created_at: 2026-11-04T07:27:39.463Z,updated_at: 2026-11-04T07:57:14.733Z,order: 12288,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-04T07:27:45.432Z},{from: in-progress,to: completed,at: 2026-11-04T07:30:04.957Z},{from: completed,to: in-progress,at: 2026-11-04T07:46:20.016Z},{from: in-progress,to: completed,at: 2026-11-04T07:49:23.083Z},{from: completed,to: in-progress,at: 2026-11-04T07:57:14.733Z}]}}
---

---
{id: TSK-CC25565BE285,name: Improve the mobile onboarding experience,type: task,status: in-progress,priority: medium,created_at: 2026-11-04T07:27:39.463Z,updated_at: 2026-11-04T07:46:20.016Z,order: 12288,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-04T07:27:45.432Z},{from: in-progress,to: completed,at: 2026-11-04T07:30:04.957Z},{from: completed,to: in-progress,at: 2026-11-04T07:46:20.016Z}]}}
---

# Improve the mobile onboarding experience

## Goal

Make the first launch of the Mzizi mobile app feel clear, polished and easy to move through. The onboarding should explain what the current app can do, introduce its place centered and evidence aware Explore experience, and make completion or skipping predictable. Improvements should work on small phones and larger layouts and should respect the existing Flutter theme and product direction.

## Context

The current onboarding is implemented in `source/apps/mobile/lib/screens/onboarding_screen.dart` as a three page `PageView`. It introduces Mzizi, Kenya place exploration, and session saved records. The app is a client of the NestJS API, and onboarding copy must not imply that unavailable records are populated or that session saves persist beyond the current session. Keep this work within the mobile presentation layer; do not add backend behavior or alter canonical data contracts. Follow the evidence first, time aware Mzizi purpose in `.docs/docs/WHY.md` and `.docs/docs/STORY.md`, and preserve the existing app navigation and completion callback. Accessibility, concise copy, responsive layout, and clear progress/navigation feedback are part of the user experience.

## Acceptance checklist

- [x] Refine the three onboarding pages so each communicates one concrete current app capability in concise, product aligned language.
- [x] Improve the visual hierarchy and page artwork using the existing theme and widgets, with layouts that remain usable on compact phone screens and wider screens.
- [x] Make progress, back, skip, and completion controls clear and accessible, including meaningful semantics for page position and tappable controls.
- [x] Preserve the existing completion callback behavior and accurately describe session only saved items and evidence availability.
- [x] Format and inspect the changed Dart code, and record whether any checks were run.
- [x] Complete the Task checklist and validate the Task workspace.


## Reference-led layout revision

The user supplied a three-screen onboarding image as a visual reference. Apply its rounded portrait panels, prominent upper illustration, lower title and supporting copy, compact page markers, and circular next action. Preserve the mobile app's existing system colors and write only Mzizi-specific context about Kenya place exploration, evidence details, and saved records. Do not reuse the reference image's copy or subject matter.

- [x] Reshape the three screens around the reference's panel and illustration hierarchy while keeping the existing Mzizi palette and accessible navigation.


## Single-screen animation revision

The user reviewed the rounded-panel implementation and requested a regular single-screen onboarding treatment. Remove the outer card, nested illustration panels and decorative borders so the screen reads as one continuous surface. Keep the existing app color roles, brand header, Mzizi-specific page copy, accessible progress/navigation, and completion behavior. Add a restrained entrance animation to the illustrations when a page becomes active.

- [x] Flatten the onboarding pages into one continuous screen with no stacked card surfaces or decorative borders.
- [x] Animate the active page illustration on entry while respecting the Mzizi system palette and current content.
