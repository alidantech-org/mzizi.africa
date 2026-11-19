import 'package:json_annotation/json_annotation.dart';

part 'content_page_related_front_matter.g.dart';

/// Content Page Related Front Matter
@JsonSerializable(includeIfNull: false)
class InsightsContentPageRelatedFrontMatter {
  const InsightsContentPageRelatedFrontMatter({required this.citationId, required this.parent});
  final String citationId;
  final String parent;

  factory InsightsContentPageRelatedFrontMatter.fromJson(Map<String, dynamic> json) => _$InsightsContentPageRelatedFrontMatterFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentPageRelatedFrontMatterToJson(this);
}
