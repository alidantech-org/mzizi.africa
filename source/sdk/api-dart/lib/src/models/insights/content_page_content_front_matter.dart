import 'package:json_annotation/json_annotation.dart';

part 'content_page_content_front_matter.g.dart';

/// Content Page Content Front Matter
@JsonSerializable(includeIfNull: false)
class InsightsContentPageContentFrontMatter {
  const InsightsContentPageContentFrontMatter({required this.citationId});
  final String citationId;

  factory InsightsContentPageContentFrontMatter.fromJson(Map<String, dynamic> json) => _$InsightsContentPageContentFrontMatterFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentPageContentFrontMatterToJson(this);
}
