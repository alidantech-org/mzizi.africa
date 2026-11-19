import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/content_page_content.dart';
import 'package:mzizi_api/src/models/insights/content_page_related.dart';

part 'content_page.g.dart';

/// Content Page
@JsonSerializable(includeIfNull: false)
class InsightsContentPage {
  const InsightsContentPage({required this.content, required this.gaps, required this.related});
  final InsightsContentPageContent content;
  final List<String> gaps;
  final List<InsightsContentPageRelated> related;

  factory InsightsContentPage.fromJson(Map<String, dynamic> json) => _$InsightsContentPageFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentPageToJson(this);
}
