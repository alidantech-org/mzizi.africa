import 'package:go_router/go_router.dart';
import 'package:mzizi_app/presentation/insights/civic_pages.dart';
import 'package:mzizi_app/presentation/insights/democracy_pages.dart';
import 'package:mzizi_app/presentation/insights/explore_pages.dart';
import 'package:mzizi_app/presentation/pages/evidence_page.dart';
import 'package:mzizi_app/presentation/pages/place_profile_page.dart';
import 'package:mzizi_app/presentation/pages/places_page.dart';
import 'package:mzizi_app/presentation/pages/saved_page.dart';
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
          path: '/search',
          pageBuilder: (c, s) => fadeTransition(child: const SearchScreen()),
        ),
        GoRoute(
          path: '/explore',
          pageBuilder: (c, s) => fadeTransition(child: const ExploreScreen()),
        ),
        GoRoute(
          path: '/browse',
          pageBuilder: (c, s) => fadeTransition(child: const BrowseScreen()),
        ),
        GoRoute(
          path: '/browse/:id',
          pageBuilder: (c, s) => fadeTransition(
            child: BrowseScreen(featureId: s.pathParameters['id']),
          ),
        ),
        GoRoute(
          path: '/stats',
          pageBuilder: (c, s) => fadeTransition(child: const StatsScreen()),
        ),
        GoRoute(
          path: '/stats/:id',
          pageBuilder: (c, s) => fadeTransition(
            child: StatsScreen(featureId: s.pathParameters['id']),
          ),
        ),
        GoRoute(
          path: '/elections',
          pageBuilder: (c, s) => fadeTransition(child: const ElectionsScreen()),
        ),
        GoRoute(
          path: '/election/:id',
          pageBuilder: (c, s) => fadeTransition(
            child: ElectionScreen(id: s.pathParameters['id']!),
          ),
        ),
        GoRoute(
          path: '/place-elections/:id',
          pageBuilder: (c, s) => fadeTransition(
            child: PlaceElectionsScreen(id: s.pathParameters['id']!),
          ),
        ),
        GoRoute(
          path: '/parliament',
          pageBuilder: (c, s) =>
              fadeTransition(child: const ParliamentScreen()),
        ),
        GoRoute(
          path: '/motion/:code',
          pageBuilder: (c, s) => fadeTransition(
            child: MotionScreen(code: s.pathParameters['code']!),
          ),
        ),
        GoRoute(
          path: '/parties',
          pageBuilder: (c, s) => fadeTransition(child: const PartiesScreen()),
        ),
        GoRoute(
          path: '/party/:code',
          pageBuilder: (c, s) => fadeTransition(
            child: PartyScreen(code: s.pathParameters['code']!),
          ),
        ),
        GoRoute(
          path: '/leader/:id',
          pageBuilder: (c, s) =>
              fadeTransition(child: LeaderScreen(id: s.pathParameters['id']!)),
        ),
        GoRoute(
          path: '/civic',
          pageBuilder: (c, s) => fadeTransition(child: const CivicHubScreen()),
        ),
        GoRoute(
          path: '/civic/:id',
          pageBuilder: (c, s) =>
              fadeTransition(child: CivicScreen(id: s.pathParameters['id']!)),
        ),
        GoRoute(
          path: '/project/:code',
          pageBuilder: (c, s) => fadeTransition(
            child: ProjectScreen(code: s.pathParameters['code']!),
          ),
        ),
        GoRoute(
          path: '/tenders',
          pageBuilder: (c, s) => fadeTransition(child: const TendersScreen()),
        ),
        GoRoute(
          path: '/rankings',
          pageBuilder: (c, s) => fadeTransition(child: const RankingsScreen()),
        ),
        GoRoute(
          path: '/saved',
          pageBuilder: (context, state) =>
              fadeTransition(child: const SavedPage()),
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
