import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'language.g.dart';

/// A language, macrolanguage, variety or one of the special no-language codes, with its ISO 639 and Glottolog identifiers and its classification as scheme values.
@JsonSerializable(includeIfNull: false)
class ReferenceLanguage {
  const ReferenceLanguage({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.directionId,
    this.familyId,
    this.glottocode,
    required this.id,
    this.iso6391,
    this.iso6392,
    this.iso6393,
    required this.kindId,
    required this.name,
    this.parentId,
    this.scriptId,
    this.statusId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? directionId;
  final String? familyId;
  final String? glottocode;
  final String id;
  final String? iso6391;
  final String? iso6392;
  final String? iso6393;
  final String kindId;
  final String name;
  final String? parentId;
  final String? scriptId;
  final String? statusId;
  final DateTime updatedAt;
  final int version;

  factory ReferenceLanguage.fromJson(Map<String, dynamic> json) => _$ReferenceLanguageFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceLanguageToJson(this);
}
