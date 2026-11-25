import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/jurisdictions.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'projects.g.dart';

/// A public project. Its names and descriptions are `identity.names`; its places are `civic.sites`.
@JsonSerializable(includeIfNull: false)
class CivicProjects {
  const CivicProjects({
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.fromYear,
    required this.id,
    required this.identityKind,
    this.implementerId,
    this.institutionId,
    this.scopeId,
    this.sponsorId,
    this.startsOn,
    required this.statusTerm,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final int? fromYear;
  final String id;
  final SharedIdentityKind identityKind;
  final String? implementerId;
  final String? institutionId;
  final String? scopeId;
  final String? sponsorId;
  final DateTime? startsOn;
  final String statusTerm;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory CivicProjects.fromJson(Map<String, dynamic> json) => _$CivicProjectsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicProjectsToJson(this);
}
