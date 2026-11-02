import 'dart:convert';

import 'package:http/http.dart' as http;

typedef JsonObject = Map<String, Object?>;

bool _validPosition(Object? value) =>
    value is List &&
    value.length >= 2 &&
    value[0] is num &&
    value[1] is num &&
    (value[0] as num).isFinite &&
    (value[1] as num).isFinite &&
    (value[0] as num) >= -180 &&
    (value[0] as num) <= 180 &&
    (value[1] as num) >= -90 &&
    (value[1] as num) <= 90;

bool _validRing(Object? value) =>
    value is List &&
    value.length >= 4 &&
    value.every(_validPosition) &&
    (value.first as List)[0] == (value.last as List)[0] &&
    (value.first as List)[1] == (value.last as List)[1];

bool _validPolygonCoordinates(Object? value) =>
    value is List && value.isNotEmpty && value.every(_validRing);

bool _validGeoJsonGeometry(JsonObject geometry) {
  final coordinates = geometry['coordinates'];
  switch (geometry['type']) {
    case 'Point':
      return _validPosition(coordinates);
    case 'MultiPoint':
      return coordinates is List &&
          coordinates.isNotEmpty &&
          coordinates.every(_validPosition);
    case 'LineString':
      return coordinates is List &&
          coordinates.length >= 2 &&
          coordinates.every(_validPosition);
    case 'MultiLineString':
      return coordinates is List &&
          coordinates.isNotEmpty &&
          coordinates.every(
            (line) =>
                line is List && line.length >= 2 && line.every(_validPosition),
          );
    case 'Polygon':
      return _validPolygonCoordinates(coordinates);
    case 'MultiPolygon':
      return coordinates is List &&
          coordinates.isNotEmpty &&
          coordinates.every(_validPolygonCoordinates);
    default:
      return false;
  }
}

JsonObject _jsonObject(Object? value, String context) {
  if (value is! Map) {
    throw FormatException('$context must be a JSON object.');
  }
  final result = <String, Object?>{};
  for (final entry in value.entries) {
    if (entry.key is! String) {
      throw FormatException('$context has a non-string key.');
    }
    result[entry.key as String] = _jsonValue(entry.value, context);
  }
  return result;
}

Object? _jsonValue(Object? value, String context) {
  if (value == null || value is String || value is num || value is bool) {
    return value;
  }
  if (value is List) {
    return value.map((item) => _jsonValue(item, context)).toList();
  }
  if (value is Map) return _jsonObject(value, context);
  throw FormatException('$context contains a non-JSON value.');
}

class BoundaryMetadata {
  const BoundaryMetadata({
    this.verified = false,
    this.source,
    this.sourceReference,
    this.license,
    this.referenceYear,
    this.retrievedAt,
    this.validFrom,
    this.validTo,
    this.version,
    this.datasetVersion,
  });

  final bool verified;
  final String? source;
  final String? sourceReference;
  final String? license;
  final String? referenceYear;
  final String? retrievedAt;
  final String? validFrom;
  final String? validTo;
  final String? version;
  final String? datasetVersion;

  factory BoundaryMetadata.fromJson(JsonObject json) => BoundaryMetadata(
    verified: json['boundary_verified'] == true,
    source: json['boundary_source']?.toString(),
    sourceReference: json['boundary_source_reference']?.toString(),
    license: json['boundary_license']?.toString(),
    referenceYear: json['boundary_year']?.toString(),
    retrievedAt: (json['boundary_retrieved_at'] ?? json['retrieved_at'])
        ?.toString(),
    validFrom: json['valid_from']?.toString(),
    validTo: json['valid_to']?.toString(),
    version: json['boundary_version']?.toString(),
    datasetVersion: json['dataset_version']?.toString(),
  );

  JsonObject toJson() => {
    'boundary_verified': verified,
    if (source != null) 'boundary_source': source,
    if (sourceReference != null) 'boundary_source_reference': sourceReference,
    if (license != null) 'boundary_license': license,
    if (referenceYear != null) 'boundary_year': referenceYear,
    if (retrievedAt != null) 'boundary_retrieved_at': retrievedAt,
    if (validFrom != null) 'valid_from': validFrom,
    if (validTo != null) 'valid_to': validTo,
    if (version != null) 'boundary_version': version,
    if (datasetVersion != null) 'dataset_version': datasetVersion,
  };
}

