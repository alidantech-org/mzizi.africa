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
  });
}
