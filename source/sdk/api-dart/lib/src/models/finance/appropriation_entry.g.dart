// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'appropriation_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceAppropriationEntry _$FinanceAppropriationEntryFromJson(Map<String, dynamic> json) => FinanceAppropriationEntry(
  amount: (json['amount'] as num?)?.toInt(),
  appropriationId: json['appropriationId'] as String,
  classTerm: json['classTerm'] as String,
  code: json['code'] as String,
  currencyCode: json['currencyCode'] as String?,
  featureId: json['featureId'] as String?,
  parentId: json['parentId'] as String?,
  projectId: json['projectId'] as String?,
  recipientId: json['recipientId'] as String?,
);

Map<String, dynamic> _$FinanceAppropriationEntryToJson(FinanceAppropriationEntry instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'appropriationId': instance.appropriationId,
  'classTerm': instance.classTerm,
  'code': instance.code,
  'currencyCode': ?instance.currencyCode,
  'featureId': ?instance.featureId,
  'parentId': ?instance.parentId,
  'projectId': ?instance.projectId,
  'recipientId': ?instance.recipientId,
};
