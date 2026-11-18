import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/brand/mz_logo.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
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
      <({String word, String path, String icon, String selectedIcon})>[
        (
          word: 'home',
          path: '/',
          icon: 'home',
          selectedIcon: 'home',
        ),
        (
          word: 'rankings',
          path: '/rankings',
          icon: 'trophy',
          selectedIcon: 'trophy',
        ),
        (
          word: 'search',
          path: '/search',
          icon: 'search',
          selectedIcon: 'search',
        ),
        (
          word: 'saved',
          path: '/saved',
          icon: 'heart',
          selectedIcon: 'heart',
        ),
      ];

  /// Profile and evidence screens belong to the Places tab.
  int _selected() {
    if (location == '/') return 0;
    if (location.startsWith('/rankings')) return 1;
    if (location.startsWith('/search') ||
        location.startsWith(AppRoutes.placeSearch)) {
      return 2;
    }
    if (location.startsWith('/saved')) return 3;
    return 0;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final language = ref.watch(languageProvider);
    final savedCount = ref.watch(savedProvider.select((s) => s.count));
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 16,
        title: const MzLogo(size: 30),
        actions: [
          IconButton(
            tooltip: 'Light or dark',
            icon: MzIcon(Theme.of(context).brightness == Brightness.dark ? 'sun' : 'moon'),
            onPressed: () => UserStore.instance.setThemeMode(
              Theme.of(context).brightness == Brightness.dark ? ThemeMode.light : ThemeMode.dark,
            ),
          ),
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
                child: MzIcon(tab.icon),
              ),
              selectedIcon: Badge(
                isLabelVisible: tab.path == '/saved' && savedCount > 0,
                label: Text('$savedCount'),
                child: MzIcon(tab.selectedIcon),
              ),
              label: tr(language, tab.word),
            ),
        ],
      ),
    );
  }
}
