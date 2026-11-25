import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/media/text_origin.dart';
import 'package:mzizi_api/src/enums/media/text_status.dart';
import 'package:mzizi_api/src/models/media/articles.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'texts.g.dart';

/// One article in one language: exactly one original per article, at most one live text per language.
@JsonSerializable(includeIfNull: false)
class MediaTexts {
  const MediaTexts({
    required this.articleId,
    required this.body,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.languageId,
    required this.origin,
    required this.status,
    this.summary,
    required this.title,
    this.translatedFromId,
    required this.updatedAt,
    required this.version,
  });
  final String articleId;
  final String body;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String languageId;
  final MediaTextOrigin origin;
  final MediaTextStatus status;
  final String? summary;
  final String title;
  final String? translatedFromId;
  final DateTime updatedAt;
  final int version;

  factory MediaTexts.fromJson(Map<String, dynamic> json) => _$MediaTextsFromJson(json);

  Map<String, dynamic> toJson() => _$MediaTextsToJson(this);
}
