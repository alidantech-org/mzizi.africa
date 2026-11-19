import 'package:json_annotation/json_annotation.dart';

part 'content_list_items_front_matter.g.dart';

/// Content List Items Front Matter
@JsonSerializable(includeIfNull: false)
class InsightsContentListItemsFrontMatter {
  const InsightsContentListItemsFrontMatter({this.image});
  final String? image;

  factory InsightsContentListItemsFrontMatter.fromJson(Map<String, dynamic> json) => _$InsightsContentListItemsFrontMatterFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentListItemsFrontMatterToJson(this);
}
