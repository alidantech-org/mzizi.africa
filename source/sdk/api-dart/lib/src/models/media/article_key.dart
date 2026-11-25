import 'package:json_annotation/json_annotation.dart';

part 'article_key.g.dart';

/// Article Key
@JsonSerializable(includeIfNull: false)
class MediaArticleKey {
  const MediaArticleKey({required this.code});
  final String code;

  factory MediaArticleKey.fromJson(Map<String, dynamic> json) => _$MediaArticleKeyFromJson(json);

  Map<String, dynamic> toJson() => _$MediaArticleKeyToJson(this);
}
