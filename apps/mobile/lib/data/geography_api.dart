import 'dart:convert';

import 'package:http/http.dart' as http;

/// A stable, backend-owned administrative geography record.
///
/// `id` is the canonical Mzizi geography ID. Display names are never used as
/// identifiers, and administrative levels are supplied by the country model.
class GeographyEntity {
  const GeographyEntity({
    required this.id,
    required this.name,
    required this.displayName,
    required this.level,
    this.parentId,
    this.parentName,
    this.ancestors = const [],
    this.boundaryVerified = false,
    this.boundarySource,
    this.boundaryLicense,
    this.boundaryYear,
  });

  final String id;
  final String name;
  final String displayName;
  final String level;
  final String? parentId;
  final String? parentName;
  final List<GeographyEntity> ancestors;
  final bool boundaryVerified;
  final String? boundarySource;
  final String? boundaryLicense;
  final String? boundaryYear;

  factory GeographyEntity.fromJson(Map<String, dynamic> json) {
    final id = (json['id'] ?? json['geography_id'] ?? '').toString().trim();
    if (id.isEmpty) {
      throw const FormatException('Geography records must have a stable id.');
    }
    final name = (json['name'] ?? json['display_name'] ?? id).toString();
    final parent = json['parent'];
    final ancestorsJson = json['ancestors'];
    return GeographyEntity(
      id: id,
      name: name,
      displayName: (json['display_name'] ?? name).toString(),
      level: (json['level_name'] ?? json['level'] ?? '').toString(),
      parentId:
          json['parent_id']?.toString() ??
          (parent is Map<String, dynamic> ? parent['id']?.toString() : null),
      parentName:
          json['parent_name']?.toString() ??
          (parent is Map<String, dynamic> ? parent['name']?.toString() : null),
      ancestors: ancestorsJson is List
          ? ancestorsJson
                .whereType<Map<String, dynamic>>()
                .map(GeographyEntity.fromJson)
                .toList()
          : const [],
      boundaryVerified: json['boundary_verified'] == true,
      boundarySource: json['boundary_source']?.toString(),
      boundaryLicense: json['boundary_license']?.toString(),
      boundaryYear: json['boundary_year']?.toString(),
    );
  }
}

class GeographyScene {
  const GeographyScene({
    required this.entity,
    required this.focusFeature,
    required this.parentBoundary,
    required this.siblingBoundaries,
    required this.childBoundaries,
    this.governance,
  });

  final GeographyEntity entity;
  final Map<String, dynamic>? focusFeature;
  final Map<String, dynamic>? parentBoundary;
  final Map<String, dynamic>? siblingBoundaries;
  final Map<String, dynamic>? childBoundaries;
  final Map<String, dynamic>? governance;

  bool get hasVerifiedGeometry => focusFeature != null;
}

/// Thin client for the canonical Mzizi geography and governance API.
///
/// Configure the host with `--dart-define=MZIZI_API_BASE_URL=https://...`.
/// No third-party geocoder or boundary API is used by the mobile client.
class GeographyApiClient {
  GeographyApiClient._();

  static final instance = GeographyApiClient._();
  static const _configuredBaseUrl = String.fromEnvironment(
    'MZIZI_API_BASE_URL',
  );

  final http.Client _client = http.Client();
  int _searchSequence = 0;

  bool get isConfigured => _configuredBaseUrl.trim().isNotEmpty;

  Uri _uri(String path, [Map<String, String>? query]) {
    if (!isConfigured) {
      throw StateError(
        'Set MZIZI_API_BASE_URL to connect the map to Mzizi geography data.',
      );
    }
    final base = Uri.parse(_configuredBaseUrl.trim());
    return base.resolve(path).replace(queryParameters: query);
  }

  Future<List<GeographyEntity>> search(String query) async {
    final term = query.trim();
    if (term.isEmpty) return const [];
    final sequence = ++_searchSequence;
    final response = await _getJson(
      _uri('/v1/geography/search', {'q': term, 'country': 'KE', 'limit': '12'}),
    );
    if (sequence != _searchSequence) return const [];
    return _entitiesFromResults(response);
  }

  /// Returns verified Kenyan county outlines for the initial map view.
  ///
  /// The API must filter out records without a validated boundary and include
  /// canonical IDs plus source/license metadata on every feature.
  Future<Map<String, dynamic>> kenyanCountyBoundaries() async {
    final collection = await _getJson(
      _uri('/v1/geography/boundaries', {'country': 'KE', 'level': 'county'}),
    );
    if (collection['type'] != 'FeatureCollection' ||
        collection['features'] is! List) {
      throw const FormatException(
        'Kenyan county boundaries response must be a GeoJSON FeatureCollection.',
      );
    }
    final features = collection['features'] as List;
    if (features.isEmpty) {
      throw const FormatException(
        'No verified Kenyan county boundaries are available.',
      );
    }
    for (final item in features) {
      if (item is! Map<String, dynamic> || !_isSelectableFeature(item)) {
        throw const FormatException(
          'Kenyan county boundary collection contains an invalid feature.',
        );
      }
      final properties = item['properties'] as Map;
      final hasProvenance =
          properties['boundary_source']?.toString().trim().isNotEmpty == true &&
          properties['boundary_license']?.toString().trim().isNotEmpty == true;
      if (properties['boundary_verified'] != true || !hasProvenance) {
        throw const FormatException(
          'Kenyan boundaries must be verified and include source and license metadata.',
        );
      }
    }
    return collection;
  }