class GeographyFeatureProperties {
  const GeographyFeatureProperties({
    required this.geographyId,
    required this.name,
    required this.displayName,
    required this.level,
    required this.boundary,
    this.labelPoint,
    this.additional = const {},
  });

  final String geographyId;
  final String name;
  final String displayName;
  final String level;
  final BoundaryMetadata boundary;
  final List<num>? labelPoint;
  final JsonObject additional;

  factory GeographyFeatureProperties.fromJson(JsonObject json) {
    final id = (json['geography_id'] ?? json['geo_id'] ?? json['id'])
        ?.toString()
        .trim();
    if (id == null || id.isEmpty) {
      throw const FormatException('Feature has no canonical geography ID.');
    }
    final point = json['label_point'];
    return GeographyFeatureProperties(
      geographyId: id,
      name: (json['name'] ?? json['display_name'] ?? '').toString(),
      displayName: (json['display_name'] ?? json['name'] ?? '').toString(),
      level: (json['level'] ?? json['level_name'] ?? '').toString(),
      boundary: BoundaryMetadata.fromJson(json),
      labelPoint:
          point is List &&
              point.length >= 2 &&
              point[0] is num &&
              point[1] is num &&
              (point[0] as num) >= -180 &&
              (point[0] as num) <= 180 &&
              (point[1] as num) >= -90 &&
              (point[1] as num) <= 90
          ? [point[0] as num, point[1] as num]
          : null,
      additional: Map<String, Object?>.from(json)
        ..remove('geography_id')
        ..remove('geo_id')
        ..remove('id')
        ..remove('name')
        ..remove('display_name')
        ..remove('level')
        ..remove('level_name')
        ..remove('label_point')
        ..removeWhere(
          (key, _) => BoundaryMetadata.fromJson(json).toJson().containsKey(key),
        ),
    );
  }

  JsonObject toJson() => {
    ...additional,
    'geography_id': geographyId,
    'name': name,
    'display_name': displayName,
    'level': level,
    ...boundary.toJson(),
    if (labelPoint != null) 'label_point': labelPoint,
  };
}

class GeographyFeature {
  const GeographyFeature({required this.properties, required this.geometry});
  final GeographyFeatureProperties properties;
  final JsonObject geometry;

  factory GeographyFeature.fromJson(JsonObject json) {
    if (json['type'] != 'Feature') {
      throw const FormatException('Expected a GeoJSON Feature.');
    }
    final properties = GeographyFeatureProperties.fromJson(
      _jsonObject(json['properties'], 'Feature properties'),
    );
    final geometry = _jsonObject(json['geometry'], 'Feature geometry');
    final type = geometry['type'];
    if (!const {
          'Polygon',
          'MultiPolygon',
          'Point',
          'MultiPoint',
          'LineString',
          'MultiLineString',
        }.contains(type) ||
        !_validGeoJsonGeometry(geometry)) {
      throw const FormatException('Feature has invalid GeoJSON geometry.');
    }
    return GeographyFeature(properties: properties, geometry: geometry);
  }

  JsonObject toJson() => {
    'type': 'Feature',
    'properties': properties.toJson(),
    'geometry': geometry,
  };
}

class GeographyFeatureCollection {
  const GeographyFeatureCollection(this.features);
  final List<GeographyFeature> features;

  factory GeographyFeatureCollection.fromJson(JsonObject json) {
    final features = json['features'];
    if (json['type'] != 'FeatureCollection' || features is! List) {
      throw const FormatException('Expected a GeoJSON FeatureCollection.');
    }
    return GeographyFeatureCollection(
      features
          .map(
            (item) => GeographyFeature.fromJson(_jsonObject(item, 'Feature')),
          )
          .toList(),
    );
  }

  JsonObject toJson() => {
    'type': 'FeatureCollection',
    'features': features.map((feature) => feature.toJson()).toList(),
  };
}

