import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/finance/budget_entry.dart';

part 'budget_collection.g.dart';

/// Budget Collection
@JsonSerializable(includeIfNull: false)
class FinanceBudgetCollection {
  const FinanceBudgetCollection({required this.budgets});
  final List<FinanceBudgetEntry> budgets;

  factory FinanceBudgetCollection.fromJson(Map<String, dynamic> json) => _$FinanceBudgetCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceBudgetCollectionToJson(this);
}
