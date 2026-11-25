// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'government_budgets.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceGovernmentBudgets _$FinanceGovernmentBudgetsFromJson(Map<String, dynamic> json) => FinanceGovernmentBudgets(
  governmentId: json['governmentId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$FinanceGovernmentBudgetsToJson(FinanceGovernmentBudgets instance) => <String, dynamic>{
  'governmentId': instance.governmentId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
