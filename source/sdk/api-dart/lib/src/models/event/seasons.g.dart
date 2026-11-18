// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'seasons.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventSeasons _$EventSeasonsFromJson(Map<String, dynamic> json) => EventSeasons(
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String?,
  endDay: (json['endDay'] as num?)?.toInt(),
  endMonth: (json['endMonth'] as num).toInt(),
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  isNatural: json['isNatural'] as bool,
  scopeFeatureId: json['scopeFeatureId'] as String?,
  seasonKindId: json['seasonKindId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  startDay: (json['startDay'] as num?)?.toInt(),
  startMonth: (json['startMonth'] as num).toInt(),
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EventSeasonsToJson(EventSeasons instance) => <String, dynamic>{
  'code': instance.code,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': ?instance.description,
  'endDay': ?instance.endDay,
  'endMonth': instance.endMonth,
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'isNatural': instance.isNatural,
  'scopeFeatureId': ?instance.scopeFeatureId,
  'seasonKindId': instance.seasonKindId,
  'sourceCitationId': ?instance.sourceCitationId,
  'startDay': ?instance.startDay,
  'startMonth': instance.startMonth,
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
