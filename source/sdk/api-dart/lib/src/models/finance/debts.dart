import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/finance/money_entity.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'debts.g.dart';

/// One public debt instrument between a borrower and optional lender, with contracted amount and maturity facts.
@JsonSerializable(includeIfNull: false)
class FinanceDebts {
  const FinanceDebts({
    required this.amountMinorUnits,
    required this.borrowerEntityId,
    required this.code,
    this.contractedOn,
    this.countryId,
    required this.createdAt,
    required this.currencyId,
    required this.debtKindId,
    this.deletedAt,
    required this.id,
    this.lenderEntityId,
    this.maturityOn,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final int amountMinorUnits;
  final String borrowerEntityId;
  final String code;
  final DateTime? contractedOn;
  final String? countryId;
  final DateTime createdAt;
  final String currencyId;
  final String debtKindId;
  final DateTime? deletedAt;
  final String id;
  final String? lenderEntityId;
  final DateTime? maturityOn;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory FinanceDebts.fromJson(Map<String, dynamic> json) => _$FinanceDebtsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceDebtsToJson(this);
}