class GeographyAncestor {
  const GeographyAncestor({
    required this.id,
    required this.name,
    required this.level,
  });
  final String id;
  final String name;
  final String level;

  factory GeographyAncestor.fromJson(JsonObject json) {
    final id = (json['id'] ?? json['geography_id'] ?? '').toString().trim();
    if (id.isEmpty) {
      throw const FormatException(
        'Geography ancestors require a canonical ID.',
      );
    }
    return GeographyAncestor(
      id: id,
      name: (json['name'] ?? json['display_name'] ?? '').toString(),
      level: (json['level'] ?? json['level_name'] ?? '').toString(),
    );
  }
}

class GeographyHistoricalName {
  const GeographyHistoricalName({
    required this.name,
    this.validFrom,
    this.validTo,
    this.sourceReference,
  });
  final String name;
  final String? validFrom;
  final String? validTo;
  final String? sourceReference;
  factory GeographyHistoricalName.fromJson(JsonObject json) =>
      GeographyHistoricalName(
        name: (json['name'] ?? '').toString(),
        validFrom: json['valid_from']?.toString(),
        validTo: json['valid_to']?.toString(),
        sourceReference: json['source_reference']?.toString(),
      );
}

class GeographyHistoricalRelationship {
  const GeographyHistoricalRelationship({
    required this.relatedEntityId,
    required this.relationType,
    required this.validFrom,
    this.validTo,
    this.sourceReference,
  });
  final String relatedEntityId;
  final String relationType;
  final String validFrom;
  final String? validTo;
  final String? sourceReference;
  factory GeographyHistoricalRelationship.fromJson(JsonObject json) {
    final relatedId = (json['related_entity_id'] ?? '').toString().trim();
    final relation = (json['relation_type'] ?? '').toString();
    final validFrom = (json['valid_from'] ?? '').toString();
    if (relatedId.isEmpty ||
        validFrom.isEmpty ||
        !const {
          'renamed_to',
          'split_into',
          'merged_into',
          'continued_as',
        }.contains(relation)) {
      throw const FormatException(
        'Historical geography relationship is incomplete.',
      );
    }
    return GeographyHistoricalRelationship(
      relatedEntityId: relatedId,
      relationType: relation,
      validFrom: validFrom,
      validTo: json['valid_to']?.toString(),
      sourceReference: json['source_reference']?.toString(),
    );
  }
}

class GeographyGovernanceRecord {
  const GeographyGovernanceRecord({required this.title, this.summary});
  final String title;
  final String? summary;
  factory GeographyGovernanceRecord.fromJson(JsonObject json) =>
      GeographyGovernanceRecord(
        title: (json['title'] ?? 'Record').toString(),
        summary: json['summary']?.toString(),
      );
}

class GeographyGovernanceSection {
  const GeographyGovernanceSection({
    required this.title,
    required this.records,
  });
  final String title;
  final List<GeographyGovernanceRecord> records;
  factory GeographyGovernanceSection.fromJson(JsonObject json) =>
      GeographyGovernanceSection(
        title: (json['title'] ?? 'Records').toString(),
        records: (json['records'] is List ? json['records'] as List : const [])
            .map(
              (record) => GeographyGovernanceRecord.fromJson(
                _jsonObject(record, 'Governance record'),
              ),
            )
            .toList(),
      );
}

