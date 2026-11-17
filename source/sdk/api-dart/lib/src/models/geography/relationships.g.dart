// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'relationships.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyRelationships _$GeographyRelationshipsFromJson(Map<String, dynamic> json) => GeographyRelationships(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  objectFeatureId: json['objectFeatureId'] as String,
  relationshipKindId: json['relationshipKindId'] as String,
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  subjectFeatureId: json['subjectFeatureId'] as String,
  systemId: json['systemId'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyRelationshipsToJson(GeographyRelationships instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'objectFeatureId': instance.objectFeatureId,
  'relationshipKindId': instance.relationshipKindId,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'subjectFeatureId': instance.subjectFeatureId,
  'systemId': instance.systemId,
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
