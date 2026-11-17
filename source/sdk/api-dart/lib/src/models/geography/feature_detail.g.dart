// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feature_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyFeatureDetail _$GeographyFeatureDetailFromJson(Map<String, dynamic> json) => GeographyFeatureDetail(
  code: json['code'] as String,
  featureId: json['featureId'] as String,
  featureTypeId: json['featureTypeId'] as String,
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  names: (json['names'] as List<dynamic>).map((e) => GeographyFeatureDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$GeographyFeatureDetailToJson(GeographyFeatureDetail instance) => <String, dynamic>{
  'code': instance.code,
  'featureId': instance.featureId,
  'featureTypeId': instance.featureTypeId,
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'names': instance.names,
  'toYear': ?instance.toYear,
};

const _$SharedDatePrecisionEnumMap = {
  SharedDatePrecision.approximate: 'approximate',
  SharedDatePrecision.endApproximate: 'end-approximate',
  SharedDatePrecision.exact: 'exact',
  SharedDatePrecision.startApproximate: 'start-approximate',
  SharedDatePrecision.unknown: 'unknown',
};
