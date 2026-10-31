import 'package:flutter/material.dart';

import 'screens/explore_screen.dart';
import 'screens/home_screen.dart';
import 'screens/history_screen.dart';
import 'screens/money_screen.dart';
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
    home: const AppShell(),
  );
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
            label: 'History',
          ),
          NavigationDestination(
            icon: Icon(Icons.bookmark_border),
            label: 'Saved',
          ),
        ],
      ),
    );
  }
}
