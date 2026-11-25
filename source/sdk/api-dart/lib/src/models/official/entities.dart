import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'entities.g.dart';

/// An organisation. Institutions, parties and publishers share their organisation's identity; regional bodies (EAC, AU) are entities with dated memberships.
@JsonSerializable(includeIfNull: false)
class OfficialEntities {
  const OfficialEntities({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.dissolvedOn,
    this.fromYear,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    this.registeredOn,
    this.registrationCountryId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? dissolvedOn;
  final int? fromYear;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final DateTime? registeredOn;
  final String? registrationCountryId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory OfficialEntities.fromJson(Map<String, dynamic> json) => _$OfficialEntitiesFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialEntitiesToJson(this);
}
