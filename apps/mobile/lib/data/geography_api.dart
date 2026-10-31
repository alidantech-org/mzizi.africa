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
    this.boundaryRetrievedAt,
    this.validFrom,
    this.validTo,
    this.datasetVersion,
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
  final String? boundaryRetrievedAt;
  final String? validFrom;
  final String? validTo;
  final String? datasetVersion;

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
      boundaryRetrievedAt:
          json['boundary_retrieved_at']?.toString() ??
          json['retrieved_at']?.toString(),
      validFrom: json['valid_from']?.toString(),
      validTo: json['valid_to']?.toString(),
      datasetVersion: json['dataset_version']?.toString(),
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
  GeographyApiClient({http.Client? client, String? baseUrl})
    : _client = client ?? http.Client(),
      _baseUrl = baseUrl ?? _configuredBaseUrl;

  static const _configuredBaseUrl = String.fromEnvironment(
    'MZIZI_API_BASE_URL',
  );
  static final instance = GeographyApiClient();

  final http.Client _client;
  final String _baseUrl;
  int _searchSequence = 0;
  final Map<String, GeographyEntity> _entityCache = {};
  final Map<String, GeographyScene> _sceneCache = {};
  Future<String?> Function()? tokenProvider;

  bool get isConfigured => _baseUrl.trim().isNotEmpty;

  Uri _uri(String path, [Map<String, String>? query]) {
    if (!isConfigured) {
      throw StateError(
        'Set MZIZI_API_BASE_URL to connect the map to Mzizi geography data.',
      );
    }
    final base = Uri.parse(_baseUrl.trim());
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
    validateCountyCollection(collection);
    return collection;
  }

  /// Validates the entire default county layer before Cesium receives it.
  static void validateCountyCollection(Map<String, dynamic> collection) {
    final features = collection['features'];
    if (collection['type'] != 'FeatureCollection' || features is! List) {
      throw const FormatException('Expected a GeoJSON FeatureCollection.');
    }
    for (final item in features) {
      if (item is! Map<String, dynamic> || !_isSelectableFeature(item)) {
        throw const FormatException(
          'County collection contains a feature without valid geometry or a canonical ID.',
        );
      }
      final properties = item['properties'] as Map;
      final hasProvenance =
          _nonEmpty(properties['boundary_source']) &&
          _nonEmpty(properties['boundary_license']);
      if (properties['boundary_verified'] != true || !hasProvenance) {
        throw const FormatException(
          'County features must be verified and include source and license metadata.',
        );
      }
    }
  }

  static bool _nonEmpty(Object? value) =>
      value?.toString().trim().isNotEmpty == true;

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

  Future<GeographyEntity> entity(String id) async {
    final cached = _entityCache[id];
    if (cached != null) return cached;
    final entity = GeographyEntity.fromJson(
      await _getJson(_uri('/v1/geography/entities/${Uri.encodeComponent(id)}')),
    );
    _entityCache[id] = entity;
    return entity;
  }

  Future<GeographyScene> sceneFor(String id) async {
    final cached = _sceneCache[id];
    if (cached != null) return cached;
    final encodedId = Uri.encodeComponent(id);
    final entity = await this.entity(id);
    final focusRequest = entity.boundaryVerified
        ? _getJson(_uri('/v1/geography/entities/$encodedId/boundary'))
        : Future<Map<String, dynamic>>.value(const {});
    final contextRequest = entity.boundaryVerified
        ? _getJson(
            _uri('/v1/geography/entities/$encodedId/map-context'),
            allowNotFound: true,
          )
        : Future<Map<String, dynamic>>.value(const {});
    final childRequest = _getJson(
      _uri('/v1/geography/entities/$encodedId/children/boundaries'),
    );
    final values = await Future.wait([
      focusRequest,
      childRequest,
      _getJson(
        _uri('/v1/geography/entities/$encodedId/governance'),
        allowNotFound: true,
      ),
      contextRequest,
    ]);
    final focus = entity.boundaryVerified
        ? _asFeature(values[0], verified: true, expectedId: entity.id)
        : null;
    final children = _asFeatureCollection(values[1], requireVerified: true);
    final context = values[3];
    final parent = context['parent_boundary'];
    final siblings = context['sibling_boundaries'];
    final scene = GeographyScene(
      entity: entity,
      focusFeature: focus,
      parentBoundary: focus != null && parent is Map<String, dynamic>
          ? _asFeature(parent, verified: true, expectedId: entity.parentId)
          : null,
      siblingBoundaries: focus != null && siblings is Map<String, dynamic>
          ? _asFeatureCollection(siblings, requireVerified: true)
          : null,
      childBoundaries: children,
      governance: values[2].isEmpty ? null : values[2],
    );
    _sceneCache[id] = scene;
    return scene;
  }

  void clearCache() {
    _entityCache.clear();
    _sceneCache.clear();
  }

  Future<Map<String, dynamic>> _getJson(
    Uri uri, {
    Map<String, String>? headers,
    bool allowNotFound = false,
  }) async {
    final token = await tokenProvider?.call();
    final response = await _client
        .get(
          uri,
          headers: {
            'Accept': 'application/json',
            if (token != null && token.isNotEmpty)
              'Authorization': 'Bearer $token',
            ...?headers,
          },
        )
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

  Map<String, dynamic>? _asFeature(
    Map<String, dynamic> value, {
    bool verified = false,
    String? expectedId,
  }) {
    if (_isSelectableFeature(value) &&
        (!verified || _isVerified(value)) &&
        _matchesId(value, expectedId)) {
      return value;
    }
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
      if (matched != null &&
          _isSelectableFeature(matched) &&
          (!verified || _isVerified(matched)) &&
          _matchesId(matched, expectedId)) {
        return matched;
      }
      if (features.length == 1 && features.first is Map<String, dynamic>) {
        final feature = features.first as Map<String, dynamic>;
        return _isSelectableFeature(feature) &&
                (!verified || _isVerified(feature)) &&
                _matchesId(feature, expectedId)
            ? feature
            : null;
      }
    }
    return null;
  }

  Map<String, dynamic>? _asFeatureCollection(
    Map<String, dynamic> value, {
    bool requireVerified = false,
  }) {
    if (value['type'] == 'FeatureCollection' && value['features'] is List) {
      for (final item in value['features'] as List) {
        if (item is! Map<String, dynamic> ||
            !_isSelectableFeature(item) ||
            (requireVerified && !_isVerified(item))) {
          throw const FormatException(
            'Boundary collection has invalid geometry.',
          );
        }
      }
      return value;
    }
    return null;
  }

  static bool _isFeature(Map<String, dynamic> feature) =>
      feature['type'] == 'Feature' &&
      feature['geometry'] is Map<String, dynamic> &&
      const {
        'Point',
        'MultiPoint',
        'LineString',
        'MultiLineString',
        'Polygon',
        'MultiPolygon',
      }.contains((feature['geometry'] as Map<String, dynamic>)['type']) &&
      (feature['geometry'] as Map<String, dynamic>)['coordinates'] is List;

  static bool _isSelectableFeature(Map<String, dynamic> feature) {
    if (!_isFeature(feature)) return false;
    final properties = feature['properties'];
    return properties is Map && _featureId(properties) != null;
  }

  static String? _featureId(Map properties) {
    for (final key in const ['geography_id', 'geo_id', 'id']) {
      final id = properties[key]?.toString().trim();
      if (id != null && id.isNotEmpty) return id;
    }
    return null;
  }

  static bool _matchesId(Map<String, dynamic> feature, String? expectedId) {
    if (expectedId == null) return true;
    final properties = feature['properties'];
    return properties is Map && _featureId(properties) == expectedId;
  }

  static bool _isVerified(Map<String, dynamic> feature) {
    final properties = feature['properties'];
    return properties is Map && properties['boundary_verified'] == true;
  }
}