class GeographyGovernance {
  const GeographyGovernance(this.sections);
  final List<GeographyGovernanceSection> sections;
  factory GeographyGovernance.fromJson(JsonObject json) {
    final sections = json['sections'];
    if (sections is! List) {
      throw const FormatException(
        'Governance response must contain sections[].',
      );
    }
    return GeographyGovernance(
      sections
          .map(
            (section) => GeographyGovernanceSection.fromJson(
              _jsonObject(section, 'Governance section'),
            ),
          )
          .toList(),
    );
  }
}

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
    this.boundarySourceReference,
    this.boundaryLicense,
    this.boundaryYear,
    this.boundaryRetrievedAt,
    this.validFrom,
    this.validTo,
    this.datasetVersion,
    this.boundaryVersion,
    this.historicalNames = const [],
    this.historicalRelationships = const [],
  });

  final String id;
  final String name;
  final String displayName;
  final String level;
  final String? parentId;
  final String? parentName;
  final List<GeographyAncestor> ancestors;
  final bool boundaryVerified;
  final String? boundarySource;
  final String? boundarySourceReference;
  final String? boundaryLicense;
  final String? boundaryYear;
  final String? boundaryRetrievedAt;
  final String? validFrom;
  final String? validTo;
  final String? datasetVersion;
  final String? boundaryVersion;
  final List<GeographyHistoricalName> historicalNames;
  final List<GeographyHistoricalRelationship> historicalRelationships;
  BoundaryMetadata get boundaryMetadata => BoundaryMetadata(
    verified: boundaryVerified,
    source: boundarySource,
    sourceReference: boundarySourceReference,
    license: boundaryLicense,
    referenceYear: boundaryYear,
    retrievedAt: boundaryRetrievedAt,
    validFrom: validFrom,
    validTo: validTo,
    version: boundaryVersion,
    datasetVersion: datasetVersion,
  );

  factory GeographyEntity.fromJson(JsonObject json) {
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
                .map(
                  (item) => GeographyAncestor.fromJson(
                    _jsonObject(item, 'Geography ancestor'),
                  ),
                )
                .toList()
          : const [],
      boundaryVerified: json['boundary_verified'] == true,
      boundarySource: json['boundary_source']?.toString(),
      boundarySourceReference: json['boundary_source_reference']?.toString(),
      boundaryLicense: json['boundary_license']?.toString(),
      boundaryYear: json['boundary_year']?.toString(),
      boundaryRetrievedAt:
          json['boundary_retrieved_at']?.toString() ??
          json['retrieved_at']?.toString(),
      validFrom: json['valid_from']?.toString(),
      validTo: json['valid_to']?.toString(),
      datasetVersion: json['dataset_version']?.toString(),
      boundaryVersion: json['boundary_version']?.toString(),
      historicalNames:
          (json['historical_names'] is List
                  ? json['historical_names'] as List
                  : const [])
              .map(
                (item) => GeographyHistoricalName.fromJson(
                  _jsonObject(item, 'Historical geography name'),
                ),
              )
              .toList(),
      historicalRelationships:
          (json['historical_relationships'] is List
                  ? json['historical_relationships'] as List
                  : const [])
              .map(
                (item) => GeographyHistoricalRelationship.fromJson(
                  _jsonObject(item, 'Historical geography relationship'),
                ),
              )
              .toList(),
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
  final GeographyFeature? focusFeature;
  final GeographyFeature? parentBoundary;
  final GeographyFeatureCollection? siblingBoundaries;
  final GeographyFeatureCollection? childBoundaries;
  final GeographyGovernance? governance;

  bool get hasVerifiedGeometry => focusFeature != null;
}

class _CacheEntry<T> {
  const _CacheEntry(this.value, this.storedAt);
  final T value;
  final DateTime storedAt;
  bool get isFresh =>
      DateTime.now().difference(storedAt) < GeographyApiClient.cacheFreshness;
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
  final Map<String, _CacheEntry<GeographyEntity>> _entityCache = {};
  final Map<String, _CacheEntry<GeographyScene>> _sceneCache = {};
  static const cacheFreshness = Duration(minutes: 5);
  Future<Map<String, String>> Function()? headersProvider;

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

  static const defaultCountry = String.fromEnvironment(
    'MZIZI_DEFAULT_COUNTRY',
    defaultValue: 'KE',
  );
  static const defaultBoundaryLevel = String.fromEnvironment(
    'MZIZI_DEFAULT_BOUNDARY_LEVEL',
    defaultValue: 'county',
  );

  Future<List<GeographyEntity>> search(String query, {String? country}) async {
    final term = query.trim();
    if (term.isEmpty) return const [];
    final sequence = ++_searchSequence;
    final response = await _getJson(
      _uri('/v1/geography/search', {
        'q': term,
        if ((country ?? defaultCountry).trim().isNotEmpty)
          'country': (country ?? defaultCountry).trim(),
        'limit': '12',
      }),
    );
    if (sequence != _searchSequence) return const [];
    return _entitiesFromResults(response);
  }

