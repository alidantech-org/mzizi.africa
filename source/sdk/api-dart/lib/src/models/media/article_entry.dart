import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/media/article_entry_titles.dart';

part 'article_entry.g.dart';

/// Article Entry
@JsonSerializable(includeIfNull: false)
class MediaArticleEntry {
  const MediaArticleEntry({required this.articleId, required this.categoryTerm, required this.code, this.publishedAt, required this.titles});
  final String articleId;
  final String categoryTerm;
  final String code;
  final DateTime? publishedAt;
  final List<MediaArticleEntryTitles> titles;

  factory MediaArticleEntry.fromJson(Map<String, dynamic> json) => _$MediaArticleEntryFromJson(json);

  Map<String, dynamic> toJson() => _$MediaArticleEntryToJson(this);
}
