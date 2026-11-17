// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feature_geometry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyFeatureGeometry _$GeographyFeatureGeometryFromJson(Map<String, dynamic> json) => GeographyFeatureGeometry(
  basisId: json['basisId'] as String,
  centroid: json['centroid'],
  confidence: (json['confidence'] as num?)?.toDouble(),
  featureId: json['featureId'] as String,
  geometry: json['geometry'],
  geometryId: json['geometryId'] as String,
  geometryRoleId: json['geometryRoleId'] as String,
  maxZoom: (json['maxZoom'] as num?)?.toInt(),
  minZoom: (json['minZoom'] as num?)?.toInt(),
  observedAt: json['observedAt'] == null ? null : DateTime.parse(json['observedAt'] as String),
  revision: (json['revision'] as num).toInt(),
  validFrom: DateTime.parse(json['validFrom'] as String),
);

Map<String, dynamic> _$GeographyFeatureGeometryToJson(GeographyFeatureGeometry instance) => <String, dynamic>{
  'basisId': instance.basisId,
  'centroid': ?instance.centroid,
  'confidence': ?instance.confidence,
  'featureId': instance.featureId,
  'geometry': ?instance.geometry,
  'geometryId': instance.geometryId,
  'geometryRoleId': instance.geometryRoleId,
  'maxZoom': ?instance.maxZoom,
  'minZoom': ?instance.minZoom,
  'observedAt': ?instance.observedAt?.toIso8601String(),
  'revision': instance.revision,
  'validFrom': instance.validFrom.toIso8601String(),
};
