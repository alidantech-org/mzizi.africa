import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mzizi_mobile/data/geography_api.dart';

void main() {
  group('GeographyEntity', () {
    test(
      'reads canonical ID, country-specific level, parent and provenance',
      () {
        final entity = GeographyEntity.fromJson({
          'id': 'geo-47-032',
          'name': 'Nakuru',
          'level': 'County',
          'parent_id': 'country-ke',
          'parent_name': 'Kenya',
          'boundary_verified': true,
          'boundary_source': 'Verified boundary source',
          'boundary_license': 'CC BY 4.0',
          'boundary_year': '2024',
        });

        expect(entity.id, 'geo-47-032');
        expect(entity.name, 'Nakuru');
        expect(entity.level, 'County');
        expect(entity.parentId, 'country-ke');
        expect(entity.boundaryVerified, isTrue);
        expect(entity.boundarySource, 'Verified boundary source');
        expect(entity.boundaryLicense, 'CC BY 4.0');
        expect(entity.boundaryYear, '2024');
      },
    );

    test('does not invent a stable ID from a display name', () {
      expect(
        () => GeographyEntity.fromJson({'name': 'Nakuru'}),
        throwsFormatException,
      );
    });

    test('supports backend-specific levels without assuming a hierarchy', () {
      final entity = GeographyEntity.fromJson({
        'geography_id': 'geo-abc',
        'display_name': 'Municipality',
        'level_name': 'Local government area',
      });

      expect(entity.id, 'geo-abc');
      expect(entity.level, 'Local government area');
      expect(entity.parentId, isNull);
      expect(entity.ancestors, isEmpty);
      expect(entity.boundaryVerified, isFalse);
    });

    test('retains historical boundary metadata when supplied', () {
      final entity = GeographyEntity.fromJson({
        'id': 'geo-historic',
        'name': 'Old district',
        'boundary_retrieved_at': '2025-01-14T10:00:00Z',
        'valid_from': '1963-12-12',
        'valid_to': '1992-01-01',
        'dataset_version': 'v3',
      });
      expect(entity.boundaryRetrievedAt, '2025-01-14T10:00:00Z');
      expect(entity.validFrom, '1963-12-12');
      expect(entity.validTo, '1992-01-01');
      expect(entity.datasetVersion, 'v3');
    });
  });

  group('county boundary validation', () {
    Map<String, dynamic> feature({
      String? id = 'geo-county-1',
      bool verified = true,
      String? source = 'Survey dataset',
      String? license = 'CC BY 4.0',
    }) => {
      'type': 'Feature',
      'properties': {
        if (id != null) 'geography_id': id,
        'boundary_verified': verified,
        if (source != null) 'boundary_source': source,
        if (license != null) 'boundary_license': license,
      },
      'geometry': {
        'type': 'MultiPolygon',
        // Two polygons, each with an outer ring and an interior hole.
        'coordinates': [
          [
            [
              [0, 0],
              [4, 0],
              [4, 4],
              [0, 4],
              [0, 0],
            ],
            [
              [1, 1],
              [2, 1],
              [2, 2],
              [1, 2],
              [1, 1],
            ],
          ],
          [
            [
              [8, 8],
              [9, 8],
              [9, 9],
              [8, 9],
              [8, 8],
            ],
          ],
        ],
      },
    };

    test(
      'accepts verified MultiPolygon geometry and permits an empty layer',
      () {
        GeographyApiClient.validateCountyCollection({
          'type': 'FeatureCollection',
          'features': [feature()],
        });
        GeographyApiClient.validateCountyCollection({
          'type': 'FeatureCollection',
          'features': const [],
        });
      },
    );

    test(
      'rejects the whole collection when any feature lacks a canonical ID',
      () {
        expect(
          () => GeographyApiClient.validateCountyCollection({
            'type': 'FeatureCollection',
            'features': [feature(), feature(id: null)],
          }),
          throwsFormatException,
        );
      },
    );

    test('rejects unverified features and missing attribution metadata', () {
      for (final badFeature in [
        feature(verified: false),
        feature(source: null),
        feature(license: null),
      ]) {
        expect(
          () => GeographyApiClient.validateCountyCollection({
            'type': 'FeatureCollection',
            'features': [badFeature],
          }),
          throwsFormatException,
        );
      }
    });
  });

  group('GeographyApiClient', () {
    test(
      'search sends the contract query and parses canonical entities',
      () async {
        final client = GeographyApiClient(
          baseUrl: 'https://api.example.org',
          client: MockClient((request) async {
            expect(request.url.path, '/v1/geography/search');
            expect(request.url.queryParameters, {
              'q': 'Nakuru',
              'country': 'KE',
              'limit': '12',
            });
            return http.Response(
              '{"results":[{"geography_id":"geo-32","display_name":"Nakuru","level_name":"County"}]}',
              200,
            );
          }),
        );

        final results = await client.search(' Nakuru ');
        expect(results, hasLength(1));
        expect(results.single.id, 'geo-32');
        expect(results.single.name, 'Nakuru');
        expect(results.single.level, 'County');
      },
    );

    test('entity metadata is cached by canonical ID', () async {
      var requests = 0;
      final client = GeographyApiClient(
        baseUrl: 'https://api.example.org',
        client: MockClient((request) async {
          requests++;
          return http.Response(
            '{"id":"geo-1","name":"Nairobi","level":"County"}',
            200,
          );
        }),
      );
      await client.entity('geo-1');
      await client.entity('geo-1');
      expect(requests, 1);
    });

    test('surfaces non-success HTTP responses', () async {
      final client = GeographyApiClient(
        baseUrl: 'https://api.example.org',
        client: MockClient((_) async => http.Response('Not found', 503)),
      );
      await expectLater(client.entity('missing'), throwsException);
    });
  });
}
