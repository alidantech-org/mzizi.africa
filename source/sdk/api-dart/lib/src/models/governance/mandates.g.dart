// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'mandates.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceMandates _$GovernanceMandatesFromJson(Map<String, dynamic> json) => GovernanceMandates(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String,
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String?,
  mandateKindId: json['mandateKindId'] as String,
  officeId: json['officeId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceMandatesToJson(GovernanceMandates instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': instance.description,
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'institutionId': ?instance.institutionId,
  'mandateKindId': instance.mandateKindId,
  'officeId': ?instance.officeId,
  'sourceCitationId': ?instance.sourceCitationId,
  'startsOn': ?instance.startsOn?.toIso8601String(),
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
