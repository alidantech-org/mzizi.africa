import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';

void main() {
  testWidgets('tiles in a row are the same height, missing figures included', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: TileGrid(
              children: const [
                StatTile(
                  label: 'People',
                  value: '570K',
                  info: 'Counted by the census.',
                ),
                StatTile(label: 'People per km²', value: '—'),
                StatTile(label: 'Area', value: '—'),
                StatTile(label: 'Size rank', value: '#1', hint: 'of 1 alike'),
              ],
            ),
          ),
        ),
      ),
    );
    final tiles = find.byType(StatTile);
    expect(tiles, findsNWidgets(4));
    final heights = [
      for (var i = 0; i < 4; i++) tester.getSize(tiles.at(i)).height,
    ];
    expect(heights[0], heights[1]);
    expect(heights[2], heights[3]);
    expect(heights[0], heights[2]);
    expect(find.text('Not recorded'), findsNWidgets(2));
  });

  testWidgets('tapping a tile with an explanation opens the sheet', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: TileGrid(
            children: const [
              StatTile(
                label: 'People',
                value: '570K',
                info: 'Counted by the census.',
              ),
            ],
          ),
        ),
      ),
    );
    await tester.tap(find.byType(StatTile));
    await tester.pumpAndSettle();
    expect(find.text('Counted by the census.'), findsOneWidget);
  });
}
