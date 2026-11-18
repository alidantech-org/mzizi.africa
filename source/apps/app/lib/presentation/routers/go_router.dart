import 'package:go_router/go_router.dart';
import 'package:mzizi_app/presentation/insights/civic_pages.dart';
import 'package:mzizi_app/presentation/insights/democracy_pages.dart';
import 'package:mzizi_app/presentation/insights/explore_pages.dart';
import 'package:mzizi_app/presentation/insights/leader_tree_screen.dart';
import 'package:mzizi_app/presentation/insights/rankings_tab.dart';
import 'package:mzizi_app/presentation/home/compare_screen.dart';
import 'package:mzizi_app/presentation/onboarding/onboarding_screen.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';
import 'package:mzizi_app/presentation/explore/explore_hub.dart';
import 'package:mzizi_app/presentation/explore/facts_screen.dart';
import 'package:mzizi_app/presentation/governance/institutions_screen.dart';
import 'package:mzizi_app/presentation/governance/content_screen.dart';
import 'package:mzizi_app/presentation/settings/settings_screen.dart';
import 'package:mzizi_app/presentation/pages/evidence_page.dart';
import 'package:mzizi_app/presentation/pages/place_profile_page.dart';
import 'package:mzizi_app/presentation/pages/places_page.dart';
import 'package:mzizi_app/presentation/pages/saved_page.dart';
import 'package:mzizi_app/presentation/pages/sources_page.dart';
import 'package:mzizi_app/presentation/routers/framing.dart';
import 'package:mzizi_app/presentation/routers/navigation.dart';
import 'package:mzizi_app/presentation/screens/home/home_screen.dart';
import 'package:mzizi_app/presentation/screens/splash_screen.dart';
import 'package:mzizi_app/presentation/shell/app_shell.dart';

