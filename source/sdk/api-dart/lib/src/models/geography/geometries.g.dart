// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'geometries.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyGeometries _$GeographyGeometriesFromJson(Map<String, dynamic> json) => GeographyGeometries(
  area: (json['area'] as num).toDouble(),
  basisTerm: json['basisTerm'] as String,
  centroid: json['centroid'],
  confidence: (json['confidence'] as num?)?.toDouble(),
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  envelope: json['envelope'],
  featureId: json['featureId'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  geometry: json['geometry'],
  id: json['id'] as String,
  revision: (json['revision'] as num).toInt(),
  roleTerm: json['roleTerm'] as String,
  supersedesId: json['supersedesId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyGeometriesToJson(GeographyGeometries instance) => <String, dynamic>{
  'area': instance.area,
  'basisTerm': instance.basisTerm,
  'centroid': ?instance.centroid,
  'confidence': ?instance.confidence,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'envelope': ?instance.envelope,
  'featureId': instance.featureId,
  'fromYear': ?instance.fromYear,
  'geometry': ?instance.geometry,
  'id': instance.id,
  'revision': instance.revision,
  'roleTerm': instance.roleTerm,
  'supersedesId': ?instance.supersedesId,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
