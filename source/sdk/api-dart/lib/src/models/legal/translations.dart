import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/legal/review_status.dart';
import 'package:mzizi_api/src/enums/legal/translation_method.dart';
import 'package:mzizi_api/src/models/legal/wordings.dart';
import 'package:mzizi_api/src/models/reference/language.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'translations.g.dart';

/// A translated representation of one exact wording. Several translations into one language are valid; review never makes a translation legal authority.
@JsonSerializable(includeIfNull: false)
class LegalTranslations {
  const LegalTranslations({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.languageId,
    required this.method,
    this.notes,
    this.producedAt,
    this.producedBy,
    required this.reviewStatus,
    this.reviewedAt,
    this.reviewedBySnapshot,
    required this.text,
    required this.updatedAt,
    required this.version,
    required this.wordingId,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String languageId;
  final LegalTranslationMethod method;
  final String? notes;
  final DateTime? producedAt;
  final String? producedBy;
  final LegalReviewStatus reviewStatus;
  final DateTime? reviewedAt;
  final String? reviewedBySnapshot;
  final String text;
  final DateTime updatedAt;
  final int version;
  final String wordingId;

  factory LegalTranslations.fromJson(Map<String, dynamic> json) => _$LegalTranslationsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalTranslationsToJson(this);
}
