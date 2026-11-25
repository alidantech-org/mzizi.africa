// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'budget_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceBudgetEntry _$FinanceBudgetEntryFromJson(Map<String, dynamic> json) => FinanceBudgetEntry(
  budgetId: json['budgetId'] as String,
  code: json['code'] as String,
  endsOn: DateTime.parse(json['endsOn'] as String),
  kindTerm: json['kindTerm'] as String,
  periodCode: json['periodCode'] as String,
  periodId: json['periodId'] as String,
  revisions: (json['revisions'] as List<dynamic>).map((e) => FinanceBudgetEntryRevisions.fromJson(e as Map<String, dynamic>)).toList(),
  startsOn: DateTime.parse(json['startsOn'] as String),
);

Map<String, dynamic> _$FinanceBudgetEntryToJson(FinanceBudgetEntry instance) => <String, dynamic>{
  'budgetId': instance.budgetId,
  'code': instance.code,
  'endsOn': instance.endsOn.toIso8601String(),
  'kindTerm': instance.kindTerm,
  'periodCode': instance.periodCode,
  'periodId': instance.periodId,
  'revisions': instance.revisions,
  'startsOn': instance.startsOn.toIso8601String(),
};
