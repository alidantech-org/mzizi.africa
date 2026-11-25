import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'institutions.g.dart';

/// A public institution; it shares its organisation's identity (`official.entities`). Committees are institutions linked to their house.
@JsonSerializable(includeIfNull: false)
class GovernanceInstitutions {
  const GovernanceInstitutions({
    this.armTerm,
    this.basisTerm,
    this.classTerm,
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.fromYear,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    this.startsOn,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String? armTerm;
  final String? basisTerm;
  final String? classTerm;
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final int? fromYear;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final DateTime? startsOn;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernanceInstitutions.fromJson(Map<String, dynamic> json) => _$GovernanceInstitutionsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceInstitutionsToJson(this);
}
