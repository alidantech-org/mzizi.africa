// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'flows.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceFlows _$FinanceFlowsFromJson(Map<String, dynamic> json) => FinanceFlows(
  amount: (json['amount'] as num?)?.toInt(),
  appropriationId: json['appropriationId'] as String?,
  classTerm: json['classTerm'] as String?,
  contractId: json['contractId'] as String?,
  counterpartyId: json['counterpartyId'] as String?,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  debtId: json['debtId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String?,
  fundId: json['fundId'] as String?,
  id: json['id'] as String,
  institutionId: json['institutionId'] as String?,
  kindTerm: json['kindTerm'] as String,
  occurredOn: json['occurredOn'] == null ? null : DateTime.parse(json['occurredOn'] as String),
  periodId: json['periodId'] as String?,
  projectId: json['projectId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceFlowsToJson(FinanceFlows instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'appropriationId': ?instance.appropriationId,
  'classTerm': ?instance.classTerm,
  'contractId': ?instance.contractId,
  'counterpartyId': ?instance.counterpartyId,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'debtId': ?instance.debtId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': ?instance.featureId,
  'fundId': ?instance.fundId,
  'id': instance.id,
  'institutionId': ?instance.institutionId,
  'kindTerm': instance.kindTerm,
  'occurredOn': ?instance.occurredOn?.toIso8601String(),
  'periodId': ?instance.periodId,
  'projectId': ?instance.projectId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
