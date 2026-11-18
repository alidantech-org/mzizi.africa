import 'package:json_annotation/json_annotation.dart';

part 'content_page.g.dart';

/// Content Page
@JsonSerializable(includeIfNull: false)
class InsightsContentPage {
  const InsightsContentPage({this.content, required this.gaps, required this.related});
  final Object? content;
  final List<String> gaps;
  final List<Object?> related;

  factory InsightsContentPage.fromJson(Map<String, dynamic> json) => _$InsightsContentPageFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentPageToJson(this);
}
