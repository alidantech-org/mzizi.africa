import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/media/text_origin.dart';
import 'package:mzizi_api/src/enums/media/text_status.dart';

part 'article_detail_texts.g.dart';

/// Article Detail Texts
@JsonSerializable(includeIfNull: false)
class MediaArticleDetailTexts {
  const MediaArticleDetailTexts({
    required this.body,
    required this.languageCode,
    required this.origin,
    required this.status,
    this.summary,
    required this.title,
  });
  final String body;
  final String languageCode;
  final MediaTextOrigin origin;
  final MediaTextStatus status;
  final String? summary;
  final String title;

  factory MediaArticleDetailTexts.fromJson(Map<String, dynamic> json) => _$MediaArticleDetailTextsFromJson(json);

  Map<String, dynamic> toJson() => _$MediaArticleDetailTextsToJson(this);
}
