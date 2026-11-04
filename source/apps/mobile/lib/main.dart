import 'package:flutter/material.dart';

import 'data/onboarding_store.dart';
import 'screens/explore_screen.dart';
import 'screens/home_screen.dart';
import 'screens/history_screen.dart';
import 'screens/money_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/saved_screen.dart';
import 'theme/app_theme.dart';

void main() => runApp(const MziziApp());

class MziziApp extends StatelessWidget {
  const MziziApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Mzizi Africa',
    debugShowCheckedModeBanner: false,
    theme: AppTheme.light,
    darkTheme: AppTheme.dark,
    themeMode: ThemeMode.light,
    home: const AppEntry(),
  );
}

class AppEntry extends StatefulWidget {
  const AppEntry({super.key});

  @override
  State<AppEntry> createState() => _AppEntryState();
}

class _AppEntryState extends State<AppEntry> {
  static const _store = OnboardingStore();
  bool _checking = true;
  bool _complete = false;

  @override
  void initState() {
    super.initState();
    _restoreOnboarding();
  }

  Future<void> _restoreOnboarding() async {
    var complete = false;
    try {
      complete = await _store.isComplete;
    } catch (_) {
      // Storage may be unavailable in a restricted browser context.
    }
    if (!mounted) return;
    setState(() {
      _complete = complete;
      _checking = false;
    });
  }

  Future<void> _finishOnboarding() async {
    try {
      await _store.complete();
    } catch (_) {
      // Continue into the app even if local persistence is unavailable.
    }
    if (mounted) setState(() => _complete = true);
  }

  @override
  Widget build(BuildContext context) {
    if (_checking) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    if (!_complete) return OnboardingScreen(onComplete: _finishOnboarding);
    return const AppShell();
  }
}

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int selectedTab = 0;

  @override
  Widget build(BuildContext context) {
    void onNavigate(int tab) => setState(() => selectedTab = tab);
    return Scaffold(
      body: IndexedStack(
        index: selectedTab,
        children: [
          HomeScreen(onNavigate: onNavigate),
          ExploreScreen(onNavigate: onNavigate),
          MoneyScreen(onNavigate: onNavigate),
          HistoryScreen(onNavigate: onNavigate),
          SavedScreen(onNavigate: onNavigate),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: selectedTab,
        onDestinationSelected: onNavigate,
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), label: 'Home'),
          NavigationDestination(
            icon: Icon(Icons.explore_outlined),
            label: 'Explore',
          ),
          NavigationDestination(
            icon: Icon(Icons.account_balance_wallet_outlined),
            label: 'Money',
          ),
          NavigationDestination(
            icon: Icon(Icons.history_outlined),
            label: 'Updates',
          ),
          NavigationDestination(
            icon: Icon(Icons.bookmark_border),
            label: 'My Mzizi',
          ),
        ],
      ),
    );
  }
}
