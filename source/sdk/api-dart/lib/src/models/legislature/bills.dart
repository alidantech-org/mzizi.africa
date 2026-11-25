import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/governance/holders.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/office_terms.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/legal/instruments.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'bills.g.dart';

/// A bill. Its titles are `identity.names`; its summaries are `legislature.summaries`.
@JsonSerializable(includeIfNull: false)
class LegislatureBills {
  const LegislatureBills({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.identityKind,
    required this.institutionId,
    this.instrumentId,
    required this.kindTerm,
    this.sponsorId,
    required this.statusTerm,
    this.termId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final SharedIdentityKind identityKind;
  final String institutionId;
  final String? instrumentId;
  final String kindTerm;
  final String? sponsorId;
  final String statusTerm;
  final String? termId;
  final DateTime updatedAt;
  final int version;

  factory LegislatureBills.fromJson(Map<String, dynamic> json) => _$LegislatureBillsFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureBillsToJson(this);
}
