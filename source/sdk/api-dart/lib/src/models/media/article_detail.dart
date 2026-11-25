import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/media/article_detail_texts.dart';

part 'article_detail.g.dart';

/// Article Detail
@JsonSerializable(includeIfNull: false)
class MediaArticleDetail {
  const MediaArticleDetail({
    required this.articleId,
    required this.categoryTerm,
    required this.code,
    this.identityId,
    this.publishedAt,
    required this.texts,
  });
  final String articleId;
  final String categoryTerm;
  final String code;
  final String? identityId;
  final DateTime? publishedAt;
  final List<MediaArticleDetailTexts> texts;

  factory MediaArticleDetail.fromJson(Map<String, dynamic> json) => _$MediaArticleDetailFromJson(json);

  Map<String, dynamic> toJson() => _$MediaArticleDetailToJson(this);
}
