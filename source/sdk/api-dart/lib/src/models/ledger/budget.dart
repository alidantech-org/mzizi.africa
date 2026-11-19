import 'package:json_annotation/json_annotation.dart';

part 'budget.g.dart';

/// Budget
@JsonSerializable(includeIfNull: false)
class LedgerBudget {
  const LedgerBudget({
    required this.code,
    this.entity,
    this.fiscalFrom,
    this.fiscalTo,
    required this.kind,
    this.latestReleasedOn,
    required this.revisions,
  });
  final String code;
  final String? entity;
  final String? fiscalFrom;
  final String? fiscalTo;
  final String kind;
  final String? latestReleasedOn;
  final int revisions;

  factory LedgerBudget.fromJson(Map<String, dynamic> json) => _$LedgerBudgetFromJson(json);

  Map<String, dynamic> toJson() => _$LedgerBudgetToJson(this);
}
