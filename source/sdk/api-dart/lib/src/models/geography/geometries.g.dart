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
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  geometry: json['geometry'],
  geometryRoleId: json['geometryRoleId'] as String,
  id: json['id'] as String,
  maxZoom: (json['maxZoom'] as num?)?.toInt(),
  minZoom: (json['minZoom'] as num?)?.toInt(),
  observedAt: json['observedAt'] == null ? null : DateTime.parse(json['observedAt'] as String),
  revision: (json['revision'] as num).toInt(),
  srid: (json['srid'] as num).toInt(),
  supersedesId: json['supersedesId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
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
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'geometry': ?instance.geometry,
  'geometryRoleId': instance.geometryRoleId,
  'id': instance.id,
  'maxZoom': ?instance.maxZoom,
  'minZoom': ?instance.minZoom,
  'observedAt': ?instance.observedAt?.toIso8601String(),
  'revision': instance.revision,
  'srid': instance.srid,
  'supersedesId': ?instance.supersedesId,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$SharedDatePrecisionEnumMap = {
  SharedDatePrecision.approximate: 'approximate',
  SharedDatePrecision.endApproximate: 'end-approximate',
  SharedDatePrecision.exact: 'exact',
  SharedDatePrecision.startApproximate: 'start-approximate',
  SharedDatePrecision.unknown: 'unknown',
};
