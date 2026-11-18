import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/finance/budget_versions.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'appropriations.g.dart';

/// One classified amount authorized in a budget version, optionally nested and assigned to a project or unit.
@JsonSerializable(includeIfNull: false)
class FinanceAppropriations {
  const FinanceAppropriations({
    required this.amountMinorUnits,
    required this.budgetVersionId,
    required this.classificationId,
    required this.code,
    required this.createdAt,
    required this.currencyId,
    this.deletedAt,
    required this.id,
    this.parentAppropriationId,
    this.projectId,
    this.recipientEntityId,
    this.sourceCitationId,
    this.unitFeatureId,
    required this.updatedAt,
    required this.version,
  });
  final int amountMinorUnits;
  final String budgetVersionId;
  final String classificationId;
  final String code;
  final DateTime createdAt;
  final String currencyId;
  final DateTime? deletedAt;
  final String id;
  final String? parentAppropriationId;
  final String? projectId;
  final String? recipientEntityId;
  final String? sourceCitationId;
  final String? unitFeatureId;
  final DateTime updatedAt;
  final int version;

  factory FinanceAppropriations.fromJson(Map<String, dynamic> json) => _$FinanceAppropriationsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceAppropriationsToJson(this);
}
