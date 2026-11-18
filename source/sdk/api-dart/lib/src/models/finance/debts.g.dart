// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'debts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceDebts _$FinanceDebtsFromJson(Map<String, dynamic> json) => FinanceDebts(
  amountMinorUnits: (json['amountMinorUnits'] as num).toInt(),
  borrowerEntityId: json['borrowerEntityId'] as String,
  code: json['code'] as String,
  contractedOn: json['contractedOn'] == null ? null : DateTime.parse(json['contractedOn'] as String),
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String,
  debtKindId: json['debtKindId'] as String,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  lenderEntityId: json['lenderEntityId'] as String?,
  maturityOn: json['maturityOn'] == null ? null : DateTime.parse(json['maturityOn'] as String),
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceDebtsToJson(FinanceDebts instance) => <String, dynamic>{
  'amountMinorUnits': instance.amountMinorUnits,
  'borrowerEntityId': instance.borrowerEntityId,
  'code': instance.code,
  'contractedOn': ?instance.contractedOn?.toIso8601String(),
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': instance.currencyId,
  'debtKindId': instance.debtKindId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'lenderEntityId': ?instance.lenderEntityId,
  'maturityOn': ?instance.maturityOn?.toIso8601String(),
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
