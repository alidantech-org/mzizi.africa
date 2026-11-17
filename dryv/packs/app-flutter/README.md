# Flutter app pack

Generates a runnable Flutter app from views, organised by feature the way a production go_router app is: one folder of screens per feature, a router per feature, route constants, Riverpod state per screen, and API calls through the [flutter-api-bridge](../../clients/flutter-api-bridge) client.

| IR | Generated | Owner |
| --- | --- | --- |
| feature | `lib/presentation/screens/<feature>/_<feature>.router.dart`: a `GoRoute` per view, behind the connectivity gate | Dryv |
| feature | `lib/presentation/routers/constants/<feature>_screens.dart`: route paths, `/<group>/<view>` | Dryv |
| view | `lib/presentation/screens/<feature>/<view>_providers.dart`: a provider per `present` part, a submit function and form fields per `collect` part, a call per `invoke` part | Dryv |
| view | `lib/presentation/screens/<feature>/<view>_screen.dart`: the screen | **you** (scaffold) |
| all views | `lib/presentation/routers/go_router.dart`: every feature's routes | Dryv |

Written once: `pubspec.yaml`, `lib/main.dart` and `lib/core/config/app_config.dart` are scaffolds you own. Always regenerated: `lib/core/network/app_network_gate.dart`, `lib/presentation/routers/_utils.dart`, `lib/presentation/widgets/dryv_form.dart` and `dryv_result.dart`.

A `present` part loads when the screen opens, unless a `collect` part of the same view submits to the same operation; then it shows that submission's result. Forms are built from the input schema: text, number, boolean, choice (enum) and date fields.

**Binds:** `operation.client` (calls go through the bridge's `<Group>Feature` classes) and `schema.types` (request models), both provided by `clients/flutter-api-bridge`. The app imports the bridge package as `package:<application>/api.dart`, with a pubspec path dependency set by the `api_path` input (default `../api`).

**Limits in 0.1.0:**
- Views must belong to a feature.
- A screen-opening `present` calls its operation with no arguments, so operations with required inputs need a form or hand-written code in the screen.
- Nested schemas and arrays aren't editable in generated forms.

**Test:** `bun scripts/test-pack.ts unit/frontend/flutter-app` generates the bridge (`out/api`) and the app (`out/app`) bound to it, resolves both with Flutter, runs `build_runner` on the bridge, and runs `flutter analyze` and `flutter test` on the app.

## Use it

The [executable Usage fixture](tests/fixture/dryv.yaml) shows the current source collection, destination and pack activation for this pack.

Run it with `flutter run --dart-define=API_URL=https://your-api`.
