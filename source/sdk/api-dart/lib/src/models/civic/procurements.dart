import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/currencies.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'procurements.g.dart';

/// A tender. Its title is an `identity.names` row and its tender number an `identity.identifiers` row.
@JsonSerializable(includeIfNull: false)
class CivicProcurements {
  const CivicProcurements({
    this.amount,
    this.bidderCount,
    required this.buyerId,
    required this.categoryTerm,
    this.closesOn,
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    this.evaluationTerm,
    required this.id,
    required this.identityKind,
    this.natureTerm,
    required this.procedureTerm,
    this.projectId,
    this.publishedOn,
    required this.statusTerm,
    required this.updatedAt,
    required this.version,
  });
  final int? amount;
  final int? bidderCount;
  final String buyerId;
  final String categoryTerm;
  final DateTime? closesOn;
  final String code;
  final String countryId;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final String? evaluationTerm;
  final String id;
  final SharedIdentityKind identityKind;
  final String? natureTerm;
  final String procedureTerm;
  final String? projectId;
  final DateTime? publishedOn;
  final String statusTerm;
  final DateTime updatedAt;
  final int version;

  factory CivicProcurements.fromJson(Map<String, dynamic> json) => _$CivicProcurementsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicProcurementsToJson(this);
}
