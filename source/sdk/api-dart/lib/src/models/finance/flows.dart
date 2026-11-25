import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/finance/appropriations.dart';
import 'package:mzizi_api/src/models/finance/debts.dart';
import 'package:mzizi_api/src/models/finance/funds.dart';
import 'package:mzizi_api/src/models/finance/periods.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/currencies.dart';
import 'package:mzizi_api/src/models/shared/partitioned_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'flows.g.dart';

/// A movement of public money: allocation, transfer, disbursement, payment or receipt.
@JsonSerializable(includeIfNull: false)
class FinanceFlows {
  const FinanceFlows({
    this.amount,
    this.appropriationId,
    this.classTerm,
    this.contractId,
    this.counterpartyId,
    required this.countryId,
    required this.createdAt,
    this.currencyId,
    this.debtId,
    this.deletedAt,
    this.featureId,
    this.fundId,
    required this.id,
    this.institutionId,
    required this.kindTerm,
    this.occurredOn,
    this.periodId,
    this.projectId,
    required this.updatedAt,
    required this.version,
  });
  final int? amount;
  final String? appropriationId;
  final String? classTerm;
  final String? contractId;
  final String? counterpartyId;
  final String countryId;
  final DateTime createdAt;
  final String? currencyId;
  final String? debtId;
  final DateTime? deletedAt;
  final String? featureId;
  final String? fundId;
  final String id;
  final String? institutionId;
  final String kindTerm;
  final DateTime? occurredOn;
  final String? periodId;
  final String? projectId;
  final DateTime updatedAt;
  final int version;

  factory FinanceFlows.fromJson(Map<String, dynamic> json) => _$FinanceFlowsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceFlowsToJson(this);
}
