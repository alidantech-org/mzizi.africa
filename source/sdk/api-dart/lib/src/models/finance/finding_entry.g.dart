// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'finding_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceFindingEntry _$FinanceFindingEntryFromJson(Map<String, dynamic> json) => FinanceFindingEntry(
  amount: (json['amount'] as num?)?.toInt(),
  code: json['code'] as String,
  contractId: json['contractId'] as String?,
  currencyCode: json['currencyCode'] as String?,
  findingId: json['findingId'] as String,
  kindTerm: json['kindTerm'] as String,
  periodId: json['periodId'] as String,
  projectId: json['projectId'] as String?,
  statusTerm: json['statusTerm'] as String,
);

Map<String, dynamic> _$FinanceFindingEntryToJson(FinanceFindingEntry instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'code': instance.code,
  'contractId': ?instance.contractId,
  'currencyCode': ?instance.currencyCode,
  'findingId': instance.findingId,
  'kindTerm': instance.kindTerm,
  'periodId': instance.periodId,
  'projectId': ?instance.projectId,
  'statusTerm': instance.statusTerm,
};
