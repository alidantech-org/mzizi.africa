// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'holders.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceHolders _$GovernanceHoldersFromJson(Map<String, dynamic> json) => GovernanceHolders(
  appointedByEntityId: json['appointedByEntityId'] as String?,
  appointmentKindId: json['appointmentKindId'] as String,
  appointmentMotionId: json['appointmentMotionId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  individualId: json['individualId'] as String,
  leftOfficeOn: json['leftOfficeOn'] == null ? null : DateTime.parse(json['leftOfficeOn'] as String),
  nominatedByEntityId: json['nominatedByEntityId'] as String?,
  officeId: json['officeId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  tookOfficeOn: json['tookOfficeOn'] == null ? null : DateTime.parse(json['tookOfficeOn'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceHoldersToJson(GovernanceHolders instance) => <String, dynamic>{
  'appointedByEntityId': ?instance.appointedByEntityId,
  'appointmentKindId': instance.appointmentKindId,
  'appointmentMotionId': ?instance.appointmentMotionId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'individualId': instance.individualId,
  'leftOfficeOn': ?instance.leftOfficeOn?.toIso8601String(),
  'nominatedByEntityId': ?instance.nominatedByEntityId,
  'officeId': instance.officeId,
  'sourceCitationId': ?instance.sourceCitationId,
  'toYear': ?instance.toYear,
  'tookOfficeOn': ?instance.tookOfficeOn?.toIso8601String(),
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
