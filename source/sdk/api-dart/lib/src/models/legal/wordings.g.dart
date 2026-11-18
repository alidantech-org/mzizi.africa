// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'wordings.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalWordings _$LegalWordingsFromJson(Map<String, dynamic> json) => LegalWordings(
  citationId: json['citationId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  editionId: json['editionId'] as String,
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  instrumentId: json['instrumentId'] as String,
  languageId: json['languageId'] as String,
  observedAt: DateTime.parse(json['observedAt'] as String),
  provisionId: json['provisionId'] as String,
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  supersedesId: json['supersedesId'] as String?,
  text: json['text'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegalWordingsToJson(LegalWordings instance) => <String, dynamic>{
  'citationId': ?instance.citationId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'editionId': instance.editionId,
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'instrumentId': instance.instrumentId,
  'languageId': instance.languageId,
  'observedAt': instance.observedAt.toIso8601String(),
  'provisionId': instance.provisionId,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'supersedesId': ?instance.supersedesId,
  'text': instance.text,
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
