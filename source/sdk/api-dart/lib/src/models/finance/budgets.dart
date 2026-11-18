import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/finance/fiscal_periods.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'budgets.g.dart';

/// One institutional/country budget identity for a fiscal period and budget classification.
@JsonSerializable(includeIfNull: false)
class FinanceBudgets {
  const FinanceBudgets({
    required this.budgetKindId,
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.fiscalPeriodId,
    this.governmentEntityId,
    required this.id,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final String budgetKindId;
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String fiscalPeriodId;
  final String? governmentEntityId;
  final String id;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory FinanceBudgets.fromJson(Map<String, dynamic> json) => _$FinanceBudgetsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceBudgetsToJson(this);
}
