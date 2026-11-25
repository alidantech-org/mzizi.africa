import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/finance/periods.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/currencies.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'findings.g.dart';

/// An audit finding about an institution in a fiscal period.
@JsonSerializable(includeIfNull: false)
class FinanceFindings {
  const FinanceFindings({
    this.amount,
    required this.code,
    this.contractId,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    this.flowCountryId,
    this.flowId,
    required this.id,
    required this.institutionId,
    required this.kindTerm,
    required this.periodId,
    this.projectId,
    required this.statusTerm,
    required this.updatedAt,
    required this.version,
  });
  final int? amount;
  final String code;
  final String? contractId;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final String? flowCountryId;
  final String? flowId;
  final String id;
  final String institutionId;
  final String kindTerm;
  final String periodId;
  final String? projectId;
  final String statusTerm;
  final DateTime updatedAt;
  final int version;

  factory FinanceFindings.fromJson(Map<String, dynamic> json) => _$FinanceFindingsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceFindingsToJson(this);
}
