import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/shell/app_shell.dart';
import 'package:mzizi_app/presentation/shell/shell_bar.dart';

import 'support/copy.dart';

void main() {
  setUpAll(() => installCopy('en'));
  testWidgets(
    'five tabs, the centre one is the unlabeled trophy and selects the leaderboard',
    (tester) async {
      var picked = -1;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            floatingActionButtonLocation:
                FloatingActionButtonLocation.centerDocked,
            floatingActionButton: TrophyButton(
              selected: false,
              label: 'Rankings',
              onTap: () => picked = 2,
            ),
            bottomNavigationBar: ShellBar(
              selected: 0,
              onSelect: (i) => picked = i,
            ),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));
      expect(shellTabs.length, 5);
      expect(shellTabs[2].path, '/rankings');
      // four text labels; the trophy has none (only a semantics label)
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Explore'), findsOneWidget);
      expect(find.text('Search'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);
      expect(find.text('Rankings'), findsNothing);
      expect(find.bySemanticsLabel('Rankings'), findsWidgets);
      expect(find.byType(BottomAppBar), findsOneWidget);
      final before = tester.getCenter(find.byType(TrophyButton));
      await tester.pump(const Duration(seconds: 5));
      expect(tester.getCenter(find.byType(TrophyButton)), before);
      await tester.tap(find.byType(TrophyButton));
      expect(picked, 2);
      await tester.tap(find.text('Profile'));
      expect(picked, 4);
    },
  );

  test('a pushed screen keeps the tab it was opened from lit', () {
    expect(tabFor('/'), 0);
    expect(tabFor('/stats/abc'), 1);
    expect(tabFor('/elections'), 1);
    expect(tabFor('/rankings'), 2);
    expect(tabFor('/search'), 3);
    expect(tabFor('/profile'), 4);
    expect(tabFor('/saved'), 4);
    expect(tabFor('/place-profile'), 0);
  });
}
