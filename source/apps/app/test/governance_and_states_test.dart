// Verifies graph relationships, missing-data parsing, and constrained mobile loading/error layouts.
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/governance/parse/documents.dart';
import 'package:mzizi_app/presentation/governance/parse/comparisons.dart';
import 'package:mzizi_app/presentation/governance/tree_layout.dart';
import 'package:mzizi_app/presentation/widgets/state_views.dart';

void main() {
  test('governance empty responses and nullable category stay explicit', () {
    final doc = GovernanceDocument(
      const InsightsGovernanceTree(
        edges: [],
        gaps: ['No category is available.'],
        legend: [],
        nodes: [],
        rail: [],
        tab: null,
      ),
    );
    expect(doc.nodes, isEmpty);
    expect(doc.category.code, isEmpty);
    expect(doc.gaps.single, contains('No category'));
    final layout = GovernanceLayout(doc.nodes, doc.edges);
    expect(layout.size.isFinite, isTrue);
  });

  test('graph depth comes from edges, while peer nodes never overlap', () {
    final nodes = [
      GovernanceNode.parse({'id': 'root', 'name': 'Root'}),
      GovernanceNode.parse({'id': 'peer-a', 'name': 'Peer A'}),
      GovernanceNode.parse({'id': 'peer-b', 'name': 'Peer B'}),
      GovernanceNode.parse({'id': 'child', 'name': 'Child'}),
    ];
    final layout = GovernanceLayout(nodes, const [
      GovernanceEdge('root', 'peer-a', 'member'),
      GovernanceEdge('root', 'peer-b', 'member'),
      GovernanceEdge('peer-a', 'child', 'reports'),
      GovernanceEdge('missing', 'child', 'member'),
    ]);
    expect(layout.positions['peer-a']!.dy, layout.positions['peer-b']!.dy);
    expect(
      (layout.positions['peer-a']!.dx - layout.positions['peer-b']!.dx).abs(),
      greaterThan(GovernanceLayout.nodeWidth),
    );
    expect(
      layout.positions['root']!.dy,
      lessThan(layout.positions['peer-a']!.dy),
    );
    expect(
      layout.positions['peer-a']!.dy,
      lessThan(layout.positions['child']!.dy),
    );
  });

  test('cycles terminate in a finite bounded layout', () {
    final nodes = [
      GovernanceNode.parse({'id': 'a'}),
      GovernanceNode.parse({'id': 'b'}),
    ];
    final layout = GovernanceLayout(nodes, const [
      GovernanceEdge('a', 'b', 'member'),
      GovernanceEdge('b', 'a', 'member'),
    ]);
    expect(layout.size.isFinite, isTrue);
    expect(layout.size.height, lessThan(1000));
  });

  test(
    'missing performance and unavailable comparison levels are never zero scores',
    () {
      expect(
        GovernanceNode.parse({'id': 'leader', 'performance': null}).performance,
        isNull,
      );
      final level = ComparisonLevel.parse({
        'rung': 'unknown',
        'label': 'Unavailable',
        'available': false,
        'unit': null,
        'message': 'No record.',
      });
      expect(level.unit, isNull);
      expect(level.available, isFalse);
      expect(level.message, 'No record.');
      final row = ComparisonRow.parse({'title': 'Measure', 'a': null, 'b': 0});
      expect(row.a, isNull);
      expect(row.b, 0);
    },
  );

  test('backend score and explanation produce an actual performance bar', () {
    final node = GovernanceNode.parse({
      'id': 'holder',
      'performance': {
        'score': 72.5,
        'basis': 'votes',
        'rank': 2,
        'of': 10,
        'samples': 4,
        'text': 'Attendance in recorded divisions',
      },
    });
    expect(node.performance!.value, 72.5);
    expect(node.performance!.label, 'Attendance in recorded divisions');
    expect(node.performance!.rank, 2);
    expect(node.performance!.total, 10);
  });

  for (final layout in LoadingLayout.values) {
    testWidgets('$layout skeleton fits a small viewport and reduced motion', (
      tester,
    ) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MediaQuery(
            data: const MediaQueryData(disableAnimations: true),
            child: Scaffold(
              body: Center(
                child: SizedBox(
                  width: 280,
                  height: 180,
                  child: LoadingView(layout: layout),
                ),
              ),
            ),
          ),
        ),
      );
      await tester.pump(const Duration(seconds: 2));
      expect(tester.takeException(), isNull);
      expect(find.byType(ShaderMask), findsOneWidget);
      await tester.pumpAndSettle();
    });
  }

  testWidgets('error state fits narrow space and retry remains reachable', (
    tester,
  ) async {
    var retried = false;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SizedBox(
            width: 280,
            height: 220,
            child: ErrorView(
              message: 'Transport failed with a long internal stack trace.',
              retryLabel: 'Try again',
              onRetry: () => retried = true,
            ),
          ),
        ),
      ),
    );
    expect(tester.takeException(), isNull);
    expect(find.textContaining('stack trace'), findsNothing);
    await tester.ensureVisible(find.text('Try again'));
    await tester.tap(find.text('Try again'));
    expect(retried, isTrue);
  });
}
