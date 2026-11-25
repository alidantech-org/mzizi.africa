// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'budget_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceBudgetCollection _$FinanceBudgetCollectionFromJson(Map<String, dynamic> json) => FinanceBudgetCollection(
  budgets: (json['budgets'] as List<dynamic>).map((e) => FinanceBudgetEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$FinanceBudgetCollectionToJson(FinanceBudgetCollection instance) => <String, dynamic>{'budgets': instance.budgets};
