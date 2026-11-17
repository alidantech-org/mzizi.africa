import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/reference/language_name_kind.dart';
import 'package:mzizi_api/src/models/reference/language.dart';
import 'package:mzizi_api/src/models/shared/validity_entity.dart';

part 'language_name.g.dart';

/// A name of a language written in a language, such as Kiswahili (endonym) and Swahili (exonym).
@JsonSerializable(includeIfNull: false)
class ReferenceLanguageName {
  const ReferenceLanguageName({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.inLanguageId,
    required this.languageId,
    required this.name,
    required this.nameKind,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String inLanguageId;
  final String languageId;
  final String name;
  final ReferenceLanguageNameKind nameKind;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final int version;

  factory ReferenceLanguageName.fromJson(Map<String, dynamic> json) => _$ReferenceLanguageNameFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceLanguageNameToJson(this);
}
