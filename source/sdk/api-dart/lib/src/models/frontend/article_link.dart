import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/localized_text.dart';

part 'article_link.g.dart';

/// Article Link
@JsonSerializable(includeIfNull: false)
class FrontendArticleLink {
  const FrontendArticleLink({required this.code, required this.title});
  final String code;
  final SharedLocalizedText title;

  factory FrontendArticleLink.fromJson(Map<String, dynamic> json) => _$FrontendArticleLinkFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendArticleLinkToJson(this);
}