/// The app's router. Scaffolded by Dryv once; this file belongs to the app. Paths come from the generated
/// `AppRoutes`; the screens are hand-built (the generated reference screens in `screens/features/` are not routed).
final appRouter = GoRouter(
  initialLocation: '/splash',
  refreshListenable: UserStore.instance,
  redirect: (context, state) {
    if (state.uri.path == '/splash') return null;
    final done = UserStore.instance.onboarded;
    if (!done && state.uri.path != '/welcome') return '/welcome';
    if (done && state.uri.path == '/welcome') return '/';
    return null;
  },
  routes: [
    GoRoute(path: '/splash', builder: (c, s) => const SplashScreen()),
    GoRoute(path: '/welcome', builder: (c, s) => const OnboardingScreen()),
    ShellRoute(
      builder: (context, state, child) => AppShell(
        location: state.uri.path,
        pageOwnsScaffold: state.topRoute is SelfFramedGoRoute,
        child: child,
      ),
      routes: [
        SelfFramedGoRoute(
          path: '/compare',
          builder: (c, s) => const CompareScreen(),
        ),
        SelfFramedGoRoute(
          path: '/leaders-tree',
          builder: (c, s) => LeaderTreeScreen(
            institution: s.uri.queryParameters['institution'],
          ),
        ),
        GoRoute(path: '/settings', redirect: (c, s) => '/profile'),
        SelfFramedGoRoute(
          path: '/leaders',
          builder: (c, s) => const LeaderTreeScreen(),
        ),
        SelfFramedGoRoute(
          path: '/institutions',
          builder: (c, s) => const InstitutionsScreen(),
        ),
        SelfFramedGoRoute(
          path: '/constitution',
          builder: (c, s) => const ContentScreen(
            slug: 'constitution/overview',
            title: 'The Constitution',
          ),
        ),
        SelfFramedGoRoute(
          path: '/institutions/:code',
          builder: (c, s) => InstitutionScreen(code: s.pathParameters['code']!),
        ),
        SelfFramedGoRoute(
          path: '/content',
          builder: (c, s) => ContentScreen(
            slug: s.uri.queryParameters['slug'],
            subjectTable: s.uri.queryParameters['subjectTable'],
            subjectCode: s.uri.queryParameters['subjectCode'],
          ),
        ),
        SelfFramedGoRoute(
          path: '/library',
          builder: (c, s) => const ContentLibraryScreen(),
        ),

        GoRoute(
          path: '/',
          pageBuilder: (context, state) =>
              fadePage(key: state.pageKey, child: const HomeScreen()),
        ),
        GoRoute(
          path: AppRoutes.placeSearch,
          pageBuilder: (context, state) => fadePage(
            key: state.pageKey,
            child: PlacesPage(query: state.uri.queryParameters['q'] ?? ''),
          ),
        ),
        GoRoute(
          path: AppRoutes.placeProfile,
          pageBuilder: (context, state) => fadePage(
            key: state.pageKey,
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
          path: '/profile',
          pageBuilder: (c, s) =>
              fadePage(key: s.pageKey, child: const SettingsScreen()),
        ),
        GoRoute(
          path: '/facts',
          pageBuilder: (c, s) =>
              fadePage(key: s.pageKey, child: const FactsScreen()),
        ),
        GoRoute(
          path: '/rankings',
          pageBuilder: (c, s) => fadePage(
            key: s.pageKey,
            child: RankingsTab(metric: s.uri.queryParameters['metric']),
          ),
        ),
        GoRoute(
          path: '/search',
          pageBuilder: (c, s) =>
              fadePage(key: s.pageKey, child: const SearchScreen()),
        ),
        GoRoute(
          path: '/explore',
          pageBuilder: (c, s) =>
              fadePage(key: s.pageKey, child: const ExploreHub()),
        ),
        GoRoute(
          path: '/browse',
          pageBuilder: (c, s) =>
              fadePage(key: s.pageKey, child: const BrowseScreen()),
        ),
        GoRoute(
          path: '/browse/:id',
          pageBuilder: (c, s) => fadePage(
            key: s.pageKey,
            child: BrowseScreen(featureId: s.pathParameters['id']),
          ),
        ),
        GoRoute(
          path: '/stats',
          pageBuilder: (c, s) =>
              fadePage(key: s.pageKey, child: const StatsScreen()),
        ),
        GoRoute(
          path: '/stats/:id',
          pageBuilder: (c, s) => fadePage(
            key: s.pageKey,
            child: StatsScreen(featureId: s.pathParameters['id']),
          ),
        ),
        GoRoute(
          path: '/elections',
          pageBuilder: (c, s) =>
              fadePage(key: s.pageKey, child: const ElectionsScreen()),
        ),
        GoRoute(
          path: '/election/:id',
          pageBuilder: (c, s) => fadePage(
            key: s.pageKey,
            child: ElectionScreen(id: s.pathParameters['id']!),
          ),
        ),
        GoRoute(
          path: '/place-elections/:id',
          pageBuilder: (c, s) => fadePage(
            key: s.pageKey,
            child: PlaceElectionsScreen(id: s.pathParameters['id']!),
          ),
        ),
        GoRoute(
          path: '/parliament',
          pageBuilder: (c, s) =>
              fadePage(key: s.pageKey, child: const ParliamentScreen()),
        ),
        GoRoute(
          path: '/motion/:code',
          pageBuilder: (c, s) => fadePage(
            key: s.pageKey,
            child: MotionScreen(code: s.pathParameters['code']!),
          ),
        ),
        GoRoute(
          path: '/parties',
          pageBuilder: (c, s) =>
              fadePage(key: s.pageKey, child: const PartiesScreen()),
        ),
        GoRoute(
          path: '/party/:code',
          pageBuilder: (c, s) => fadePage(
            key: s.pageKey,
            child: PartyScreen(code: s.pathParameters['code']!),
          ),
        ),
        GoRoute(
          path: '/leader/:id',
          pageBuilder: (c, s) => fadePage(
            key: s.pageKey,
            child: LeaderScreen(id: s.pathParameters['id']!),
          ),
        ),
        GoRoute(
          path: '/civic',
          pageBuilder: (c, s) =>
              fadePage(key: s.pageKey, child: const CivicHubScreen()),
        ),
        GoRoute(
          path: '/civic/:id',
          pageBuilder: (c, s) => fadePage(
            key: s.pageKey,
            child: CivicScreen(id: s.pathParameters['id']!),
          ),
        ),
        GoRoute(
          path: '/project/:code',
          pageBuilder: (c, s) => fadePage(
            key: s.pageKey,
            child: ProjectScreen(code: s.pathParameters['code']!),
          ),
        ),
        GoRoute(
          path: '/tenders',
          pageBuilder: (c, s) =>
              fadePage(key: s.pageKey, child: const TendersScreen()),
        ),
        GoRoute(
          path: '/saved',
          pageBuilder: (context, state) =>
              fadePage(key: state.pageKey, child: const SavedPage()),
        ),
        GoRoute(
          path: AppRoutes.sourceBrowse,
          pageBuilder: (context, state) =>
              fadePage(key: state.pageKey, child: const SourcesPage()),
        ),
        GoRoute(
          path: AppRoutes.evidenceView,
          pageBuilder: (context, state) => fadePage(
            key: state.pageKey,
            child: EvidencePage(
              citationId: state.uri.queryParameters['citationId'] ?? '',
            ),
          ),
        ),
      ],
    ),
  ],
);
