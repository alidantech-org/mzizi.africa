// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'flows.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceFlows _$FinanceFlowsFromJson(Map<String, dynamic> json) => FinanceFlows(
  amountMinorUnits: (json['amountMinorUnits'] as num).toInt(),
  appropriationId: json['appropriationId'] as String?,
  code: json['code'] as String,
  contractId: json['contractId'] as String?,
  counterpartyEntityId: json['counterpartyEntityId'] as String?,
  counterpartyIndividualId: json['counterpartyIndividualId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String,
  debtId: json['debtId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  expenditureClassId: json['expenditureClassId'] as String?,
  fiscalPeriodId: json['fiscalPeriodId'] as String?,
  flowKindId: json['flowKindId'] as String,
  fundId: json['fundId'] as String?,
  id: json['id'] as String,
  institutionId: json['institutionId'] as String?,
  occurredOn: DateTime.parse(json['occurredOn'] as String),
  projectId: json['projectId'] as String?,
  scopeUnitFeatureId: json['scopeUnitFeatureId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceFlowsToJson(FinanceFlows instance) => <String, dynamic>{
  'amountMinorUnits': instance.amountMinorUnits,
  'appropriationId': ?instance.appropriationId,
  'code': instance.code,
  'contractId': ?instance.contractId,
  'counterpartyEntityId': ?instance.counterpartyEntityId,
  'counterpartyIndividualId': ?instance.counterpartyIndividualId,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': instance.currencyId,
  'debtId': ?instance.debtId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'expenditureClassId': ?instance.expenditureClassId,
  'fiscalPeriodId': ?instance.fiscalPeriodId,
  'flowKindId': instance.flowKindId,
  'fundId': ?instance.fundId,
  'id': instance.id,
  'institutionId': ?instance.institutionId,
  'occurredOn': instance.occurredOn.toIso8601String(),
  'projectId': ?instance.projectId,
  'scopeUnitFeatureId': ?instance.scopeUnitFeatureId,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
