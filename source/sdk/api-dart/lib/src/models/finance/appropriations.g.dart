// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'appropriations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceAppropriations _$FinanceAppropriationsFromJson(Map<String, dynamic> json) => FinanceAppropriations(
  amountMinorUnits: (json['amountMinorUnits'] as num).toInt(),
  budgetVersionId: json['budgetVersionId'] as String,
  classificationId: json['classificationId'] as String,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  parentAppropriationId: json['parentAppropriationId'] as String?,
  projectId: json['projectId'] as String?,
  recipientEntityId: json['recipientEntityId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  unitFeatureId: json['unitFeatureId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceAppropriationsToJson(FinanceAppropriations instance) => <String, dynamic>{
  'amountMinorUnits': instance.amountMinorUnits,
  'budgetVersionId': instance.budgetVersionId,
  'classificationId': instance.classificationId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'parentAppropriationId': ?instance.parentAppropriationId,
  'projectId': ?instance.projectId,
  'recipientEntityId': ?instance.recipientEntityId,
  'sourceCitationId': ?instance.sourceCitationId,
  'unitFeatureId': ?instance.unitFeatureId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
