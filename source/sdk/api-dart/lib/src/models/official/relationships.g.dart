// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'relationships.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OfficialRelationships _$OfficialRelationshipsFromJson(Map<String, dynamic> json) => OfficialRelationships(
  code: json['code'] as String,
  confidence: (json['confidence'] as num?)?.toDouble(),
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  evidenceBasisId: json['evidenceBasisId'] as String?,
  evidenceStatusId: json['evidenceStatusId'] as String?,
  fromEntityId: json['fromEntityId'] as String?,
  fromIndividualId: json['fromIndividualId'] as String?,
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  kindId: json['kindId'] as String,
  sharePercentage: (json['sharePercentage'] as num?)?.toDouble(),
  sourceCitationId: json['sourceCitationId'] as String?,
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  toEntityId: json['toEntityId'] as String?,
  toIndividualId: json['toIndividualId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$OfficialRelationshipsToJson(OfficialRelationships instance) => <String, dynamic>{
  'code': instance.code,
  'confidence': ?instance.confidence,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'evidenceBasisId': ?instance.evidenceBasisId,
  'evidenceStatusId': ?instance.evidenceStatusId,
  'fromEntityId': ?instance.fromEntityId,
  'fromIndividualId': ?instance.fromIndividualId,
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'kindId': instance.kindId,
  'sharePercentage': ?instance.sharePercentage,
  'sourceCitationId': ?instance.sourceCitationId,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'toEntityId': ?instance.toEntityId,
  'toIndividualId': ?instance.toIndividualId,
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
