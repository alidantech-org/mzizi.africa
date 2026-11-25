// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'debts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceDebts _$FinanceDebtsFromJson(Map<String, dynamic> json) => FinanceDebts(
  amount: (json['amount'] as num?)?.toInt(),
  borrowerId: json['borrowerId'] as String,
  code: json['code'] as String,
  contractedOn: json['contractedOn'] == null ? null : DateTime.parse(json['contractedOn'] as String),
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  identityKind: $enumDecode(_$SharedIdentityKindEnumMap, json['identityKind']),
  kindTerm: json['kindTerm'] as String,
  lenderId: json['lenderId'] as String,
  maturityOn: json['maturityOn'] == null ? null : DateTime.parse(json['maturityOn'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceDebtsToJson(FinanceDebts instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'borrowerId': instance.borrowerId,
  'code': instance.code,
  'contractedOn': ?instance.contractedOn?.toIso8601String(),
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'identityKind': _$SharedIdentityKindEnumMap[instance.identityKind]!,
  'kindTerm': instance.kindTerm,
  'lenderId': instance.lenderId,
  'maturityOn': ?instance.maturityOn?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$SharedIdentityKindEnumMap = {
  SharedIdentityKind.app: 'app',
  SharedIdentityKind.bill: 'bill',
  SharedIdentityKind.coalition: 'coalition',
  SharedIdentityKind.collection: 'collection',
  SharedIdentityKind.country: 'country',
  SharedIdentityKind.currency: 'currency',
  SharedIdentityKind.debt: 'debt',
  SharedIdentityKind.election: 'election',
  SharedIdentityKind.entity: 'entity',
  SharedIdentityKind.era: 'era',
  SharedIdentityKind.event: 'event',
  SharedIdentityKind.feature: 'feature',
  SharedIdentityKind.function: 'function',
  SharedIdentityKind.fund: 'fund',
  SharedIdentityKind.hierarchy: 'hierarchy',
  SharedIdentityKind.indicator: 'indicator',
  SharedIdentityKind.individual: 'individual',
  SharedIdentityKind.instrument: 'instrument',
  SharedIdentityKind.language: 'language',
  SharedIdentityKind.level: 'level',
  SharedIdentityKind.metric: 'metric',
  SharedIdentityKind.occurrence: 'occurrence',
  SharedIdentityKind.office: 'office',
  SharedIdentityKind.position: 'position',
  SharedIdentityKind.procedure: 'procedure',
  SharedIdentityKind.procurement: 'procurement',
  SharedIdentityKind.product: 'product',
  SharedIdentityKind.project: 'project',
  SharedIdentityKind.service: 'service',
  SharedIdentityKind.timezone: 'timezone',
  SharedIdentityKind.unit: 'unit',
};
