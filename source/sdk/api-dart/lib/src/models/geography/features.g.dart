// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'features.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyFeatures _$GeographyFeaturesFromJson(Map<String, dynamic> json) => GeographyFeatures(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endedOn: json['endedOn'] == null ? null : DateTime.parse(json['endedOn'] as String),
  establishedOn: json['establishedOn'] == null ? null : DateTime.parse(json['establishedOn'] as String),
  featureTypeId: json['featureTypeId'] as String,
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyFeaturesToJson(GeographyFeatures instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endedOn': ?instance.endedOn?.toIso8601String(),
  'establishedOn': ?instance.establishedOn?.toIso8601String(),
  'featureTypeId': instance.featureTypeId,
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
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
