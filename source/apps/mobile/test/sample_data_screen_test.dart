import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mzizi_mobile/data/sample_data_store.dart';
import 'package:mzizi_mobile/screens/sample_data_screen.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('bundled data is present and explicitly marked as a sample', () async {
    const store = SampleDataStore();
    for (final topic in SampleTopic.values) {
      final document = await store.load(topic);
      expect(document.kind, isNotEmpty);
      expect(document.data, isNotEmpty);
    }
  });

  testWidgets('sample data screen displays fictional warning and statistic', (
    tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: SampleDataScreen(initialTopic: SampleTopic.statistics),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('DEMO ONLY · FICTIONAL DATA'), findsOneWidget);
    expect(find.text('Synthetic indicator A'), findsOneWidget);
    expect(find.textContaining('No recorded value'), findsOneWidget);
  });
}
