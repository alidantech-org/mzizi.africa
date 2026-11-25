// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'findings.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceFindings _$FinanceFindingsFromJson(Map<String, dynamic> json) => FinanceFindings(
  amount: (json['amount'] as num?)?.toInt(),
  code: json['code'] as String,
  contractId: json['contractId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  flowCountryId: json['flowCountryId'] as String?,
  flowId: json['flowId'] as String?,
  id: json['id'] as String,
  institutionId: json['institutionId'] as String,
  kindTerm: json['kindTerm'] as String,
  periodId: json['periodId'] as String,
  projectId: json['projectId'] as String?,
  statusTerm: json['statusTerm'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceFindingsToJson(FinanceFindings instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'code': instance.code,
  'contractId': ?instance.contractId,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'flowCountryId': ?instance.flowCountryId,
  'flowId': ?instance.flowId,
  'id': instance.id,
  'institutionId': instance.institutionId,
  'kindTerm': instance.kindTerm,
  'periodId': instance.periodId,
  'projectId': ?instance.projectId,
  'statusTerm': instance.statusTerm,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
