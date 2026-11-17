# Flutter API Bridge pack

Generates a Dart/Flutter package over [`flutter_api_bridge`](https://pub.dev/packages/flutter_api_bridge). This is the Dryv version of the riderescue Dart templates.

| IR | Generated |
| --- | --- |
| application | `pubspec.yaml` (package name = the application name in snake case) and the facade `lib/api.dart` |
| operations of a group | `lib/src/features/<group>_feature.dart` (`<Group>Feature`, one typed method per operation returning `ApiResult<T>`) and `lib/src/endpoints/<group>_endpoints.dart` (`<Group>Endpoints`) |
| all HTTP operations | `lib/src/client.dart`: `<App>Client` with one feature per group |
| schema | `lib/src/models/<schema>.dart`, a `json_serializable` class |
| enum | `lib/src/enums/<enum>.dart` with `@JsonValue` wire values |

Each method tags its request with a stable `operationId` (`<group>.<operation>`).

```dart
await AdminConsole.initialize(baseUri: Uri.parse('https://api.example.com'));
final result = await AdminConsole.instance.client.core.getUser(id: '42');
```

After generating, run `dart run build_runner build` for the model code.

**Requires `flutter_api_bridge` ^0.2.0.** 0.2.0 isn't on pub.dev yet; until it is, add a `pubspec_overrides.yaml` pointing at the git repo (the fixture does).

**Provides:** `operation.client` (the group feature clients), `schema.types` (models) and `property.enum.types` (enums), so apps such as `frontend/flutter-app` can bind to it.

**Test:** `bun scripts/test-pack.ts unit/clients/flutter-api-bridge` resolves the package, runs `build_runner`, `flutter analyze` and unit tests over models, endpoints and the facade.

## Use it

The [executable Usage fixture](tests/fixture/dryv.yaml) shows the current source collection, destination and pack activation for this pack.
