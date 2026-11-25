import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/vocabulary/label_kind.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/schemes.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'labels.g.dart';

/// Every word for a term or scheme, per language and optional country. Labels have no dates; a changed meaning is a new term.
@JsonSerializable(includeIfNull: false)
class VocabularyLabels {
  const VocabularyLabels({
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.kind,
    required this.languageId,
    this.schemeId,
    this.termId,
    required this.text,
    required this.updatedAt,
    required this.version,
  });
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final VocabularyLabelKind kind;
  final String languageId;
  final String? schemeId;
  final String? termId;
  final String text;
  final DateTime updatedAt;
  final int version;

  factory VocabularyLabels.fromJson(Map<String, dynamic> json) => _$VocabularyLabelsFromJson(json);

  Map<String, dynamic> toJson() => _$VocabularyLabelsToJson(this);
}
