---
{id: TSK-864839A5CDBF,name: Generate shared API SDKs into source/sdk,type: task,status: in-progress,priority: medium,created_at: 2026-11-17T08:11:06.639Z,updated_at: 2026-11-17T08:11:38.631Z,order: 6144,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T08:11:38.631Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-864839A5CDBF/1794903098634-start,started_at: 2026-11-17T08:11:39.140Z}]}}}
---

# Generate shared API SDKs into source/sdk

## Goal

Generate one client SDK per language straight from the product API contract, so every frontend calls the API through the same generated code and nothing is duplicated per app. The TypeScript SDK (`source/sdk/api-ts`, package `@mzizi/api-client`) holds Next.js server actions, route maps and types for every API operation; the Dart SDK (`source/sdk/api-dart`, package `mzizi_api`) holds the Flutter feature clients and models. Apps import these packages; they never carry their own copy and never invent operations.

## Context

Today the frontends each generate their own bridge (`source/apps/web/_gen`, `source/apps/dev/_gen`, `source/apps/app/sdk/api`), and the generated Dart bridge fails `flutter analyze` because feature and client files lack imports. The official packs `unit/clients/next-api-bridge` and `unit/clients/flutter-api-bridge` hard-code relative imports, which `.docs/rules/typed-code.md` section 5 forbids. Dryv already exposes `dependency.path.prefixed` and a destination `imports: { path, prefix }`, so project copies of these packs in `dryv/packs` can use `#/` (TypeScript, via package.json `imports`) and `package:mzizi_api/` (Dart) imports. Frontend UI contracts consume a subset of the API operations, and later tasks bind the UI packs to these SDKs. No Dryv or official-pack repository changes are made. Existing generated app folders are replaced in a later task, not here.

## Acceptance checklist

- [x] `dryv/packs/sdk-ts` and `dryv/packs/sdk-dart` exist as copies of the official bridge packs with absolute imports and their own scaffold files.
- [x] `dryv.yaml` activates both under the `api` application with destinations `source/sdk/api-ts` and `source/sdk/api-dart`.
- [x] Generation writes both SDKs with no `../` imports; the Dart SDK passes `flutter analyze` and the TypeScript SDK passes `tsc`.
- [x] The SDK folders, their README and the root runner entries are documented, and `task validate` passes.

## Progress

`dryv/packs/sdk-ts` and `dryv/packs/sdk-dart` are project copies of the official bridge packs. Changes: imports use `dependency.path.prefixed` (`#/` in TypeScript through package.json `imports`, `package:mzizi_api/` in Dart); models and enums are placed and named by their group (`GeographyFeatureCollection`) because the whole API repeats names such as `Datasets` across groups; the Dart feature and client templates write their own `package:` imports, which fixes the three `flutter analyze` errors seen earlier (Dryv did not resolve those two dependencies under `operations: consumed`; the underlying cause was not investigated); the TypeScript pack gained `package.json`, `tsconfig.json` and `.gitignore` scaffolds, and its templates moved under `src/`.

Generated into `source/sdk/api-ts` (`@mzizi/api-client`) and `source/sdk/api-dart` (`mzizi_api`) with `generate --app api --pack sdk-ts --pack sdk-dart`: no `../` imports, `tsc` passes, `flutter analyze` reports no issues. The Dart `build_runner` step ran. Root runner projects `sdk-ts` and `sdk-dart` were added.

## Notes

- One generate run stopped with "generation input changed during generation: dryv/contracts/apps/engine/index.ts" because that file was edited concurrently by someone else; a rerun succeeded.
- The three frontends still generate their own bridges (`_gen`, `sdk/api`); switching them to these SDKs is the next task.
- Not run: the Dart SDK has no tests, and no app imports the SDKs yet.

## Formatting and unused imports

The SDK destinations run the repository's `imports` (Biome `noUnusedImports`, which ignores these paths in the root config, so the SDK tsconfig sets `noUnusedLocals` and `tsc` is the real check) and `format-ts` (Prettier, `source/backend/api/.prettierrc`) actions; the Dart pack has final actions `unused-imports` (`dart fix --apply --code=unused_import`) and `format` (`dart format lib`) after `build_runner`, so the generated `.g.dart` files are formatted too. Checked: Prettier reports all SDK TypeScript files formatted, `dart format` reports 0 changed, `flutter analyze` and `tsc` are clean. Still open: the generated app folders (`source/apps/{web,dev,app}`) come from official packs that format with their own settings (`pnpm dlx prettier` defaults) and leave an unused import in the Flutter feature providers; they are fixed when those packs are copied into `dryv/packs`.
