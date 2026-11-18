// Regression: a real tree node sheet opens a leader over the shell, including repeated destinations.
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/governance/graph_selection.dart';
import 'package:mzizi_app/presentation/governance/node_sheet.dart';
import 'package:mzizi_app/presentation/governance/parse/documents.dart';
import 'package:mzizi_app/presentation/governance/tree_canvas.dart';
import 'package:mzizi_app/presentation/routers/framing.dart';
import 'package:mzizi_app/presentation/shell/app_shell.dart';

GovernanceDocument fixture() => GovernanceDocument(
  const InsightsGovernanceTree(
    nodes: [
      {
        'id': 'country-root',
        'type': 'root',
        'name': 'Country',
        'level': 'country',
      },
      {
        'id': 'holder-a',
        'type': 'leader',
        'name': 'Test leader',
        'holderId': 'leader-a',
        'tier': {'label': 'Office'},
        'level': 'county',
      },
      {
        'id': 'holder-b',
        'type': 'leader',
        'name': 'Test deputy',
        'holderId': 'leader-b',
        'level': 'county',
      },
      {
        'id': 'holder-c',
        'type': 'leader',
        'name': 'Other level',
        'holderId': 'leader-c',
        'level': 'ward',
      },
    ],
    edges: [
      {'from': 'country-root', 'to': 'holder-a', 'kind': 'member'},
      {'from': 'holder-a', 'to': 'holder-b', 'kind': 'reports'},
      {'from': 'holder-a', 'to': 'holder-c', 'kind': 'member'},
    ],
    gaps: [],
    legend: [],
    rail: [],
    tab: null,
  ),
);

void main() {
  test(
    'level filtering removes other levels without inventing connecting relationships',
    () {
      final selected = GovernanceSelection(fixture(), 'county');
      expect(selected.nodes.map((n) => n.id), ['holder-a', 'holder-b']);
      expect(selected.edges.length, 1);
      expect(selected.edges.single.from, 'holder-a');
      expect(selected.edges.single.to, 'holder-b');
      expect(selected.hiddenRelationships, 2);
      expect(GovernanceSelection(fixture(), 'missing').nodes, isEmpty);
      expect(GovernanceSelection(fixture(), null).edges.length, 3);
    },
  );

  test(
    'default scope chooses a populated level and honours selected place when available',
    () {
      final defaultDocument = fixture();
      expect(preferredGovernanceLevel(defaultDocument), 'county');
      final selectedPlace = GovernanceDocument(
        const InsightsGovernanceTree(
          nodes: [
            {'id': 'country', 'holderId': 'a', 'level': 'country'},
            {'id': 'ward', 'holderId': 'b', 'level': 'ward'},
          ],
          edges: [],
          gaps: [],
          legend: [],
          rail: [],
          tab: null,
          place: InsightsPlaceCrumb(
            featureId: 'ward',
            kindCode: 'ref.val.geo.feature.kind.ward',
            kindLabel: 'Ward',
            name: 'Place',
          ),
        ),
      );
      expect(preferredGovernanceLevel(selectedPlace), 'ward');
    },
  );

  testWidgets(
    'tree sheet View leader, repeated push and return keep unique page keys',
    (tester) async {
      final selected = GovernanceSelection(fixture(), 'county');
      final router = GoRouter(
        initialLocation: '/explore',
        routes: [
          ShellRoute(
            builder: (context, state, child) => AppShell(
              location: state.uri.path,
              pageOwnsScaffold: state.topRoute is SelfFramedGoRoute,
              child: child,
            ),
            routes: [
              SelfFramedGoRoute(
                path: '/leaders-tree',
                builder: (context, state) => Scaffold(
                  appBar: AppBar(title: const Text('Leadership tree')),
                  body: GovernanceCanvas(
                    selection: selected,
                    selectionKey: 'county',
                    onNode: (node) => showGovernanceNode(context, node),
                  ),
                ),
              ),

              GoRoute(
                path: '/explore',
                pageBuilder: (context, state) => fadePage(
                  key: state.pageKey,
                  child: Builder(
                    builder: (context) => Center(
                      child: FilledButton(
                        onPressed: () => context.push('/leaders-tree'),
                        child: const Text('Open tree'),
                      ),
                    ),
                  ),
                ),
              ),
              GoRoute(
                path: '/leader/:id',
                pageBuilder: (context, state) => fadePage(
                  key: state.pageKey,
                  child: Builder(
                    builder: (context) => Column(
                      children: [
                        Text('Leader ${state.pathParameters['id']}'),
                        FilledButton(
                          onPressed: () => context.push('/leader/leader-a'),
                          child: const Text('Push same leader'),
                        ),
                        FilledButton(
                          onPressed: () => context.pop(),
                          child: const Text('Back'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      );
      await tester.pumpWidget(MaterialApp.router(routerConfig: router));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Open tree'));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('tree-reset')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('tree-node-holder-a')));
      await tester.pumpAndSettle();
      expect(find.text('View leader'), findsOneWidget);
      await tester.tap(find.text('View leader'));
      await tester.pumpAndSettle();
      expect(find.text('Leader leader-a'), findsOneWidget);
      expect(tester.takeException(), isNull);
      await tester.tap(find.text('Push same leader'));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
      for (final navigator in tester.widgetList<Navigator>(
        find.byType(Navigator),
      )) {
        final keys = navigator.pages.map((page) => page.key).toList();
        expect(keys.whereType<LocalKey>().length, keys.length);
        expect(keys.toSet().length, keys.length);
      }
      await tester.tap(find.text('Back').last);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Back'));
      await tester.pumpAndSettle();
      expect(find.text('Leadership tree'), findsOneWidget);
      await tester.tap(find.byKey(const ValueKey('tree-node-holder-a')));
      await tester.pumpAndSettle();
      await tester.tap(find.text('View leader'));
      await tester.pumpAndSettle();
      expect(find.text('Leader leader-a'), findsOneWidget);
      expect(tester.takeException(), isNull);
      await tester.pumpWidget(const SizedBox.shrink());
      router.dispose();
    },
  );

  testWidgets('graph zoom buttons are bounded and fit resets a changed view', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: GovernanceCanvas(
            selection: GovernanceSelection(fixture(), 'county'),
            selectionKey: 'county',
            onNode: (_) {},
          ),
        ),
      ),
    );
    final viewer = tester.widget<InteractiveViewer>(
      find.byType(InteractiveViewer),
    );
    final controller = viewer.transformationController!;
    final initialScale = controller.value.getMaxScaleOnAxis();
    await tester.tap(find.byKey(const ValueKey('tree-zoom-in')));
    expect(controller.value.getMaxScaleOnAxis(), greaterThan(initialScale));
    for (var i = 0; i < 30; i++) {
      await tester.tap(find.byKey(const ValueKey('tree-zoom-in')));
    }
    expect(
      controller.value.getMaxScaleOnAxis(),
      lessThanOrEqualTo(viewer.maxScale),
    );
    for (var i = 0; i < 60; i++) {
      await tester.tap(find.byKey(const ValueKey('tree-zoom-out')));
    }
    expect(
      controller.value.getMaxScaleOnAxis(),
      greaterThanOrEqualTo(viewer.minScale),
    );
    await tester.tap(find.byKey(const ValueKey('tree-fit')));
    expect(controller.value.getMaxScaleOnAxis(), initialScale);
    expect(tester.takeException(), isNull);
  });
}
