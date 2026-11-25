import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/legal/review_status.dart';
import 'package:mzizi_api/src/enums/legal/translation_method.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/legal/wordings.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'translations.g.dart';

/// Mzizi's own unofficial translation of a wording; never legal authority.
@JsonSerializable(includeIfNull: false)
class LegalTranslations {
  const LegalTranslations({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.languageId,
    required this.method,
    this.notes,
    required this.review,
    this.reviewedAt,
    this.reviewedById,
    required this.text,
    required this.updatedAt,
    required this.version,
    required this.wordingId,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String languageId;
  final LegalTranslationMethod method;
  final String? notes;
  final LegalReviewStatus review;
  final DateTime? reviewedAt;
  final String? reviewedById;
  final String text;
  final DateTime updatedAt;
  final int version;
  final String wordingId;

  factory LegalTranslations.fromJson(Map<String, dynamic> json) => _$LegalTranslationsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalTranslationsToJson(this);
}
