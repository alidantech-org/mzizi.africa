import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/shell/shell_bar.dart';

/// One bottom tab: a short word, where it goes and its icon.
typedef ShellTab = ({String word, String path, String icon});

/// The five tabs, TikTok-style: Home, Explore, the raised Leaderboard trophy in the middle (no text), Search, Profile.
/// Every other screen is pushed on top of one of them with its own bar and a back button.
const shellTabs = <ShellTab>[
  (word: 'home', path: '/', icon: 'home'),
  (word: 'explore', path: '/explore', icon: 'compass'),
  (word: 'rankings', path: '/rankings', icon: 'trophy'),
  (word: 'search', path: '/search', icon: 'search'),
  (word: 'profile', path: '/profile', icon: 'user'),
];

/// The title a pushed screen shows in its app bar, by the start of its path. The first match wins.
const _titles = <(String, String)>[
  ('/place-search', 'Places'),
  ('/place-profile', 'Place'),
  ('/browse', 'Places'),
  ('/stats', 'Statistics'),
  ('/elections', 'Elections'),
  ('/election/', 'Election'),
  ('/place-elections/', 'Elections'),
  ('/parliament', 'Parliament'),
  ('/motion/', 'Motion'),
  ('/parties', 'Parties'),
  ('/party/', 'Party'),
  ('/leader/', 'Leader'),
  ('/civic', 'Money & projects'),
  ('/project/', 'Project'),
  ('/tenders', 'Tenders'),
  ('/saved', 'Saved'),
  ('/source-browse', 'Sources'),
  ('/evidence-view', 'Evidence'),
  ('/feature-browse', 'Places'),
  ('/feature-detail', 'Place'),
];

String? _titleFor(String location) {
  for (final (prefix, title) in _titles) {
    if (location == prefix ||
        location.startsWith(prefix.endsWith('/') ? prefix : '$prefix/') ||
        location.startsWith('$prefix?')) {
      return title;
    }
  }
  return null;
}

/// Which tab a location belongs to, so the right one stays lit while a screen is open on top of it.
int tabFor(String location) {
  for (var i = 0; i < shellTabs.length; i++) {
    final path = shellTabs[i].path;
    if (path == '/'
        ? location == '/'
        : location == path || location.startsWith('$path/')) {
      return i;
    }
  }
  if (location.startsWith('/saved') || location.startsWith('/settings')) {
    return 4;
  }
  if (location.startsWith('/place') || location.startsWith('/browse')) return 0;
  return 1;
}

bool _isRoot(String location) => shellTabs.any((t) => t.path == location);

/// The frame around every screen: a bottom bar with four short tabs. Screens opened from a tab get an app bar with a
/// back button and a title (no breadcrumbs); the tabs themselves draw their own headers.
class AppShell extends StatelessWidget {
  const AppShell({
    super.key,
    required this.location,
    required this.child,
    this.pageOwnsScaffold = false,
  });

  final String location;
  final Widget child;
  final bool pageOwnsScaffold;

  void _back(BuildContext context) {
    if (context.canPop()) {
      context.pop();
    } else {
      context.go(shellTabs[tabFor(location)].path);
    }
  }

  @override
  Widget build(BuildContext context) {
    // These destinations own their Scaffold and top bar. Keeping them in the same ShellRoute
    // avoids re-entering a buried shell (and duplicating its Navigator page key) on detail pushes.
    if (pageOwnsScaffold) return child;
    final root = _isRoot(location);
    final title = _titleFor(location);
    return Scaffold(
      appBar: root
          ? null
          : AppBar(
              leading: IconButton(
                tooltip: t(context, 'Back'),
                icon: MzIcon('chevron-left'),
                onPressed: () => _back(context),
              ),
              title: Text(title == null ? '' : t(context, title)),
              centerTitle: false,
            ),
      body: child,
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: TrophyButton(
        selected: tabFor(location) == 2,
        label: tr(uiLanguage, 'rankings'),
        onTap: () => context.go('/rankings'),
      ),
      bottomNavigationBar: ShellBar(
        selected: tabFor(location),
        onSelect: (i) => context.go(shellTabs[i].path),
      ),
    );
  }
}
