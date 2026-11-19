import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/ledger/budget.dart';

part 'budget_list.g.dart';

/// Budget List
@JsonSerializable(includeIfNull: false)
class LedgerBudgetList {
  const LedgerBudgetList({required this.budgets, required this.gaps});
  final List<LedgerBudget> budgets;
  final List<String> gaps;

  factory LedgerBudgetList.fromJson(Map<String, dynamic> json) => _$LedgerBudgetListFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerBudgetListToJson(this);
}
