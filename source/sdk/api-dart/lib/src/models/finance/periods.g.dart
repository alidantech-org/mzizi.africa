// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'periods.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinancePeriods _$FinancePeriodsFromJson(Map<String, dynamic> json) => FinancePeriods(
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: DateTime.parse(json['endsOn'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  startsOn: DateTime.parse(json['startsOn'] as String),
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinancePeriodsToJson(FinancePeriods instance) => <String, dynamic>{
  'code': instance.code,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': instance.endsOn.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'startsOn': instance.startsOn.toIso8601String(),
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