  /// Returns a verified first administrative layer for the configured country.
  Future<GeographyFeatureCollection> initialBoundaries({
    String country = defaultCountry,
    String level = defaultBoundaryLevel,
  }) async {
    final collection = await _getJson(
      _uri('/v1/geography/boundaries', {'country': country, 'level': level}),
    );
    if (collection['type'] != 'FeatureCollection' ||
        collection['features'] is! List) {
      throw const FormatException(
        'Initial geography boundaries response must be a GeoJSON FeatureCollection.',
      );
    }
    validateCountyCollection(collection);
    return GeographyFeatureCollection.fromJson(
      _jsonObject(collection, 'County boundaries'),
    );
  }

  /// Validates the entire initial geography layer before Cesium receives it.
  static void validateCountyCollection(JsonObject collection) {
    final features = collection['features'];
    if (collection['type'] != 'FeatureCollection' || features is! List) {
      throw const FormatException('Expected a GeoJSON FeatureCollection.');
    }
    for (final item in features) {
      if (item is! Map ||
          !_isSelectableFeature(_jsonObject(item, 'County feature'))) {
        throw const FormatException(
          'County collection contains a feature without valid geometry or a canonical ID.',
        );
      }
      final properties = _jsonObject(
        item['properties'],
        'County feature properties',
      );
      final hasProvenance =
          _nonEmpty(properties['boundary_source']) &&
          _nonEmpty(properties['boundary_source_reference']) &&
          _nonEmpty(properties['boundary_license']);
      if (properties['boundary_verified'] != true || !hasProvenance) {
        throw const FormatException(
          'Boundary features must be verified and include source, source reference, and license metadata.',
        );
      }
    }
  }

  static void validateVerifiedCollection(JsonObject collection) {
    final features = collection['features'];
    if (collection['type'] != 'FeatureCollection' || features is! List) {
      throw const FormatException('Expected a GeoJSON FeatureCollection.');
    }
    for (final item in features) {
      if (item is! Map) {
        throw const FormatException(
          'Boundary collection contains a non-feature value.',
        );
      }
      final feature = _jsonObject(item, 'Boundary feature');
      if (!_isSelectableFeature(feature) || !_isVerified(feature)) {
        throw const FormatException(
          'Boundary features must have valid geometry, a canonical ID, verification, source, and license.',
        );
      }
    }
  }

  static bool _nonEmpty(Object? value) =>
      value?.toString().trim().isNotEmpty == true;

  List<GeographyEntity> _entitiesFromResults(JsonObject response) {
    final results = response['results'];
    if (results is! List) {
      throw const FormatException('Search response must contain results[].');
    }
    return results
        .map(
          (item) =>
              GeographyEntity.fromJson(_jsonObject(item, 'Search result')),
        )
        .toList();
  }

  Future<GeographyEntity> entity(String id, {bool forceRefresh = false}) async {
    final cached = _entityCache[id];
    if (!forceRefresh && cached != null && cached.isFresh) return cached.value;
    final entity = GeographyEntity.fromJson(
      await _getJson(_uri('/v1/geography/entities/${Uri.encodeComponent(id)}')),
    );
    _entityCache[id] = _CacheEntry(entity, DateTime.now());
    return entity;
  }

