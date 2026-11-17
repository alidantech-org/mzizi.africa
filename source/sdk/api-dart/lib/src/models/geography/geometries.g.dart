// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'geometries.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyGeometries _$GeographyGeometriesFromJson(Map<String, dynamic> json) => GeographyGeometries(
  area: (json['area'] as num).toDouble(),
  basisId: json['basisId'] as String,
  centroid: json['centroid'],
  confidence: (json['confidence'] as num?)?.toDouble(),
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  envelope: json['envelope'],
  featureId: json['featureId'] as String,
  fileVersionRefId: json['fileVersionRefId'] as String?,
  geometry: json['geometry'],
  geometryRoleId: json['geometryRoleId'] as String,
  id: json['id'] as String,
  maxZoom: (json['maxZoom'] as num?)?.toInt(),
  minZoom: (json['minZoom'] as num?)?.toInt(),
  observedAt: json['observedAt'] == null ? null : DateTime.parse(json['observedAt'] as String),
  revision: (json['revision'] as num).toInt(),
  srid: (json['srid'] as num).toInt(),
  supersedesId: json['supersedesId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  validFrom: json['validFrom'] == null ? null : DateTime.parse(json['validFrom'] as String),
  validFromEarliest: json['validFromEarliest'] == null ? null : DateTime.parse(json['validFromEarliest'] as String),
  validFromLatest: json['validFromLatest'] == null ? null : DateTime.parse(json['validFromLatest'] as String),
  validUntil: json['validUntil'] == null ? null : DateTime.parse(json['validUntil'] as String),
  validUntilEarliest: json['validUntilEarliest'] == null ? null : DateTime.parse(json['validUntilEarliest'] as String),
  validUntilLatest: json['validUntilLatest'] == null ? null : DateTime.parse(json['validUntilLatest'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyGeometriesToJson(GeographyGeometries instance) => <String, dynamic>{
  'area': instance.area,
  'basisId': instance.basisId,
  'centroid': ?instance.centroid,
  'confidence': ?instance.confidence,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'envelope': ?instance.envelope,
  'featureId': instance.featureId,
  'fileVersionRefId': ?instance.fileVersionRefId,
  'geometry': ?instance.geometry,
  'geometryRoleId': instance.geometryRoleId,
  'id': instance.id,
  'maxZoom': ?instance.maxZoom,
  'minZoom': ?instance.minZoom,
  'observedAt': ?instance.observedAt?.toIso8601String(),
  'revision': instance.revision,
  'srid': instance.srid,
  'supersedesId': ?instance.supersedesId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'validFrom': ?instance.validFrom?.toIso8601String(),
  'validFromEarliest': ?instance.validFromEarliest?.toIso8601String(),
  'validFromLatest': ?instance.validFromLatest?.toIso8601String(),
  'validUntil': ?instance.validUntil?.toIso8601String(),
  'validUntilEarliest': ?instance.validUntilEarliest?.toIso8601String(),
  'validUntilLatest': ?instance.validUntilLatest?.toIso8601String(),
  'version': instance.version,
};
