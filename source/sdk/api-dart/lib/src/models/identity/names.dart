import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/partitioned_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'names.g.dart';

/// Display names of named things in every language, with kind, script and valid period. Where a name came from is recorded in `source.evidence`.
@JsonSerializable(includeIfNull: false)
class IdentityNames {
  const IdentityNames({
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.identityId,
    required this.identityKind,
    required this.isDefault,
    required this.kindTerm,
    required this.languageId,
    this.scriptTerm,
    required this.text,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final String identityId;
  final SharedIdentityKind identityKind;
  final bool isDefault;
  final String kindTerm;
  final String languageId;
  final String? scriptTerm;
  final String text;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory IdentityNames.fromJson(Map<String, dynamic> json) => _$IdentityNamesFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityNamesToJson(this);
}
