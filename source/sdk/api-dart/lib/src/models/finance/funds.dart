import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/governance/jurisdictions.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'funds.g.dart';

/// A public fund (NG-CDF).
@JsonSerializable(includeIfNull: false)
class FinanceFunds {
  const FinanceFunds({
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    this.managerId,
    this.scopeId,
    this.sourceTerm,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final String? managerId;
  final String? scopeId;
  final String? sourceTerm;
  final DateTime updatedAt;
  final int version;

  factory FinanceFunds.fromJson(Map<String, dynamic> json) => _$FinanceFundsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceFundsToJson(this);
}
