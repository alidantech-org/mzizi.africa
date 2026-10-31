import 'dart:convert';
import 'dart:async';

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

    test('parses sourced historical names and identity relationships', () {
      final entity = GeographyEntity.fromJson({
        'id': 'geo-stable',
        'name': 'Current name',
        'historical_names': [
          {
            'name': 'Former name',
            'valid_from': '1900-01-01',
            'valid_to': '1963-12-11',
          },
        ],
        'historical_relationships': [
          {
            'related_entity_id': 'geo-successor',
            'relation_type': 'continued_as',
            'valid_from': '1963-12-12',
          },
        ],
      });
      expect(entity.historicalNames.single.name, 'Former name');
      expect(
        entity.historicalRelationships.single.relatedEntityId,
        'geo-successor',
      );
      expect(
        entity.historicalRelationships.single.relationType,
        'continued_as',
      );
    });
  });

  group('county boundary validation', () {
    Map<String, dynamic> feature({
      String? id = 'geo-county-1',
      bool verified = true,
      String? source = 'Survey dataset',
      String? sourceReference = 'https://example.org/source',
      String? license = 'CC BY 4.0',
    }) {
      final properties = <String, Object?>{'boundary_verified': verified};
      if (id != null) {
        properties['geography_id'] = id;
      }
      if (source != null) {
        properties['boundary_source'] = source;
      }
      if (sourceReference != null) {
        properties['boundary_source_reference'] = sourceReference;
      }
      if (license != null) {
        properties['boundary_license'] = license;
      }
      return {
        'type': 'Feature',
        'properties': properties,
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
    }

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
        feature(sourceReference: null),
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

    test(
      'shared validation rejects unverified context and permits empty children',
      () {
        GeographyApiClient.validateVerifiedCollection({
          'type': 'FeatureCollection',
          'features': const [],
        });
        expect(
          () => GeographyApiClient.validateVerifiedCollection({
            'type': 'FeatureCollection',
            'features': [feature(verified: false)],
          }),
          throwsFormatException,
        );
      },
    );
  });

  test('typed governance model parses sections and records', () {
    final data = GeographyGovernance.fromJson({
      'sections': [
        {
          'title': 'Offices',
          'records': [
            {'title': 'Governor', 'summary': 'Sourced record'},
          ],
        },
      ],
    });
    expect(data.sections.single.title, 'Offices');
    expect(data.sections.single.records.single.title, 'Governor');
    expect(data.sections.single.records.single.summary, 'Sourced record');
  });

  test('malformed governance and open polygon rings are rejected', () {
    expect(
      () => GeographyGovernance.fromJson({'sections': 'invalid'}),
      throwsFormatException,
    );
    expect(
      () => GeographyFeature.fromJson({
        'type': 'Feature',
        'properties': {'id': 'geo-1', 'boundary_verified': true},
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
            ],
          ],
        },
      }),
      throwsFormatException,
    );
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
      client.clearCache(entityId: 'geo-1');
      await client.entity('geo-1');
      expect(requests, 2);
    });

    test(
      'a late search response cannot replace a newer query result',
      () async {
        final firstResponse = Completer<http.Response>();
        final client = GeographyApiClient(
          baseUrl: 'https://api.example.org',
          client: MockClient((request) async {
            if (request.url.queryParameters['q'] == 'old') {
              return firstResponse.future;
            }
            return http.Response(
              '{"results":[{"id":"new-id","name":"New result"}]}',
              200,
            );
          }),
        );
        final oldSearch = client.search('old');
        final newResults = await client.search('new');
        firstResponse.complete(
          http.Response(
            '{"results":[{"id":"old-id","name":"Old result"}]}',
            200,
          ),
        );
        final oldResults = await oldSearch;
        expect(newResults.single.id, 'new-id');
        expect(oldResults, isEmpty);
      },
    );

    test('surfaces non-success HTTP responses', () async {
      final client = GeographyApiClient(
        baseUrl: 'https://api.example.org',
        client: MockClient((_) async => http.Response('Not found', 503)),
      );
      await expectLater(client.entity('missing'), throwsException);
    });

    test(
      'keeps verified context and children when selected geometry is absent',
      () async {
        final requests = <String>[];
        final client = GeographyApiClient(
          baseUrl: 'https://api.example.org',
          client: MockClient((request) async {
            requests.add(request.url.path);
            if (request.url.path.endsWith('/entities/selected')) {
              return http.Response(
                '{"id":"selected","name":"Selected","level":"local area","parent_id":"parent","boundary_verified":false}',
                200,
              );
            }
            if (request.url.path.endsWith('/entities/selected/boundary')) {
              return http.Response('unexpected boundary request', 500);
            }
            if (request.url.path.endsWith('/children/boundaries')) {
              return http.Response(
                jsonEncode({
                  'type': 'FeatureCollection',
                  'features': [_verifiedFeature('child')],
                }),
                200,
              );
            }
            if (request.url.path.endsWith('/map-context')) {
              return http.Response(
                jsonEncode({
                  'parent_boundary': _verifiedFeature('parent'),
                  'sibling_boundaries': {
                    'type': 'FeatureCollection',
                    'features': [_verifiedFeature('sibling')],
                  },
                }),
                200,
              );
            }
            if (request.url.path.endsWith('/governance')) {
              return http.Response('Not found', 404);
            }
            return http.Response('Unexpected endpoint', 500);
          }),
        );

        final scene = await client.sceneFor('selected');
        expect(scene.focusFeature, isNull);
        expect(scene.parentBoundary?.properties.geographyId, 'parent');
        expect(
          scene.siblingBoundaries?.features.single.properties.geographyId,
          'sibling',
        );
        expect(
          scene.childBoundaries?.features.single.properties.geographyId,
          'child',
        );
        expect(scene.governance, isNull);
        expect(requests.any((path) => path.endsWith('/boundary')), isFalse);
      },
    );
  });
}

Map<String, Object?> _verifiedFeature(String id) => {
  'type': 'Feature',
  'properties': {
    'geography_id': id,
    'name': id,
    'level': 'area',
    'boundary_verified': true,
    'boundary_source': 'Survey dataset',
    'boundary_source_reference': 'https://example.org/source',
    'boundary_license': 'CC BY 4.0',
  },
  'geometry': {
    'type': 'Polygon',
    'coordinates': [
      [
        [0, 0],
        [2, 0],
        [2, 2],
        [0, 0],
      ],
    ],
  },
};
