// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'obligations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceObligations _$GovernanceObligationsFromJson(Map<String, dynamic> json) => GovernanceObligations(
  basisProvisionId: json['basisProvisionId'] as String?,
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String,
  frequencyId: json['frequencyId'] as String,
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  obligationKindId: json['obligationKindId'] as String,
  obligorInstitutionId: json['obligorInstitutionId'] as String?,
  obligorKindId: json['obligorKindId'] as String?,
  recipientEntityId: json['recipientEntityId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceObligationsToJson(GovernanceObligations instance) => <String, dynamic>{
  'basisProvisionId': ?instance.basisProvisionId,
  'code': instance.code,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': instance.description,
  'frequencyId': instance.frequencyId,
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'obligationKindId': instance.obligationKindId,
  'obligorInstitutionId': ?instance.obligorInstitutionId,
  'obligorKindId': ?instance.obligorKindId,
  'recipientEntityId': ?instance.recipientEntityId,
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