  Future<GeographyScene> sceneFor(
    String id, {
    bool forceRefresh = false,
  }) async {
    final cached = _sceneCache[id];
    if (!forceRefresh && cached != null && cached.isFresh) return cached.value;
    final encodedId = Uri.encodeComponent(id);
    final entity = await this.entity(id, forceRefresh: forceRefresh);
    final focusRequest = entity.boundaryVerified
        ? _getJson(
            _uri('/v1/geography/entities/$encodedId/boundary'),
            allowNotFound: true,
          )
        : Future<JsonObject>.value(const {});
    final contextRequest = _getJson(
      _uri('/v1/geography/entities/$encodedId/map-context'),
      allowNotFound: true,
    );
    final childRequest = _getJson(
      _uri('/v1/geography/entities/$encodedId/children/boundaries'),
      allowNotFound: true,
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
    final focus = entity.boundaryVerified && values[0].isNotEmpty
        ? _asFeature(values[0], verified: true, expectedId: entity.id)
        : null;
    final children = values[1].isEmpty
        ? const GeographyFeatureCollection([])
        : _asFeatureCollection(values[1], requireVerified: true);
    final context = values[3];
    final parent = context['parent_boundary'];
    final siblings = context['sibling_boundaries'];
    final scene = GeographyScene(
      entity: entity,
      focusFeature: focus,
      parentBoundary: parent is Map
          ? _asFeature(
              _jsonObject(parent, 'Parent boundary'),
              verified: true,
              expectedId: entity.parentId,
            )
          : null,
      siblingBoundaries: siblings is Map
          ? _asFeatureCollection(
              _jsonObject(siblings, 'Sibling boundaries'),
              requireVerified: true,
            )
          : null,
      childBoundaries: children,
      governance: values[2].isEmpty
          ? null
          : GeographyGovernance.fromJson(values[2]),
    );
    _sceneCache[id] = _CacheEntry(scene, DateTime.now());
    return scene;
  }

  void clearCache({String? entityId}) {
    if (entityId == null) {
      _entityCache.clear();
      _sceneCache.clear();
      return;
    }
    _entityCache.remove(entityId);
    _sceneCache.remove(entityId);
  }

  Future<JsonObject> _getJson(
    Uri uri, {
    Map<String, String>? headers,
    bool allowNotFound = false,
  }) async {
    final providerHeaders = await headersProvider?.call();
    final response = await _client
        .get(
          uri,
          headers: {
            'Accept': 'application/json',
            ...?providerHeaders,
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
    return _jsonObject(decoded, 'API response');
  }

  GeographyFeature? _asFeature(
    JsonObject value, {
    bool verified = false,
    String? expectedId,
  }) {
    if (_isSelectableFeature(value) &&
        (!verified || _isVerified(value)) &&
        _matchesId(value, expectedId)) {
      return GeographyFeature.fromJson(value);
    }
    if (value['type'] == 'FeatureCollection' && value['features'] is List) {
      final features = value['features'] as List;
      JsonObject? matched;
      for (final item in features) {
        if (item is! Map) continue;
        final feature = _jsonObject(item, 'Boundary feature');
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
        return GeographyFeature.fromJson(matched);
      }
      if (features.length == 1 && features.first is Map) {
        final feature = _jsonObject(features.first, 'Boundary feature');
        return _isSelectableFeature(feature) &&
                (!verified || _isVerified(feature)) &&
                _matchesId(feature, expectedId)
            ? GeographyFeature.fromJson(feature)
            : null;
      }
    }
    return null;
  }

  GeographyFeatureCollection? _asFeatureCollection(
    JsonObject value, {
    bool requireVerified = false,
  }) {
    if (value['type'] == 'FeatureCollection' && value['features'] is List) {
      for (final item in value['features'] as List) {
        if (item is! Map) {
          throw const FormatException(
            'Boundary collection has invalid geometry.',
          );
        }
        final feature = _jsonObject(item, 'Boundary feature');
        if (!_isSelectableFeature(feature) ||
            (requireVerified && !_isVerified(feature))) {
          throw const FormatException(
            'Boundary collection has invalid geometry.',
          );
        }
      }
      return GeographyFeatureCollection.fromJson(value);
    }
    return null;
  }

  static bool _isFeature(JsonObject feature) =>
      feature['type'] == 'Feature' &&
      feature['geometry'] is Map &&
      _validGeoJsonGeometry(
        _jsonObject(feature['geometry'], 'Feature geometry'),
      );

  static bool _isSelectableFeature(JsonObject feature) {
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

  static bool _matchesId(JsonObject feature, String? expectedId) {
    if (expectedId == null) return true;
    final properties = feature['properties'];
    return properties is Map && _featureId(properties) == expectedId;
  }

  static bool _isVerified(JsonObject feature) {
    final properties = feature['properties'];
    return properties is Map &&
        properties['boundary_verified'] == true &&
        _nonEmpty(properties['boundary_source']) &&
        _nonEmpty(properties['boundary_source_reference']) &&
        _nonEmpty(properties['boundary_license']);
  }
}
