// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'budgets.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceBudgets _$FinanceBudgetsFromJson(Map<String, dynamic> json) => FinanceBudgets(
  budgetKindId: json['budgetKindId'] as String,
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fiscalPeriodId: json['fiscalPeriodId'] as String,
  governmentEntityId: json['governmentEntityId'] as String?,
  id: json['id'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceBudgetsToJson(FinanceBudgets instance) => <String, dynamic>{
  'budgetKindId': instance.budgetKindId,
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fiscalPeriodId': instance.fiscalPeriodId,
  'governmentEntityId': ?instance.governmentEntityId,
  'id': instance.id,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
