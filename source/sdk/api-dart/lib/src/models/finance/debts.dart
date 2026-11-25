import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/currencies.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'debts.g.dart';

/// A public debt (a loan or bond).
@JsonSerializable(includeIfNull: false)
class FinanceDebts {
  const FinanceDebts({
    this.amount,
    required this.borrowerId,
    required this.code,
    this.contractedOn,
    required this.countryId,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    required this.lenderId,
    this.maturityOn,
    required this.updatedAt,
    required this.version,
  });
  final int? amount;
  final String borrowerId;
  final String code;
  final DateTime? contractedOn;
  final String countryId;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final String lenderId;
  final DateTime? maturityOn;
  final DateTime updatedAt;
  final int version;

  factory FinanceDebts.fromJson(Map<String, dynamic> json) => _$FinanceDebtsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceDebtsToJson(this);
}
