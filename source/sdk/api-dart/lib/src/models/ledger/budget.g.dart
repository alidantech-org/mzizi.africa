// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'budget.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LedgerBudget _$LedgerBudgetFromJson(Map<String, dynamic> json) => LedgerBudget(
  code: json['code'] as String,
  entity: json['entity'] as String?,
  fiscalFrom: json['fiscalFrom'] as String?,
  fiscalTo: json['fiscalTo'] as String?,
  kind: json['kind'] as String,
  latestReleasedOn: json['latestReleasedOn'] as String?,
  revisions: (json['revisions'] as num).toInt(),
);

Map<String, dynamic> _$LedgerBudgetToJson(LedgerBudget instance) => <String, dynamic>{
  'code': instance.code,
  'entity': ?instance.entity,
  'fiscalFrom': ?instance.fiscalFrom,
  'fiscalTo': ?instance.fiscalTo,
  'kind': instance.kind,
  'latestReleasedOn': ?instance.latestReleasedOn,
  'revisions': instance.revisions,
};
