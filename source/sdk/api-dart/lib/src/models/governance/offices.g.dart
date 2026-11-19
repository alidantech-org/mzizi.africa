// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offices.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceOffices _$GovernanceOfficesFromJson(Map<String, dynamic> json) => GovernanceOffices(
  abolishedOn: json['abolishedOn'] == null ? null : DateTime.parse(json['abolishedOn'] as String),
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  createdOn: json['createdOn'] == null ? null : DateTime.parse(json['createdOn'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String,
  positionId: json['positionId'] as String,
  seatOrdinal: (json['seatOrdinal'] as num?)?.toInt(),
  sourceCitationId: json['sourceCitationId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  unitFeatureId: json['unitFeatureId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceOfficesToJson(GovernanceOffices instance) => <String, dynamic>{
  'abolishedOn': ?instance.abolishedOn?.toIso8601String(),
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'createdOn': ?instance.createdOn?.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'institutionId': instance.institutionId,
  'positionId': instance.positionId,
  'seatOrdinal': ?instance.seatOrdinal,
  'sourceCitationId': ?instance.sourceCitationId,
  'toYear': ?instance.toYear,
  'unitFeatureId': ?instance.unitFeatureId,
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