  List<GeographyEntity> _entitiesFromResults(Map<String, dynamic> response) {
    final results = response['results'];
    if (results is! List) {
      throw const FormatException('Search response must contain results[].');
    }
    return results
        .whereType<Map<String, dynamic>>()
        .map(GeographyEntity.fromJson)
        .toList();
  }

  Future<GeographyEntity> entity(String id) async => GeographyEntity.fromJson(
    await _getJson(_uri('/v1/geography/entities/${Uri.encodeComponent(id)}')),
  );

  Future<GeographyScene> sceneFor(String id) async {
    final encodedId = Uri.encodeComponent(id);
    final entity = GeographyEntity.fromJson(
      await _getJson(_uri('/v1/geography/entities/$encodedId')),
    );
    final focusRequest = entity.boundaryVerified
        ? _getJson(_uri('/v1/geography/entities/$encodedId/boundary'))
        : Future<Map<String, dynamic>>.value(const {});
    final contextRequest = entity.boundaryVerified
        ? _getJson(
            _uri('/v1/geography/entities/$encodedId/map-context'),
            allowNotFound: true,
          )
        : Future<Map<String, dynamic>>.value(const {});
    final childRequest = entity.boundaryVerified
        ? _getJson(
            _uri('/v1/geography/entities/$encodedId/children/boundaries'),
          )
        : Future<Map<String, dynamic>>.value(const {});
    final values = await Future.wait([
      focusRequest,
      childRequest,
      _getJson(
        _uri('/v1/geography/entities/$encodedId/governance'),
        allowNotFound: true,
      ),
      contextRequest,
    ]);
    final focus = entity.boundaryVerified ? _asFeature(values[0]) : null;
    final children = focus == null ? null : _asFeatureCollection(values[1]);
    final context = values[3];
    final parent = context['parent_boundary'];
    final siblings = context['sibling_boundaries'];
    return GeographyScene(
      entity: entity,
      focusFeature: focus,
      parentBoundary: focus != null && parent is Map<String, dynamic>
          ? _asFeature(parent)
          : null,
      siblingBoundaries: focus != null && siblings is Map<String, dynamic>
          ? _asFeatureCollection(siblings)
          : null,
      childBoundaries: children,
      governance: values[2].isEmpty ? null : values[2],
    );
  }

  Future<Map<String, dynamic>> _getJson(
    Uri uri, {
    Map<String, String>? headers,
    bool allowNotFound = false,
  }) async {
    final response = await _client
        .get(uri, headers: {'Accept': 'application/json', ...?headers})
        .timeout(const Duration(seconds: 20));
    if (allowNotFound && response.statusCode == 404) return const {};
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Mzizi API returned HTTP ${response.statusCode}.');
    }
    final decoded = jsonDecode(response.body);
    if (decoded is! Map<String, dynamic>) {
      throw const FormatException('Expected an API JSON object.');
    }
    return decoded;
  }

  Map<String, dynamic>? _asFeature(Map<String, dynamic> value) {
    if (_isSelectableFeature(value)) return value;
    if (value['type'] == 'FeatureCollection' && value['features'] is List) {
      final features = value['features'] as List;
      Map<String, dynamic>? matched;
      for (final feature in features.whereType<Map<String, dynamic>>()) {
        final properties = feature['properties'];
        if (properties is Map &&
            (properties['selected'] == true ||
                properties['is_selected'] == true)) {
          matched = feature;
          break;
        }
      }
      if (matched != null && _isSelectableFeature(matched)) return matched;
      if (features.length == 1 && features.first is Map<String, dynamic>) {
        final feature = features.first as Map<String, dynamic>;
        return _isSelectableFeature(feature) ? feature : null;
      }
    }
    return null;
  }

  Map<String, dynamic>? _asFeatureCollection(Map<String, dynamic> value) {
    if (value['type'] == 'FeatureCollection' && value['features'] is List) {
      for (final item in value['features'] as List) {
        if (item is! Map<String, dynamic> || !_isSelectableFeature(item)) {
          throw const FormatException(
            'Boundary collection has invalid geometry.',
          );
        }
      }
      return value;
    }
    return null;
  }

  bool _isFeature(Map<String, dynamic> feature) =>
      feature['type'] == 'Feature' &&
      feature['geometry'] is Map<String, dynamic> &&
      (feature['geometry'] as Map<String, dynamic>)['type'] is String &&
      (feature['geometry'] as Map<String, dynamic>)['coordinates'] is List;

  bool _isSelectableFeature(Map<String, dynamic> feature) {
    if (!_isFeature(feature)) return false;
    final properties = feature['properties'];
    return properties is Map &&
        (properties.containsKey('geography_id') ||
            properties.containsKey('geo_id') ||
            properties.containsKey('id'));
  }
}
