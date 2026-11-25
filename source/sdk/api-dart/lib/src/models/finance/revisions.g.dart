// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'revisions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceRevisions _$FinanceRevisionsFromJson(Map<String, dynamic> json) => FinanceRevisions(
  budgetId: json['budgetId'] as String,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  releasedOn: json['releasedOn'] == null ? null : DateTime.parse(json['releasedOn'] as String),
  revision: (json['revision'] as num).toInt(),
  statusTerm: json['statusTerm'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceRevisionsToJson(FinanceRevisions instance) => <String, dynamic>{
  'budgetId': instance.budgetId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'releasedOn': ?instance.releasedOn?.toIso8601String(),
  'revision': instance.revision,
  'statusTerm': instance.statusTerm,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
