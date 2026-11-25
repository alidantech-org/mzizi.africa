import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/finance/budgets.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'revisions.g.dart';

/// The original or a supplementary version of a budget.
@JsonSerializable(includeIfNull: false)
class FinanceRevisions {
  const FinanceRevisions({
    required this.budgetId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.releasedOn,
    required this.revision,
    required this.statusTerm,
    required this.updatedAt,
    required this.version,
  });
  final String budgetId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final DateTime? releasedOn;
  final int revision;
  final String statusTerm;
  final DateTime updatedAt;
  final int version;

  factory FinanceRevisions.fromJson(Map<String, dynamic> json) => _$FinanceRevisionsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceRevisionsToJson(this);
}
