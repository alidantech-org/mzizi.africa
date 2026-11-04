import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mzizi_mobile/data/geography_api.dart';
import 'package:mzizi_mobile/widgets/county_choropleth_map.dart';

void main() {
  testWidgets('Explore preview shows a usable network error in 230 pixels', (
    tester,
  ) async {
    final client = GeographyApiClient(
      baseUrl: 'https://example.invalid',
      client: MockClient((request) async {
        expect(request.url.path, '/v1/geography/boundaries');
        return http.Response('Service unavailable', 503);
      }),
    );
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SizedBox(
            height: 230,
            child: CountyChoroplethMap(
              apiClient: client,
              onPlaceSelected: (_) {},
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Could not load county boundaries'), findsOneWidget);
    expect(find.text('Retry'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Explore preview explains empty verified geography layer', (
    tester,
  ) async {
    final client = GeographyApiClient(
      baseUrl: 'https://example.invalid',
      client: MockClient((request) async {
        return http.Response(
          '{"type":"FeatureCollection","features":[]}',
          200,
          headers: {'content-type': 'application/json'},
        );
      }),
    );
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SizedBox(
            height: 230,
            child: CountyChoroplethMap(
              apiClient: client,
              onPlaceSelected: (_) {},
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('No verified county boundaries available'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
