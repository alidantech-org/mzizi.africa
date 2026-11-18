// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fiscal_periods.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceFiscalPeriods _$FinanceFiscalPeriodsFromJson(Map<String, dynamic> json) => FinanceFiscalPeriods(
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: DateTime.parse(json['endsOn'] as String),
  id: json['id'] as String,
  periodKindId: json['periodKindId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  startsOn: DateTime.parse(json['startsOn'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceFiscalPeriodsToJson(FinanceFiscalPeriods instance) => <String, dynamic>{
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': instance.endsOn.toIso8601String(),
  'id': instance.id,
  'periodKindId': instance.periodKindId,
  'sourceCitationId': ?instance.sourceCitationId,
  'startsOn': instance.startsOn.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
