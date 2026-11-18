import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/finance/budgets.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'budget_versions.g.dart';

/// One ordered release or revision of a budget, preserving original and supplementary versions separately.
@JsonSerializable(includeIfNull: false)
class FinanceBudgetVersions {
  const FinanceBudgetVersions({
    required this.budgetId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.releasedOn,
    required this.revision,
    this.sourceCitationId,
    required this.statusId,
    required this.updatedAt,
    required this.version,
  });
  final String budgetId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final DateTime? releasedOn;
  final int revision;
  final String? sourceCitationId;
  final String statusId;
  final DateTime updatedAt;
  final int version;

  factory FinanceBudgetVersions.fromJson(Map<String, dynamic> json) => _$FinanceBudgetVersionsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceBudgetVersionsToJson(this);
}
