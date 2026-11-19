import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/finance/appropriations.dart';
import 'package:mzizi_api/src/models/finance/debts.dart';
import 'package:mzizi_api/src/models/finance/fiscal_periods.dart';
import 'package:mzizi_api/src/models/finance/funds.dart';
import 'package:mzizi_api/src/models/finance/money_entity.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'flows.g.dart';

/// One reported financial flow at its source transaction grain, not a rolled-up aggregate.
@JsonSerializable(includeIfNull: false)
class FinanceFlows {
  const FinanceFlows({
    required this.amountMinorUnits,
    this.appropriationId,
    required this.code,
    this.contractId,
    this.counterpartyEntityId,
    this.counterpartyIndividualId,
    required this.createdAt,
    required this.currencyId,
    this.debtId,
    this.deletedAt,
    this.expenditureClassId,
    this.fiscalPeriodId,
    required this.flowKindId,
    this.fundId,
    required this.id,
    this.institutionId,
    required this.occurredOn,
    this.projectId,
    this.scopeUnitFeatureId,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final int amountMinorUnits;
  final String? appropriationId;
  final String code;
  final String? contractId;
  final String? counterpartyEntityId;
  final String? counterpartyIndividualId;
  final DateTime createdAt;
  final String currencyId;
  final String? debtId;
  final DateTime? deletedAt;
  final String? expenditureClassId;
  final String? fiscalPeriodId;
  final String flowKindId;
  final String? fundId;
  final String id;
  final String? institutionId;
  final DateTime occurredOn;
  final String? projectId;
  final String? scopeUnitFeatureId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory FinanceFlows.fromJson(Map<String, dynamic> json) => _$FinanceFlowsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceFlowsToJson(this);
}
