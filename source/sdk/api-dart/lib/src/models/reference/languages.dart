import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'languages.g.dart';

/// The language registry. Every text in the database points here; `und`, `mul` and `zxx` say what a missing language cannot, and a missing language never means English.
@JsonSerializable(includeIfNull: false)
class ReferenceLanguages {
  const ReferenceLanguages({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.directionTerm,
    this.familyTerm,
    this.glottocode,
    required this.id,
    required this.identityKind,
    this.iso6391,
    this.iso6392,
    this.iso6393,
    required this.kindTerm,
    this.parentId,
    this.scriptTerm,
    required this.updatedAt,
    required this.version,
    this.vitalityTerm,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? directionTerm;
  final String? familyTerm;
  final String? glottocode;
  final String id;
  final SharedIdentityKind identityKind;
  final String? iso6391;
  final String? iso6392;
  final String? iso6393;
  final String kindTerm;
  final String? parentId;
  final String? scriptTerm;
  final DateTime updatedAt;
  final int version;
  final String? vitalityTerm;

  factory ReferenceLanguages.fromJson(Map<String, dynamic> json) => _$ReferenceLanguagesFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceLanguagesToJson(this);
}
