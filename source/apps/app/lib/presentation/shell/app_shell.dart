import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/core/theme/mzizi_theme.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/routers/navigation.dart';
import 'package:mzizi_app/presentation/saved/saved_store.dart';

/// The frame around every screen: an app bar with the language switch and a bottom navigation bar. The paths come
/// from the generated `AppRoutes`; the icons, labels and the choice of destinations are hand-built.
class AppShell extends ConsumerWidget {
  const AppShell({super.key, required this.location, required this.child});

  final String location;
  final Widget child;

  static const _tabs =
      <({String word, String path, IconData icon, IconData selectedIcon})>[
        (
          word: 'home',
          path: '/',
          icon: Icons.home_outlined,
          selectedIcon: Icons.home,
        ),
        (
          word: 'places',
          path: AppRoutes.placeSearch,
          icon: Icons.place_outlined,
          selectedIcon: Icons.place,
        ),
        (
          word: 'sources',
          path: AppRoutes.sourceBrowse,
          icon: Icons.menu_book_outlined,
          selectedIcon: Icons.menu_book,
        ),
        (
          word: 'saved',
          path: '/saved',
          icon: Icons.favorite_border,
          selectedIcon: Icons.favorite,
        ),
      ];

  /// Profile and evidence screens belong to the Places tab.
  int _selected() {
    if (location == '/') return 0;
    if (location.startsWith(AppRoutes.sourceBrowse)) return 2;
    if (location.startsWith('/saved')) return 3;
    return 1;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final language = ref.watch(languageProvider);
    final savedCount = ref.watch(savedProvider.select((s) => s.count));
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 16,
        title: Row(
          children: [
            const CircleAvatar(
              radius: 15,
              backgroundColor: MziziTokens.clay,
              child: Text(
                'M',
                style: TextStyle(
                  color: MziziTokens.cream,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Text(
              'Mzizi',
              style: TextStyle(fontFamily: 'Georgia', fontSize: 22),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: SegmentedButton<String>(
              showSelectedIcon: false,
              style: const ButtonStyle(visualDensity: VisualDensity.compact),
              segments: const [
                ButtonSegment(value: 'en', label: Text('EN')),
                ButtonSegment(value: 'sw', label: Text('SW')),
              ],
              selected: {language},
              onSelectionChanged: (choice) =>
                  ref.read(languageProvider.notifier).state = choice.first,
            ),
          ),
        ],
      ),
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selected(),
        onDestinationSelected: (index) => context.go(_tabs[index].path),
        destinations: [
          for (final tab in _tabs)
            NavigationDestination(
              icon: Badge(
                isLabelVisible: tab.path == '/saved' && savedCount > 0,
                label: Text('$savedCount'),
                child: Icon(tab.icon),
              ),
              selectedIcon: Badge(
                isLabelVisible: tab.path == '/saved' && savedCount > 0,
                label: Text('$savedCount'),
                child: Icon(tab.selectedIcon),
              ),
              label: tr(language, tab.word),
            ),
        ],
      ),
    );
  }
}
