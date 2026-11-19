// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'positions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernancePositions _$GovernancePositionsFromJson(Map<String, dynamic> json) => GovernancePositions(
  basisProvisionId: json['basisProvisionId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  displayOrder: (json['displayOrder'] as num?)?.toInt(),
  exposureId: json['exposureId'] as String?,
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String,
  jurisdictionLevelId: json['jurisdictionLevelId'] as String?,
  roleId: json['roleId'] as String,
  seatBasisId: json['seatBasisId'] as String,
  seatCount: (json['seatCount'] as num?)?.toInt(),
  seatUnitLevelId: json['seatUnitLevelId'] as String?,
  selectionMethodId: json['selectionMethodId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  termLimit: (json['termLimit'] as num?)?.toInt(),
  termYears: (json['termYears'] as num?)?.toInt(),
  titleId: json['titleId'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernancePositionsToJson(GovernancePositions instance) => <String, dynamic>{
  'basisProvisionId': ?instance.basisProvisionId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'displayOrder': ?instance.displayOrder,
  'exposureId': ?instance.exposureId,
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'institutionId': instance.institutionId,
  'jurisdictionLevelId': ?instance.jurisdictionLevelId,
  'roleId': instance.roleId,
  'seatBasisId': instance.seatBasisId,
  'seatCount': ?instance.seatCount,
  'seatUnitLevelId': ?instance.seatUnitLevelId,
  'selectionMethodId': instance.selectionMethodId,
  'sourceCitationId': ?instance.sourceCitationId,
  'termLimit': ?instance.termLimit,
  'termYears': ?instance.termYears,
  'titleId': instance.titleId,
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
