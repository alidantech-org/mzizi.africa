import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/reference/levels.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'positions.g.dart';

/// A kind of seat that law creates (Governor, Member of County Assembly). Its titles are `identity.names`.
@JsonSerializable(includeIfNull: false)
class GovernancePositions {
  const GovernancePositions({
    this.basisTerm,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.exposureTerm,
    required this.id,
    required this.identityKind,
    this.institutionId,
    this.levelId,
    this.methodTerm,
    this.position,
    this.provisionId,
    required this.roleTerm,
    this.seatCount,
    this.seatLevelId,
    this.termLimit,
    this.termYears,
    required this.updatedAt,
    required this.version,
  });
  final String? basisTerm;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? exposureTerm;
  final String id;
  final SharedIdentityKind identityKind;
  final String? institutionId;
  final String? levelId;
  final String? methodTerm;
  final int? position;
  final String? provisionId;
  final String roleTerm;
  final int? seatCount;
  final String? seatLevelId;
  final int? termLimit;
  final int? termYears;
  final DateTime updatedAt;
  final int version;

  factory GovernancePositions.fromJson(Map<String, dynamic> json) => _$GovernancePositionsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernancePositionsToJson(this);
}
