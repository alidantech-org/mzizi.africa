import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/media/article_entry.dart';

part 'article_collection.g.dart';

/// Article Collection
@JsonSerializable(includeIfNull: false)
class MediaArticleCollection {
  const MediaArticleCollection({required this.articles});
  final List<MediaArticleEntry> articles;

  factory MediaArticleCollection.fromJson(Map<String, dynamic> json) => _$MediaArticleCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$MediaArticleCollectionToJson(this);
}
