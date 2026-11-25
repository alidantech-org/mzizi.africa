import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'hierarchies.g.dart';

/// One way a country divides itself for a period (Kenya administrative 1963–2013, Kenya administrative 2013–, Kenya electoral). Places are geography features linked through `geography.relationships`.
@JsonSerializable(includeIfNull: false)
class ReferenceHierarchies {
  const ReferenceHierarchies({
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.identityKind,
    required this.isRouting,
    required this.kindTerm,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final SharedIdentityKind identityKind;
  final bool isRouting;
  final String kindTerm;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory ReferenceHierarchies.fromJson(Map<String, dynamic> json) => _$ReferenceHierarchiesFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceHierarchiesToJson(this);
}
