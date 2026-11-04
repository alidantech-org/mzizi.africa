import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mzizi_mobile/data/sample_data_store.dart';
import 'package:mzizi_mobile/screens/sample_data_screen.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('all new domain samples use the fictional data envelope', () async {
    const store = SampleDataStore();
    for (final topic in const [
      SampleTopic.governance,
      SampleTopic.political,
      SampleTopic.legal,
      SampleTopic.procurement,
      SampleTopic.services,
    ]) {
      final document = await store.load(topic);
      expect(document.kind, isNotEmpty);
      expect(document.data, isNotEmpty);
      expect(document.data['evidence'], isA<Map<String, dynamic>>());
    }
  });

  testWidgets('new schema domains have a visible title and demo warning', (
    tester,
  ) async {
    for (final (topic, heading) in const [
      (SampleTopic.governance, 'Example Regional Assembly'),
      (SampleTopic.political, 'Sample Civic Party'),
      (SampleTopic.legal, 'Sample Public Administration Act'),
      (SampleTopic.procurement, 'Example Community Bridge Project'),
      (SampleTopic.services, 'Sample Community Registration'),
    ]) {
      await tester.pumpWidget(
        MaterialApp(
          key: ValueKey(topic),
          home: SampleDataScreen(initialTopic: topic),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.text('DEMO ONLY · FICTIONAL DATA'), findsOneWidget);
      expect(find.text(heading), findsOneWidget);
      expect(tester.takeException(), isNull);
    }
  });
}
