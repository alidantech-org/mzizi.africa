// Regression coverage for percentage-point display, zero baselines and safe gallery entry.
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/home/comparison_delta.dart';
import 'package:mzizi_app/presentation/widgets/media_gallery.dart';

void main() {
  testWidgets(
    'relative difference is formatted once and zero baselines are explicit',
    (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SingleChildScrollView(
              child: Builder(
                builder: (context) => Column(
                  children: [
                    Text(comparisonDelta(context, 495.2, 100, 'B')),
                    Text(comparisonDelta(context, 0, 0, 'B')),
                    Text(comparisonDelta(context, 2, 0, 'B')),
                    Text(comparisonDelta(context, null, 0, 'B')),
                  ],
                ),
              ),
            ),
          ),
        ),
      );
      expect(find.text('395% above B'), findsOneWidget);
      expect(find.textContaining('39520'), findsNothing);
      expect(
        find.text(
          'Both places record zero. Relative percentage change is undefined.',
        ),
        findsOneWidget,
      );
      expect(
        find.text(
          'The comparison place records zero. Relative percentage change is undefined.',
        ),
        findsOneWidget,
      );
      expect(find.text('Not enough data to compare'), findsOneWidget);
    },
  );

  testWidgets('gallery empty input is safe', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: GalleryPage(items: [], start: 99)),
    );
    expect(find.text('No images are recorded yet.'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets(
    'gallery clamps invalid starting index and labels an uncaptioned picture',
    (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: GalleryPage(items: [(url: '', caption: null)], start: 99),
        ),
      );
      expect(find.text('1/1'), findsOneWidget);
      expect(find.byType(InteractiveViewer), findsOneWidget);
      expect(tester.takeException(), isNull);
    },
  );
}
