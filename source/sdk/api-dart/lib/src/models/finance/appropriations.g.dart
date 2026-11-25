// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'appropriations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceAppropriations _$FinanceAppropriationsFromJson(Map<String, dynamic> json) => FinanceAppropriations(
  amount: (json['amount'] as num?)?.toInt(),
  classTerm: json['classTerm'] as String,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String?,
  id: json['id'] as String,
  parentId: json['parentId'] as String?,
  projectId: json['projectId'] as String?,
  recipientId: json['recipientId'] as String?,
  revisionId: json['revisionId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceAppropriationsToJson(FinanceAppropriations instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'classTerm': instance.classTerm,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': ?instance.featureId,
  'id': instance.id,
  'parentId': ?instance.parentId,
  'projectId': ?instance.projectId,
  'recipientId': ?instance.recipientId,
  'revisionId': instance.revisionId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
