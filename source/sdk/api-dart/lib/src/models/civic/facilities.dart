import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'facilities.g.dart';

/// A public facility; it shares its geography feature's identity, so "near me" is a spatial query on the feature.
@JsonSerializable(includeIfNull: false)
class CivicFacilities {
  const CivicFacilities({
    required this.classTerm,
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.fromYear,
    required this.id,
    required this.identityKind,
    this.institutionId,
    this.operatorId,
    this.ownerId,
    this.ownershipTerm,
    this.startsOn,
    this.statusTerm,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String classTerm;
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final int? fromYear;
  final String id;
  final SharedIdentityKind identityKind;
  final String? institutionId;
  final String? operatorId;
  final String? ownerId;
  final String? ownershipTerm;
  final DateTime? startsOn;
  final String? statusTerm;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory CivicFacilities.fromJson(Map<String, dynamic> json) => _$CivicFacilitiesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicFacilitiesToJson(this);
}
