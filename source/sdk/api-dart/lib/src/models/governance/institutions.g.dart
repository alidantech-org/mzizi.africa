// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institutions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceInstitutions _$GovernanceInstitutionsFromJson(Map<String, dynamic> json) => GovernanceInstitutions(
  armId: json['armId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  dissolvedOn: json['dissolvedOn'] == null ? null : DateTime.parse(json['dissolvedOn'] as String),
  entityId: json['entityId'] as String,
  establishedOn: json['establishedOn'] == null ? null : DateTime.parse(json['establishedOn'] as String),
  establishmentBasisId: json['establishmentBasisId'] as String?,
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  institutionKindId: json['institutionKindId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceInstitutionsToJson(GovernanceInstitutions instance) => <String, dynamic>{
  'armId': ?instance.armId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'dissolvedOn': ?instance.dissolvedOn?.toIso8601String(),
  'entityId': instance.entityId,
  'establishedOn': ?instance.establishedOn?.toIso8601String(),
  'establishmentBasisId': ?instance.establishmentBasisId,
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'institutionKindId': instance.institutionKindId,
  'sourceCitationId': ?instance.sourceCitationId,
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
