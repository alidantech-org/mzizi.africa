import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/finance/budget_entry_revisions.dart';

part 'budget_entry.g.dart';

/// Budget Entry
@JsonSerializable(includeIfNull: false)
class FinanceBudgetEntry {
  const FinanceBudgetEntry({
    required this.budgetId,
    required this.code,
    required this.endsOn,
    required this.kindTerm,
    required this.periodCode,
    required this.periodId,
    required this.revisions,
    required this.startsOn,
  });
  final String budgetId;
  final String code;
  final DateTime endsOn;
  final String kindTerm;
  final String periodCode;
  final String periodId;
  final List<FinanceBudgetEntryRevisions> revisions;
  final DateTime startsOn;

  factory FinanceBudgetEntry.fromJson(Map<String, dynamic> json) => _$FinanceBudgetEntryFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceBudgetEntryToJson(this);
}
