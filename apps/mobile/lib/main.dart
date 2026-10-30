import 'package:flutter/material.dart';

import 'screens/explore_screen.dart';
import 'screens/home_screen.dart';
import 'screens/history_screen.dart';
import 'screens/money_screen.dart';
import 'screens/saved_screen.dart';
import 'theme/app_colors.dart';

void main() => runApp(const MziziApp());

class MziziApp extends StatelessWidget {
  const MziziApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Mzizi Africa',
    debugShowCheckedModeBanner: false,
    theme: ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: page,
      colorScheme: ColorScheme.fromSeed(seedColor: forest, surface: page),
      fontFamily: 'Roboto',
      textTheme: const TextTheme(
        bodyMedium: TextStyle(color: ink),
        bodySmall: TextStyle(color: muted),
      ),
    ),
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
    final onNavigate = (int tab) => setState(() => selectedTab = tab);
    return IndexedStack(
      index: selectedTab,
      children: [
        HomeScreen(onNavigate: onNavigate),
        ExploreScreen(onNavigate: onNavigate),
        MoneyScreen(onNavigate: onNavigate),
        HistoryScreen(onNavigate: onNavigate),
        SavedScreen(onNavigate: onNavigate),
      ],
    );
  }
}
