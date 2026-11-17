import 'package:go_router/go_router.dart';
import 'package:mzizi_app/presentation/pages/evidence_page.dart';
import 'package:mzizi_app/presentation/pages/place_profile_page.dart';
import 'package:mzizi_app/presentation/pages/places_page.dart';
import 'package:mzizi_app/presentation/pages/sources_page.dart';
import 'package:mzizi_app/presentation/routers/_utils.dart';
import 'package:mzizi_app/presentation/routers/navigation.dart';
import 'package:mzizi_app/presentation/screens/home/home_screen.dart';
import 'package:mzizi_app/presentation/shell/app_shell.dart';

/// The app's router. Scaffolded by Dryv once; this file belongs to the app. Paths come from the generated
/// `AppRoutes`; the screens are hand-built (the generated reference screens in `screens/features/` are not routed).
final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (context, state, child) =>
          AppShell(location: state.uri.path, child: child),
      routes: [
        GoRoute(
          path: '/',
          pageBuilder: (context, state) =>
              fadeTransition(child: const HomeScreen()),
        ),
        GoRoute(
          path: AppRoutes.placeSearch,
          pageBuilder: (context, state) => fadeTransition(
            child: PlacesPage(query: state.uri.queryParameters['q'] ?? ''),
          ),
        ),
        GoRoute(
          path: AppRoutes.placeProfile,
          pageBuilder: (context, state) => fadeTransition(
            child: PlaceProfilePage(
              featureId: state.uri.queryParameters['featureId'],
              latitude: double.tryParse(state.uri.queryParameters['lat'] ?? ''),
              longitude: double.tryParse(
                state.uri.queryParameters['lng'] ?? '',
              ),
            ),
          ),
        ),
        GoRoute(
          path: AppRoutes.sourceBrowse,
          pageBuilder: (context, state) =>
              fadeTransition(child: const SourcesPage()),
        ),
        GoRoute(
          path: AppRoutes.evidenceView,
          pageBuilder: (context, state) => fadeTransition(
            child: EvidencePage(
              citationId: state.uri.queryParameters['citationId'] ?? '',
            ),
          ),
        ),
      ],
    ),
  ],
);
