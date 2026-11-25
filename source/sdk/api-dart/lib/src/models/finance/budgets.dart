import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/finance/periods.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'budgets.g.dart';

/// A government's budget for a fiscal period.
@JsonSerializable(includeIfNull: false)
class FinanceBudgets {
  const FinanceBudgets({
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.governmentId,
    required this.id,
    required this.kindTerm,
    required this.periodId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String governmentId;
  final String id;
  final String kindTerm;
  final String periodId;
  final DateTime updatedAt;
  final int version;

  factory FinanceBudgets.fromJson(Map<String, dynamic> json) => _$FinanceBudgetsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceBudgetsToJson(this);
}
