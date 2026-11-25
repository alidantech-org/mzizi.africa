import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'government_budgets.g.dart';

/// Government Budgets
@JsonSerializable(includeIfNull: false)
class FinanceGovernmentBudgets {
  const FinanceGovernmentBudgets({required this.governmentId, this.limit, this.offset});
  final String governmentId;
  final int? limit;
  final int? offset;

  factory FinanceGovernmentBudgets.fromJson(Map<String, dynamic> json) => _$FinanceGovernmentBudgetsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceGovernmentBudgetsToJson(this);
}
