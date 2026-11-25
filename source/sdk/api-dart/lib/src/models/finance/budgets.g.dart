// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'budgets.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceBudgets _$FinanceBudgetsFromJson(Map<String, dynamic> json) => FinanceBudgets(
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  governmentId: json['governmentId'] as String,
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  periodId: json['periodId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceBudgetsToJson(FinanceBudgets instance) => <String, dynamic>{
  'code': instance.code,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'governmentId': instance.governmentId,
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'periodId': instance.periodId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
