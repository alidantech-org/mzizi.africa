// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'powers.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernancePowers _$GovernancePowersFromJson(Map<String, dynamic> json) => GovernancePowers(
  basisProvisionId: json['basisProvisionId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  holderInstitutionId: json['holderInstitutionId'] as String?,
  holderPositionId: json['holderPositionId'] as String?,
  id: json['id'] as String,
  isBinding: json['isBinding'] as bool,
  kindId: json['kindId'] as String,
  procedureId: json['procedureId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  stepOrder: (json['stepOrder'] as num?)?.toInt(),
  targetInstitutionId: json['targetInstitutionId'] as String?,
  targetPositionId: json['targetPositionId'] as String?,
  thresholdId: json['thresholdId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernancePowersToJson(GovernancePowers instance) => <String, dynamic>{
  'basisProvisionId': ?instance.basisProvisionId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'holderInstitutionId': ?instance.holderInstitutionId,
  'holderPositionId': ?instance.holderPositionId,
  'id': instance.id,
  'isBinding': instance.isBinding,
  'kindId': instance.kindId,
  'procedureId': ?instance.procedureId,
  'sourceCitationId': ?instance.sourceCitationId,
  'stepOrder': ?instance.stepOrder,
  'targetInstitutionId': ?instance.targetInstitutionId,
  'targetPositionId': ?instance.targetPositionId,
  'thresholdId': ?instance.thresholdId,
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
