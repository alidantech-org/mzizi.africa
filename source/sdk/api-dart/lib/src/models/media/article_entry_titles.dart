import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/media/text_origin.dart';
import 'package:mzizi_api/src/enums/media/text_status.dart';

part 'article_entry_titles.g.dart';

/// Article Entry Titles
@JsonSerializable(includeIfNull: false)
class MediaArticleEntryTitles {
  const MediaArticleEntryTitles({required this.languageCode, required this.origin, required this.status, this.summary, required this.title});
  final String languageCode;
  final MediaTextOrigin origin;
  final MediaTextStatus status;
  final String? summary;
  final String title;

  factory MediaArticleEntryTitles.fromJson(Map<String, dynamic> json) => _$MediaArticleEntryTitlesFromJson(json);

  Map<String, dynamic> toJson() => _$MediaArticleEntryTitlesToJson(this);
}
