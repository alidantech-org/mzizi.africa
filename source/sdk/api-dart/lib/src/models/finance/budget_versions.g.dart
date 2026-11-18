// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'budget_versions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceBudgetVersions _$FinanceBudgetVersionsFromJson(Map<String, dynamic> json) => FinanceBudgetVersions(
  budgetId: json['budgetId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  releasedOn: json['releasedOn'] == null ? null : DateTime.parse(json['releasedOn'] as String),
  revision: (json['revision'] as num).toInt(),
  sourceCitationId: json['sourceCitationId'] as String?,
  statusId: json['statusId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceBudgetVersionsToJson(FinanceBudgetVersions instance) => <String, dynamic>{
  'budgetId': instance.budgetId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'releasedOn': ?instance.releasedOn?.toIso8601String(),
  'revision': instance.revision,
  'sourceCitationId': ?instance.sourceCitationId,
  'statusId': instance.statusId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
