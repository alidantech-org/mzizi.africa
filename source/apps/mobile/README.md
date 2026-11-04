# Mzizi Mobile

The Explore map uses the versioned geography API contract in
[`.docs/docs/geography-api-contract.md`](../../../.docs/docs/geography-api-contract.md).
The Flutter app does not contain authoritative boundaries or governance data.

## Local API configuration

The app uses the NestJS API documented in [the API README](../../backend/api/README.md), which defaults to port 3000. Local browser and desktop launches default to `http://127.0.0.1:3000`; Android emulators default to `http://10.0.2.2:3000`. Set `MZIZI_API_BASE_URL` explicitly for a physical phone or deployed environment. Flutter does not load `.env.local` automatically; pass it using `--dart-define-from-file` when you need an override. Flutter accepts `KEY=value` entries in that file. The mobile `.gitignore` excludes `.env.local` and other `.env.*` files.

To override the local default, create `.env.local` from `source/apps/mobile`:

```dotenv
MZIZI_API_BASE_URL=http://127.0.0.1:3000
# Optional public Cesium token; omit for the imagery-only globe.
# CESIUM_ION_TOKEN=YOUR_RESTRICTED_PUBLIC_TOKEN
```

### Flutter Web in Chrome

Use loopback when Chrome and the API are running on the same computer:

```sh
flutter run -d chrome --dart-define-from-file=.env.local
```

The NestJS API and its database must be running separately. The API must allow the Flutter Web development origin through its CORS policy.

### Android emulator

`10.0.2.2` routes from the emulator to the development computer; this is the default unless overridden. Then run:

```sh
flutter devices
flutter run -d <emulator-device-id> --dart-define-from-file=.env.local
```

Android debug builds allow local cleartext HTTP for development. Release builds do not enable that setting.

### Physical Android phone

Connect the phone and computer to the same network, set `.env.local` to the computer's LAN address (for example `http://192.168.1.20:3000`), and override `MZIZI_API_BASE_URL` to the computer address and start the API bound to `0.0.0.0` on port `3000`. Allow that port through the computer's local firewall if required. Then run:

```sh
flutter devices
flutter run -d <phone-device-id> --dart-define-from-file=.env.local
```

Use the API's documented local setup and ensure the API and its database are running and reachable from the app target. For non-local deployments, use HTTPS.

The Ion token is optional and is public client configuration. Restrict it in the Cesium account. Country scope, initial boundary level, and camera center default to Kenya/county/Nairobi; override them with `MZIZI_DEFAULT_COUNTRY`, `MZIZI_DEFAULT_BOUNDARY_LEVEL`, `MZIZI_MAP_INITIAL_LONGITUDE`, `MZIZI_MAP_INITIAL_LATITUDE`, and `MZIZI_MAP_INITIAL_HEIGHT` defines if needed.

If the API origin is unset or unreachable, search and map boundaries show configuration/network errors; the app does not substitute sample geography.

The API exposes only geometry recorded as current and verified in the
geography boundary version table. An empty boundary response is expected until
verified, licensed source data has been loaded. The client will not draw a
substitute boundary.
