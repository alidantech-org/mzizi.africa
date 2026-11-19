// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'assignments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceAssignments _$GovernanceAssignmentsFromJson(Map<String, dynamic> json) => GovernanceAssignments(
  basisProvisionId: json['basisProvisionId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  functionId: json['functionId'] as String,
  id: json['id'] as String,
  institutionId: json['institutionId'] as String?,
  obligorKindId: json['obligorKindId'] as String?,
  shareId: json['shareId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  startInstitutionId: json['startInstitutionId'] as String?,
  startPositionId: json['startPositionId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceAssignmentsToJson(GovernanceAssignments instance) => <String, dynamic>{
  'basisProvisionId': ?instance.basisProvisionId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'functionId': instance.functionId,
  'id': instance.id,
  'institutionId': ?instance.institutionId,
  'obligorKindId': ?instance.obligorKindId,
  'shareId': instance.shareId,
  'sourceCitationId': ?instance.sourceCitationId,
  'startInstitutionId': ?instance.startInstitutionId,
  'startPositionId': ?instance.startPositionId,
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
