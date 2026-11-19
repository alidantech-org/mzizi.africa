// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'budget_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LedgerBudgetList _$LedgerBudgetListFromJson(Map<String, dynamic> json) => LedgerBudgetList(
  budgets: (json['budgets'] as List<dynamic>).map((e) => LedgerBudget.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
);

Map<String, dynamic> _$LedgerBudgetListToJson(LedgerBudgetList instance) => <String, dynamic>{
  'budgets': instance.budgets,
  'gaps': instance.gaps,
};
