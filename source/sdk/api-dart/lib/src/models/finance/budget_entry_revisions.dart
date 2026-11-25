import 'package:json_annotation/json_annotation.dart';

part 'budget_entry_revisions.g.dart';

/// Budget Entry Revisions
@JsonSerializable(includeIfNull: false)
class FinanceBudgetEntryRevisions {
  const FinanceBudgetEntryRevisions({this.releasedOn, required this.revision, required this.revisionId, required this.statusTerm});
  final DateTime? releasedOn;
  final int revision;
  final String revisionId;
  final String statusTerm;

  factory FinanceBudgetEntryRevisions.fromJson(Map<String, dynamic> json) => _$FinanceBudgetEntryRevisionsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceBudgetEntryRevisionsToJson(this);
}
