import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';

part 'individuals.g.dart';

/// A person in public life. Display names are `identity.names`; name parts are `official.parts`.
@JsonSerializable(includeIfNull: false)
class OfficialIndividuals {
  const OfficialIndividuals({
    this.birthDate,
    this.birthYear,
    required this.code,
    required this.createdAt,
    this.deathDate,
    this.deathYear,
    this.deletedAt,
    required this.id,
    required this.identityKind,
    required this.updatedAt,
    required this.version,
  });
  final DateTime? birthDate;
  final int? birthYear;
  final String code;
  final DateTime createdAt;
  final DateTime? deathDate;
  final int? deathYear;
  final DateTime? deletedAt;
  final String id;
  final SharedIdentityKind identityKind;
  final DateTime updatedAt;
  final int version;

  factory OfficialIndividuals.fromJson(Map<String, dynamic> json) => _$OfficialIndividualsFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialIndividualsToJson(this);
}
