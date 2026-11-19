import 'package:json_annotation/json_annotation.dart';

part 'content_page_related_category.g.dart';

/// Content Page Related Category
@JsonSerializable(includeIfNull: false)
class InsightsContentPageRelatedCategory {
  const InsightsContentPageRelatedCategory({required this.code, required this.label});
  final String code;
  final String label;

  factory InsightsContentPageRelatedCategory.fromJson(Map<String, dynamic> json) => _$InsightsContentPageRelatedCategoryFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsContentPageRelatedCategoryToJson(this);
}
