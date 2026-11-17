// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'classifications.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyClassifications _$GeographyClassificationsFromJson(Map<String, dynamic> json) => GeographyClassifications(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String,
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  valueId: json['valueId'] as String,
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyClassificationsToJson(GeographyClassifications instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': instance.featureId,
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'valueId': instance.valueId,
  'version': instance.version,
};

const _$SharedDatePrecisionEnumMap = {
  SharedDatePrecision.approximate: 'approximate',
  SharedDatePrecision.endApproximate: 'end-approximate',
  SharedDatePrecision.exact: 'exact',
  SharedDatePrecision.startApproximate: 'start-approximate',
  SharedDatePrecision.unknown: 'unknown',
};
